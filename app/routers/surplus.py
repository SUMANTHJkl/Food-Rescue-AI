from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from ml.safety_risk_scoring import compute_safety_score

router = APIRouter(prefix="/surplus", tags=["surplus"])


@router.post("", response_model=schemas.SurplusOut, status_code=201)
def create_surplus(payload: schemas.SurplusCreate, db: Session = Depends(get_db)):
    kitchen = db.query(models.Kitchen).filter(models.Kitchen.id == payload.kitchen_id).first()
    if not kitchen:
        raise HTTPException(status_code=404, detail="Kitchen not found")

    prep_time = payload.prep_time or datetime.utcnow()
    hours_since_prep = (datetime.utcnow() - prep_time).total_seconds() / 3600.0

    # Auto compute safety risk score
    safety = compute_safety_score(payload.perishable_category, hours_since_prep, payload.storage_temp)

    batch = models.SurplusBatch(
        kitchen_id=payload.kitchen_id,
        food_item=payload.food_item,
        description=payload.description,
        perishable_category=payload.perishable_category,
        quantity=payload.quantity,
        unit=payload.unit,
        prep_time=prep_time,
        expiry_time=payload.expiry_time,
        storage_temp=payload.storage_temp,
        risk_score=safety["risk_score"],
        safety_class=safety["safety_classification"],
        status="classified" if safety["safety_classification"] != "DISCARD" else "discarded"
    )
    db.add(batch)
    db.commit()
    db.refresh(batch)

    # Trigger alert if safety class is DISCARD or PRIORITY_DONATE
    if safety["safety_classification"] == "DISCARD":
        alert = models.Alert(
            kitchen_id=payload.kitchen_id,
            severity="critical",
            message=f"Surplus Batch #{batch.id} ({payload.food_item}, {payload.quantity}kg) flagged DISCARD - unsafe for donation."
        )
        db.add(alert)
        db.commit()
    elif safety["safety_classification"] == "PRIORITY_DONATE":
        alert = models.Alert(
            kitchen_id=payload.kitchen_id,
            severity="warning",
            message=f"Surplus Batch #{batch.id} ({payload.food_item}, {payload.quantity}kg) PRIORITY_DONATE - urgent dispatch required."
        )
        db.add(alert)
        db.commit()

    return batch


@router.get("", response_model=List[schemas.SurplusOut])
def list_surplus(
    kitchen_id: Optional[int] = None,
    status_filter: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(models.SurplusBatch)
    if kitchen_id:
        query = query.filter(models.SurplusBatch.kitchen_id == kitchen_id)
    if status_filter:
        query = query.filter(models.SurplusBatch.status == status_filter)
    return query.order_by(models.SurplusBatch.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{batch_id}", response_model=schemas.SurplusOut)
def get_surplus_batch(batch_id: int, db: Session = Depends(get_db)):
    batch = db.query(models.SurplusBatch).filter(models.SurplusBatch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Surplus batch not found")
    return batch


@router.put("/{batch_id}/status", response_model=schemas.SurplusOut)
def update_surplus_status(batch_id: int, new_status: str, db: Session = Depends(get_db)):
    batch = db.query(models.SurplusBatch).filter(models.SurplusBatch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Surplus batch not found")
    batch.status = new_status
    db.commit()
    db.refresh(batch)
    return batch

