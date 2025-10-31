import React, {useState} from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default function Upload(){
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle')

  async function handleUpload(e){
    e.preventDefault()
    if(!file) return
    setStatus('uploading')

    const filename = `${Date.now()}_${file.name}`
    const { data, error } = await supabase.storage
      .from('pdfs-originals')
      .upload(filename, file, { upsert: false })

    if(error){
      setStatus('error: upload')
      console.error(error)
      return
    }

    try{
      const resp = await fetch('/api/process', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ filename: file.name, path: data.path })
      })
      if(!resp.ok){
        const txt = await resp.text()
        throw new Error(txt || 'process failed')
      }
      setStatus('submitted')
    }catch(err){
      console.error(err)
      setStatus('error: ' + err.message)
    }
  }

  return (
    <form onSubmit={handleUpload} style={{display:'grid',gap:10,maxWidth:600}}>
      <input type="file" accept="application/pdf" onChange={e=>setFile(e.target.files[0])} />
      <button type="submit">Upload & Protect</button>
      <div>Status: {status}</div>
      <p style={{fontSize:12,color:'#666'}}>Uploads file to Supabase storage then calls the serverless API to process it.</p>
    </form>
  )
}
