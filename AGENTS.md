# Agent Context - FoodRescue AI (SIH 2026, PS-26234, Caffeine Coders)

## Stack
Python 3.11 + FastAPI + SQLAlchemy + PostgreSQL | scikit-learn ML | React 18 + Vite frontend.

## Conventions
- Pipeline stage folders: ingestion -> processing -> ml -> matching -> redistribution.
- All endpoints live in app/routers with APIRouter(prefix=..., tags=[...]).
- Never commit .env, data/raw, data/processed, data/models.
- Food safety first: every redistribution must pass security/safety_gates.py before matching.
- Keep the closed loop: every delivered batch should emit feedback for retraining.
