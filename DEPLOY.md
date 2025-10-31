## Deploy on Vercel

1. Create a new project on Vercel and link this repo.
2. Set Environment Variables for frontend:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
3. For API (Vercel):
   - SUPABASE_URL
   - SUPABASE_SERVICE_KEY
   - WORKER_URL (public HTTPS endpoint of the worker)
4. Build & Deploy frontend (Vercel will run `npm run build`).
5. Deploy worker as Docker container (Cloud Run / Render), set:
   - SUPABASE_URL
   - SUPABASE_SERVICE_KEY
   - SIGN_P12_PATH (mount .p12 into container)
   - SIGN_P12_PASS
