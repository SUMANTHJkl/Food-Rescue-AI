from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class SurplusCreate(BaseModel):
    kitchen_id: int
    description: Optional[str] = None
    quantity: float
    unit: str = "kg"


class SurplusOut(SurplusCreate):
    id: int
    status: str = "pending"
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
