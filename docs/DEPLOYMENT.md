# Deployment

## Docker (any cloud VM)
1. Set env vars in .env (strong DB password + JWT secret).
2. docker compose up -d --build
3. Put Nginx/Caddy in front for HTTPS.

## Managed options
- API: Render / Railway / AWS ECS (uses Dockerfile)
- DB: Neon / Supabase / RDS PostgreSQL
- Frontend: Vercel / Netlify (frontend/, npm run build)
- Set CORS allow_origins to your deployed frontend URL in app/main.py.
