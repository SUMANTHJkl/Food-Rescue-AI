from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/farmers", tags=["farmers"])


@router.get("", response_model=List[schemas.FarmerOut])
def list_farmers(db: Session = Depends(get_db)):
    return db.query(models.FarmerPartner).all()


@router.post("", response_model=schemas.FarmerOut, status_code=201)
def create_farmer(payload: schemas.FarmerCreate, db: Session = Depends(get_db)):
    farmer = models.FarmerPartner(**payload.model_dump())
    db.add(farmer)
    db.commit()
    db.refresh(farmer)
    return farmer


@router.get("/biowaste", response_model=List[schemas.SurplusOut])
def list_available_biowaste(db: Session = Depends(get_db)):
    """
    Returns food batches that are classified as DISCARD or status biowaste_available.
    Rationally available for farmers / composting / animal feed!
    """
    return (
        db.query(models.SurplusBatch)
        .filter(
            (models.SurplusBatch.safety_class == "DISCARD") | 
            (models.SurplusBatch.status == "biowaste_available")
        )
        .order_by(models.SurplusBatch.created_at.desc())
        .all()
    )


@router.post("/claim", response_model=schemas.BioWasteClaimOut, status_code=201)
def claim_biowaste_for_farm(payload: schemas.BioWasteClaimCreate, db: Session = Depends(get_db)):
    batch = db.query(models.SurplusBatch).filter(models.SurplusBatch.id == payload.surplus_batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Biowaste batch not found")

    farmer = db.query(models.FarmerPartner).filter(models.FarmerPartner.id == payload.farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer partner not found")

    claim = models.BioWasteClaim(
        surplus_batch_id=payload.surplus_batch_id,
        farmer_id=payload.farmer_id,
        claimed_kg=payload.claimed_kg,
        purpose=payload.purpose,
        status="claimed"
    )
    db.add(claim)
    batch.status = "biowaste_claimed"
    db.commit()
    db.refresh(claim)
    return claim
