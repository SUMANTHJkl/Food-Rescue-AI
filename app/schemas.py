from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr


# --- Auth & User Schemas ---
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: str = "kitchen_staff"
    kitchen_id: Optional[int] = None
    ngo_id: Optional[int] = None


class UserCreate(UserBase):
    password: str


class UserOut(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


# --- Kitchen Schemas ---
class KitchenBase(BaseModel):
    name: str
    type: str = "canteen"
    address: Optional[str] = None
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    capacity_meals: int = 500


class KitchenCreate(KitchenBase):
    pass


class KitchenOut(KitchenBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# --- Inventory Schemas ---
class InventoryCreate(BaseModel):
    kitchen_id: int
    item_name: str
    category: str = "cooked_meals"
    quantity: float
    unit: str = "kg"
    prep_date: Optional[datetime] = None
    expiry_at: Optional[datetime] = None
    storage_temp: str = "ambient"
    quality_status: str = "good"


class InventoryOut(InventoryCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


# --- Surplus Batch Schemas ---
class SurplusCreate(BaseModel):
    kitchen_id: int
    food_item: str = "Mixed Meals"
    description: Optional[str] = None
    perishable_category: str = "cooked_meals"
    quantity: float
    unit: str = "kg"
    prep_time: Optional[datetime] = None
    expiry_time: Optional[datetime] = None
    storage_temp: str = "ambient"


class SurplusOut(SurplusCreate):
    id: int
    status: str = "pending"
    safety_class: str = "SAFE_DONATE"
    risk_score: float = 0.0
    predicted_demand: float = 0.0
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# --- NGO Partner Schemas ---
class NGOCreate(BaseModel):
    name: str
    type: str = "ngo"
    contact: Optional[str] = None
    phone: Optional[str] = None
    capacity_kg: float = 100.0
    refrigeration_capacity: bool = True
    operating_hours: str = "08:00 - 20:00"
    lat: Optional[float] = None
    lng: Optional[float] = None
    delivery_radius_km: float = 15.0


class NGOOut(NGOCreate):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# --- Matching Schemas ---
class MatchResult(BaseModel):
    ngo_id: int
    ngo_name: str
    match_score: float
    distance_km: float
    urgency_level: str
    quantity_allocated: float
    capacity_kg: float
    refrigeration: bool


class MatchOut(BaseModel):
    id: int
    surplus_batch_id: int
    ngo_id: int
    match_score: float
    distance_km: float
    urgency_level: str
    quantity_allocated: float
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# --- Redistribution Schemas ---
class RedistributionCreate(BaseModel):
    surplus_batch_id: int
    ngo_id: int
    match_id: Optional[int] = None
    driver_name: Optional[str] = None
    driver_phone: Optional[str] = None
    urgency: str = "normal"


class RedistributionUpdate(BaseModel):
    status: str  # assigned | picked_up | in_transit | delivered | cancelled
    proof_notes: Optional[str] = None
    actual_delivery: Optional[datetime] = None


class RedistributionOut(BaseModel):
    id: int
    surplus_batch_id: int
    ngo_id: int
    match_id: Optional[int] = None
    driver_name: Optional[str] = None
    driver_phone: Optional[str] = None
    urgency: str
    status: str
    pickup_time: Optional[datetime] = None
    estimated_delivery: Optional[datetime] = None
    actual_delivery: Optional[datetime] = None
    proof_notes: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# --- Prediction Schemas ---
class PredictionRequest(BaseModel):
    kitchen_id: int
    day_of_week: Optional[int] = None  # 0=Monday, 6=Sunday
    expected_headcount: Optional[int] = 500
    meal_type: str = "lunch"  # breakfast | lunch | dinner


class PredictionOut(BaseModel):
    predicted_surplus_kg: float
    confidence_score: float
    recommended_reduction_tips: List[str]


class SafetyScoreRequest(BaseModel):
    food_category: str  # cooked_meals | produce | dairy | bakery | packaged
    hours_since_prep: float
    storage_temp: str = "ambient"  # ambient | chilled | frozen


class SafetyScoreOut(BaseModel):
    risk_score: float  # 0.0 (safe) to 1.0 (unsafe)
    safety_classification: str  # SAFE_DONATE | PRIORITY_DONATE | DISCARD
    remaining_safe_hours: float
    recommendation: str


# --- Alert & Analytics Schemas ---
class AlertOut(BaseModel):
    id: int
    kitchen_id: Optional[int] = None
    ngo_id: Optional[int] = None
    severity: str
    message: str
    is_read: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class AnalyticsSummary(BaseModel):
    total_surplus_reported_kg: float
    total_meals_rescued: int
    total_co2_prevented_kg: float
    active_kitchens_count: int
    ngo_partners_count: int
    successful_redistributions: int
    average_match_time_minutes: float

