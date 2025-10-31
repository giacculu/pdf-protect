import fs from 'fs/promises'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import express from 'express'
import { createClient } from '@supabase/supabase-js'

const run = promisify(exec)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

async function processJob(body){
  const { document_id, original_path } = body
  const tmpDir = '/tmp/work'
  await fs.mkdir(tmpDir, {recursive:true})
  const originalLocal = path.join(tmpDir, 'original.pdf')

  const { data:downloadData, error:dlErr } = await supabase.storage
    .from('pdfs-originals')
    .download(original_path)
  if(dlErr) throw dlErr
  const arrayBuffer = await downloadData.arrayBuffer()
  await fs.writeFile(originalLocal, Buffer.from(arrayBuffer))

  await run(`pdftoppm -png ${originalLocal} ${path.join(tmpDir, 'page')}`)

  const files = await fs.readdir(tmpDir)
  const pages = files.filter(f=>f.startsWith('page') && f.endsWith('.png')).sort()
  for(const p of pages){
    const inPath = path.join(tmpDir, p)
    const outPath = path.join(tmpDir, 'wm_'+p)
    await run(`convert ${inPath} -gravity southeast -pointsize 36 -fill white -undercolor '#00000080' -annotate +20+20 "Documento originale firmato" ${outPath}`)
  }

  const wmPages = pages.map(p=>path.join(tmpDir,'wm_'+p)).join(' ')
  const rebuiltPdf = path.join(tmpDir,'rebuilt.pdf')
  await run(`convert ${wmPages} ${rebuiltPdf}`)

  const signedPdf = path.join(tmpDir,'signed.pdf')
  await run(`node /worker/sign.js ${rebuiltPdf} ${signedPdf}`)

  const signedBuff = await fs.readFile(signedPdf)
  const destPath = `processed/${document_id}_signed.pdf`
  const { error:upErr } = await supabase.storage
    .from('pdfs-processed')
    .upload(destPath, signedBuff, { upsert: true })
  if(upErr) throw upErr

  await supabase.from('documents').update({ processed_path: destPath, status: 'done' }).eq('id', document_id)
  await supabase.from('processing_jobs').insert({ document_id, status: 'success' })
}

const app = express()
app.use(express.json({limit:'50mb'}))
app.post('/process', async (req,res)=>{
  try{
    await processJob(req.body)
    res.json({ok:true})
  }catch(e){
    console.error(e)
    res.status(500).json({error: String(e)})
  }
})

const port = process.env.PORT || 8080
app.listen(port, ()=>console.log('worker listening', port))
