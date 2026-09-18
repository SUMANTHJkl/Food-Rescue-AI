# Architecture

## Pipeline (closed loop)
ingestion/ -> processing/ (+PostgreSQL) -> ml/ -> matching/ -> redistribution/ -> frontend/ -> back to ingestion (continuous learning)

## Components
- **app/** FastAPI REST API, one router per domain, /healthz.
- **matching flow:** security/safety_gates.py -> surplus_classifier -> quantity_matcher -> urgency_matcher -> location_matcher (geopy).
- **ml/:** demand_forecast (time series), surplus_prediction, waste_pattern, safety_risk_scoring; models stored in data/models.
- **services/feedback_loop.py + retraining.py:** closed-loop learning from delivery outcomes.
- **observability/:** structured logs, Prometheus metrics, tracing.

## Data Model
kitchens, inventory, surplus_batches, ngo_partners, redistributions, alerts (see app/models.py).
