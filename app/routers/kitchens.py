from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/kitchens", tags=["kitchens"])


@router.get("", response_model=List[schemas.KitchenOut])
def list_kitchens(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return db.query(models.Kitchen).offset(skip).limit(limit).all()


@router.post("", response_model=schemas.KitchenOut, status_code=201)
def create_kitchen(payload: schemas.KitchenCreate, db: Session = Depends(get_db)):
    kitchen = models.Kitchen(**payload.model_dump())
    db.add(kitchen)
    db.commit()
    db.refresh(kitchen)
    return kitchen


@router.get("/{kitchen_id}", response_model=schemas.KitchenOut)
def get_kitchen(kitchen_id: int, db: Session = Depends(get_db)):
    kitchen = db.query(models.Kitchen).filter(models.Kitchen.id == kitchen_id).first()
    if not kitchen:
        raise HTTPException(status_code=404, detail="Kitchen not found")
    return kitchen


@router.put("/{kitchen_id}", response_model=schemas.KitchenOut)
def update_kitchen(kitchen_id: int, payload: schemas.KitchenCreate, db: Session = Depends(get_db)):
    kitchen = db.query(models.Kitchen).filter(models.Kitchen.id == kitchen_id).first()
    if not kitchen:
        raise HTTPException(status_code=404, detail="Kitchen not found")
    for key, value in payload.model_dump().items():
        setattr(kitchen, key, value)
    db.commit()
    db.refresh(kitchen)
    return kitchen


@router.delete("/{kitchen_id}", status_code=204)
def delete_kitchen(kitchen_id: int, db: Session = Depends(get_db)):
    kitchen = db.query(models.Kitchen).filter(models.Kitchen.id == kitchen_id).first()
    if not kitchen:
        raise HTTPException(status_code=404, detail="Kitchen not found")
    db.delete(kitchen)
    db.commit()
    return None

