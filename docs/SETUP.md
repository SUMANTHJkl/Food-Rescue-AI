# Setup

## Backend
1. python -m venv .venv && .venv\Scripts\activate
2. pip install -r requirements.txt
3. copy .env.example .env (edit values)
4. docker compose up -d db redis
5. uvicorn app.main:app --reload

## Frontend
1. cd frontend && npm install
2. npm run dev

## Full stack via Docker
docker compose up --build
