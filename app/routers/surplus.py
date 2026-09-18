from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/surplus", tags=["surplus"])


@router.post("", response_model=schemas.SurplusOut)
def create_surplus(payload: schemas.SurplusCreate, db: Session = Depends(get_db)):
    batch = models.SurplusBatch(**payload.model_dump())
    db.add(batch)
    db.commit()
    db.refresh(batch)
    return batch


@router.get("", response_model=list[schemas.SurplusOut])
def list_surplus(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return db.query(models.SurplusBatch).offset(skip).limit(limit).all()
