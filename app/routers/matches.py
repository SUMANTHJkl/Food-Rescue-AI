from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from matching.surplus_classifier import match_surplus_to_ngos

router = APIRouter(prefix="/matches", tags=["matches"])


@router.post("/run/{batch_id}", response_model=List[schemas.MatchResult])
def run_matchmaking_for_batch(batch_id: int, db: Session = Depends(get_db)):
    batch = db.query(models.SurplusBatch).filter(models.SurplusBatch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Surplus batch not found")
    if batch.status == "discarded" or batch.safety_class == "DISCARD":
        raise HTTPException(status_code=400, detail="Cannot match batch marked DISCARD")

    kitchen = db.query(models.Kitchen).filter(models.Kitchen.id == batch.kitchen_id).first()
    ngos = db.query(models.NGOPartner).all()

    if not ngos:
        raise HTTPException(status_code=404, detail="No registered NGO partners found")

    kitchen_dict = {"id": kitchen.id, "lat": kitchen.lat, "lng": kitchen.lng}
    batch_dict = {
        "id": batch.id,
        "quantity": batch.quantity,
        "risk_score": batch.risk_score,
        "storage_temp": batch.storage_temp
    }
    ngo_dicts = [
        {
            "id": ngo.id,
            "name": ngo.name,
            "lat": ngo.lat,
            "lng": ngo.lng,
            "capacity_kg": ngo.capacity_kg,
            "refrigeration_capacity": ngo.refrigeration_capacity,
            "delivery_radius_km": ngo.delivery_radius_km,
        }
        for ngo in ngos
    ]

    ranked = match_surplus_to_ngos(batch_dict, kitchen_dict, ngo_dicts)

    # Persist top matches into DB
    for r in ranked:
        existing = (
            db.query(models.Match)
            .filter(models.Match.surplus_batch_id == batch_id, models.Match.ngo_id == r["ngo_id"])
            .first()
        )
        if not existing:
            match_rec = models.Match(
                surplus_batch_id=batch_id,
                ngo_id=r["ngo_id"],
                match_score=r["match_score"],
                distance_km=r["distance_km"],
                urgency_level=r["urgency_level"],
                quantity_allocated=r["quantity_allocated"],
                status="proposed"
            )
            db.add(match_rec)

    batch.status = "matched"
    db.commit()

    return ranked


@router.get("", response_model=List[schemas.MatchOut])
def list_matches(surplus_batch_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.Match)
    if surplus_batch_id:
        query = query.filter(models.Match.surplus_batch_id == surplus_batch_id)
    return query.order_by(models.Match.match_score.desc()).all()


@router.post("/{match_id}/accept", response_model=schemas.RedistributionOut)
def accept_match(match_id: int, db: Session = Depends(get_db)):
    match_rec = db.query(models.Match).filter(models.Match.id == match_id).first()
    if not match_rec:
        raise HTTPException(status_code=404, detail="Match record not found")

    match_rec.status = "accepted"

    # Automatically create a Redistribution order
    redist = models.Redistribution(
        surplus_batch_id=match_rec.surplus_batch_id,
        ngo_id=match_rec.ngo_id,
        match_id=match_rec.id,
        urgency=match_rec.urgency_level,
        status="assigned"
    )
    db.add(redist)

    batch = db.query(models.SurplusBatch).filter(models.SurplusBatch.id == match_rec.surplus_batch_id).first()
    if batch:
        batch.status = "in_transit"

    db.commit()
    db.refresh(redist)
    return redist

