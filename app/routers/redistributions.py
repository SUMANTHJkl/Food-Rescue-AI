from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/redistributions", tags=["redistributions"])


@router.get("", response_model=List[schemas.RedistributionOut])
def list_redistributions(
    status_filter: Optional[str] = None,
    driver_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Redistribution)
    if status_filter:
        query = query.filter(models.Redistribution.status == status_filter)
    if driver_id:
        query = query.filter(models.Redistribution.driver_id == driver_id)
    return query.order_by(models.Redistribution.created_at.desc()).all()


@router.post("", response_model=schemas.RedistributionOut, status_code=201)
def create_redistribution(payload: schemas.RedistributionCreate, db: Session = Depends(get_db)):
    batch = db.query(models.SurplusBatch).filter(models.SurplusBatch.id == payload.surplus_batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Surplus batch not found")

    ngo = db.query(models.NGOPartner).filter(models.NGOPartner.id == payload.ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO partner not found")

    redist = models.Redistribution(
        surplus_batch_id=payload.surplus_batch_id,
        ngo_id=payload.ngo_id,
        match_id=payload.match_id,
        driver_name=payload.driver_name,
        driver_phone=payload.driver_phone,
        urgency=payload.urgency,
        status="assigned",
        created_at=datetime.utcnow()
    )
    db.add(redist)
    batch.status = "in_transit"
    db.commit()
    db.refresh(redist)
    return redist


@router.put("/{redist_id}/status", response_model=schemas.RedistributionOut)
def update_redistribution_status(
    redist_id: int,
    payload: schemas.RedistributionUpdate,
    db: Session = Depends(get_db)
):
    redist = db.query(models.Redistribution).filter(models.Redistribution.id == redist_id).first()
    if not redist:
        raise HTTPException(status_code=404, detail="Redistribution record not found")

    redist.status = payload.status
    if payload.proof_notes:
        redist.proof_notes = payload.proof_notes

    if payload.status == "picked_up":
        redist.pickup_time = datetime.utcnow()
    elif payload.status == "delivered":
        redist.actual_delivery = payload.actual_delivery or datetime.utcnow()
        batch = db.query(models.SurplusBatch).filter(models.SurplusBatch.id == redist.surplus_batch_id).first()
        if batch:
            batch.status = "delivered"

    db.commit()
    db.refresh(redist)
    return redist

