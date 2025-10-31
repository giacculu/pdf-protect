import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
const WORKER_URL = process.env.WORKER_URL

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end()
  const { filename, path } = req.body
  if(!filename || !path) return res.status(400).json({error:'missing'})

  const { data:doc, error:docErr } = await supabase
    .from('documents')
    .insert({ filename, original_path: path })
    .select()

  if(docErr) return res.status(500).json({error: docErr.message})
  const document = doc[0]

  const { data:job, error:jobErr } = await supabase
    .from('processing_jobs')
    .insert({ document_id: document.id, status: 'pending' })
    .select()

  if(jobErr) return res.status(500).json({error: jobErr.message})

  try{
    const r = await fetch(WORKER_URL, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ document_id: document.id, original_path: path })
    })
    if(!r.ok) throw new Error('worker failed')
  }catch(err){
    await supabase.from('processing_jobs').update({status:'failed', logs: err.message}).eq('id', job[0].id)
    return res.status(500).json({error: err.message})
  }

  res.status(200).json({ok: true, document_id: document.id})
}
