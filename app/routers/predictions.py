from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from ml.safety_risk_scoring import compute_safety_score
from ml.surplus_prediction import predict_kitchen_surplus

router = APIRouter(prefix="/predictions", tags=["predictions"])


@router.post("/surplus", response_model=schemas.PredictionOut)
def predict_surplus_endpoint(payload: schemas.PredictionRequest, db: Session = Depends(get_db)):
    kitchen = db.query(models.Kitchen).filter(models.Kitchen.id == payload.kitchen_id).first()
    if not kitchen:
        raise HTTPException(status_code=404, detail="Kitchen not found")

    dow = payload.day_of_week if payload.day_of_week is not None else datetime.utcnow().weekday()
    headcount = payload.expected_headcount or kitchen.capacity_meals or 500

    res = predict_kitchen_surplus(
        kitchen_id=payload.kitchen_id,
        day_of_week=dow,
        expected_headcount=headcount,
        meal_type=payload.meal_type
    )
    return res


@router.post("/safety-score", response_model=schemas.SafetyScoreOut)
def compute_safety_score_endpoint(payload: schemas.SafetyScoreRequest):
    res = compute_safety_score(
        food_category=payload.food_category,
        hours_since_prep=payload.hours_since_prep,
        storage_temp=payload.storage_temp
    )
    return res

