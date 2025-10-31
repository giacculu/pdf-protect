# PDF Protect Automation

Progetto completo: frontend Vite+React, API (Vercel), worker Docker che processa PDF (convert -> watermark -> rebuild -> sign),
e script SQL per Supabase.

**Target deployment**
- Frontend: Vercel (direct deploy)
- API: Vercel serverless (serverless Node endpoint)
- Worker: Docker container (Cloud Run / Render / DigitalOcean App Platform)
- Storage & DB: Supabase

Secrets & notes:
- Do **not** commit your SUPABASE_SERVICE_KEY or .p12 certificate.
- Provide SIGN_P12_PATH (or mount .p12) and SIGN_P12_PASS as env vars to the worker.
