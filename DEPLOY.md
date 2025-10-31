# Deploy instructions

1. On Vercel, create a new project from this repo.
2. Set Root Directory = `/` (root).
3. Environment Variables:
   - For frontend (build): VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
   - For API (serverless): SUPABASE_URL, SUPABASE_SERVICE_KEY, WORKER_URL
4. Deploy worker separately (Cloud Run / Render). Set worker envs:
   - SUPABASE_URL, SUPABASE_SERVICE_KEY, SIGN_P12_PATH, SIGN_P12_PASS
5. Ensure Supabase buckets: pdfs-originals and pdfs-processed, and run infra/supabase.sql
