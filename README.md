# PDF Protect - Single Directory Version

Questo repository contiene TUTTO dentro una singola directory per un deploy semplice su Vercel:
- frontend (Vite + React)
- api (serverless functions in /api)
- worker (Dockerized processing worker)
- infra/supabase.sql

Impostazioni principali:
- Root Directory su Vercel: `/` (la root del repository)
- Vercel userà `package.json` in root per build del frontend e servirà le funzioni in `/api`.

Attenzione:
- Non committare `SUPABASE_SERVICE_KEY` o file `.p12`.
- Monta il `.p12` nel container worker o usa Secret Manager.
