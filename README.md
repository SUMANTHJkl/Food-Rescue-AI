# FoodRescue AI

**AI-Powered Smart Food Waste Reduction and Sustainable Redistribution Ecosystem for Institutional Kitchens and Food Processing Units**

| | |
|---|---|
| Problem Statement ID | **26234** |
| Theme | Agriculture, FoodTech & Rural Development |
| PS Category | Software |
| Team | **Caffeine Coders** |
| Event | Smart India Hackathon 2026 |

## Overview
A closed-loop platform that helps institutional kitchens (canteens, hostel messes,
food processing units) **predict demand, prevent overproduction, classify surplus
safely, and redistribute it to NGOs / food banks / shelters** - reducing food waste,
operational cost, and food insecurity.

**Loop:** Collect -> Clean -> Predict -> Decide -> Redistribute -> Learn

## Features (mapped to the 6-stage pipeline)
| # | Stage | Folder | What it does |
|---|-------|--------|--------------|
| 1 | Data Collection | `ingestion/` | food prepared, consumption, inventory/stock, expiry & quality, historical demand |
| 2 | Data Processing & Storage | `processing/` | Python preprocessing + PostgreSQL storage |
| 3 | AI/ML Engine | `ml/` | demand forecasting (time series), surplus prediction, waste pattern analysis, safety/risk scoring |
| 4 | Decision & Matching Engine | `matching/` | surplus classification (safe/reusable/donate), quantity, urgency & location matching |
| 5 | Redistribution Platform | `redistribution/` | NGO/food-bank/shelter directory, notifications, route & delivery tracking |
| 6 | Dashboard & Feedback | `frontend/` | analytics dashboard (waste, savings, impact), alerts, continuous learning |

## Tech Stack
Python (data processing) | FastAPI (backend API) | React (frontend) | PostgreSQL (database) |
ML models (prediction & analysis) | REST API (integration) | Docker + Cloud deployment

## Quickstart - Backend
```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
docker compose up -d db redis
uvicorn app.main:app --reload
```
Swagger UI: http://localhost:8000/docs

## Quickstart - Frontend
```bash
cd frontend
npm install
npm run dev
```
App: http://localhost:5173

## Project Structure
```text
food-rescue-ai/
├── app/            # FastAPI app, config, DB models, routers
├── ingestion/      # Stage 1: data collection feeds
├── processing/     # Stage 2: preprocessing, validation, feature store
├── ml/             # Stage 3: forecasting, surplus prediction, risk scoring
├── matching/       # Stage 4: classify + quantity/urgency/location matching
├── redistribution/ # Stage 5: NGO directory, routing, notifications, tracking
├── services/       # caching, feedback loop, retraining
├── security/       # auth, RBAC, food-safety gates
├── evaluation/     # golden tests, model regression
├── observability/  # logging, metrics, tracing
├── data/           # raw / processed / models / seed
├── scripts/        # seed_database, run_pipeline, retrain_models
├── frontend/       # React + Vite dashboard
├── tests/          # pytest suites
└── docs/           # architecture, setup, API, deployment
```

## Research & References
- Biodigesters for Sustainable Food Waste Management - https://www.mdpi.com/1660-4601/22/3/382
- Revolutionizing the food industry: The transformative power of artificial intelligence - ScienceDirect
- AI in food system: Innovative approach to minimizing food spoilage and food waste - ScienceDirect
- Cross-Sectoral AI Integration Is Essential to Tackling Food Waste and Food Insecurity - Advanced Intelligent Systems (Wiley)

## License
MIT (c) 2026 Caffeine Coders
