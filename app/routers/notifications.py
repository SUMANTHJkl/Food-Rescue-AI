from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", response_model=List[schemas.AlertOut])
def list_alerts(
    kitchen_id: Optional[int] = None,
    ngo_id: Optional[int] = None,
    unread_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(models.Alert)
    if kitchen_id:
        query = query.filter(models.Alert.kitchen_id == kitchen_id)
    if ngo_id:
        query = query.filter(models.Alert.ngo_id == ngo_id)
    if unread_only:
        query = query.filter(models.Alert.is_read == False)
    return query.order_by(models.Alert.created_at.desc()).all()


@router.put("/{alert_id}/read", response_model=schemas.AlertOut)
def mark_alert_read(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.is_read = True
    db.commit()
    db.refresh(alert)
    return alert

