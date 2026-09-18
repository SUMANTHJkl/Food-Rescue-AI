from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/inventory", tags=["inventory"])


@router.get("", response_model=List[schemas.InventoryOut])
def list_inventory(kitchen_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.InventoryItem)
    if kitchen_id:
        query = query.filter(models.InventoryItem.kitchen_id == kitchen_id)
    return query.all()


@router.post("", response_model=schemas.InventoryOut, status_code=201)
def add_inventory_item(payload: schemas.InventoryCreate, db: Session = Depends(get_db)):
    kitchen = db.query(models.Kitchen).filter(models.Kitchen.id == payload.kitchen_id).first()
    if not kitchen:
        raise HTTPException(status_code=404, detail="Kitchen not found")
    item = models.InventoryItem(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=204)
def delete_inventory_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.InventoryItem).filter(models.InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return None

