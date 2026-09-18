from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    role = Column(String(50), default="kitchen_staff")  # admin | kitchen_staff | ngo_admin | driver
    kitchen_id = Column(Integer, ForeignKey("kitchens.id"), nullable=True)
    ngo_id = Column(Integer, ForeignKey("ngo_partners.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Kitchen(Base):
    __tablename__ = "kitchens"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    type = Column(String(50), default="canteen")  # canteen | mess | processing_unit | event
    address = Column(Text, nullable=True)
    contact_person = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    capacity_meals = Column(Integer, default=500)
    created_at = Column(DateTime, default=datetime.utcnow)

    inventory_items = relationship("InventoryItem", back_populates="kitchen")
    surplus_batches = relationship("SurplusBatch", back_populates="kitchen")


class InventoryItem(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    kitchen_id = Column(Integer, ForeignKey("kitchens.id"), nullable=False)
    item_name = Column(String(255), nullable=False)
    category = Column(String(100), default="cooked_meals")  # cooked_meals | produce | dairy | bakery | packaged
    quantity = Column(Float, default=0.0)
    unit = Column(String(20), default="kg")
    prep_date = Column(DateTime, nullable=True)
    expiry_at = Column(DateTime, nullable=True)
    storage_temp = Column(String(50), default="ambient")  # ambient | chilled | frozen
    quality_status = Column(String(50), default="good")  # good | doubtful | unsafe

    kitchen = relationship("Kitchen", back_populates="inventory_items")


class SurplusBatch(Base):
    __tablename__ = "surplus_batches"

    id = Column(Integer, primary_key=True, index=True)
    kitchen_id = Column(Integer, ForeignKey("kitchens.id"), nullable=False)
    food_item = Column(String(255), nullable=False, default="Mixed Meals")
    description = Column(Text, nullable=True)
    perishable_category = Column(String(100), default="cooked_meals")
    quantity = Column(Float, nullable=False)
    unit = Column(String(20), default="kg")
    prep_time = Column(DateTime, default=datetime.utcnow)
    expiry_time = Column(DateTime, nullable=True)
    storage_temp = Column(String(50), default="ambient")
    status = Column(String(50), default="pending")  # pending | classified | matched | in_transit | delivered | discarded
    safety_class = Column(String(50), default="SAFE_DONATE")  # SAFE_DONATE | PRIORITY_DONATE | DISCARD
    risk_score = Column(Float, default=0.0)
    predicted_demand = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    kitchen = relationship("Kitchen", back_populates="surplus_batches")
    matches = relationship("Match", back_populates="surplus_batch")
    redistributions = relationship("Redistribution", back_populates="surplus_batch")


class NGOPartner(Base):
    __tablename__ = "ngo_partners"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    type = Column(String(50), default="ngo")  # ngo | food_bank | shelter | community_kitchen
    contact = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    capacity_kg = Column(Float, default=100.0)
    refrigeration_capacity = Column(Boolean, default=True)
    operating_hours = Column(String(100), default="08:00 - 20:00")
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    delivery_radius_km = Column(Float, default=15.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    matches = relationship("Match", back_populates="ngo")
    redistributions = relationship("Redistribution", back_populates="ngo")


class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    surplus_batch_id = Column(Integer, ForeignKey("surplus_batches.id"), nullable=False)
    ngo_id = Column(Integer, ForeignKey("ngo_partners.id"), nullable=False)
    match_score = Column(Float, default=0.0)
    distance_km = Column(Float, default=0.0)
    urgency_level = Column(String(50), default="normal")  # critical | high | normal
    quantity_allocated = Column(Float, default=0.0)
    status = Column(String(50), default="proposed")  # proposed | accepted | rejected | completed
    created_at = Column(DateTime, default=datetime.utcnow)

    surplus_batch = relationship("SurplusBatch", back_populates="matches")
    ngo = relationship("NGOPartner", back_populates="matches")


class Redistribution(Base):
    __tablename__ = "redistributions"

    id = Column(Integer, primary_key=True, index=True)
    surplus_batch_id = Column(Integer, ForeignKey("surplus_batches.id"), nullable=False)
    ngo_id = Column(Integer, ForeignKey("ngo_partners.id"), nullable=False)
    match_id = Column(Integer, ForeignKey("matches.id"), nullable=True)
    driver_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    driver_name = Column(String(255), nullable=True)
    driver_phone = Column(String(50), nullable=True)
    urgency = Column(String(50), default="normal")  # critical | high | normal
    status = Column(String(50), default="assigned")  # assigned | picked_up | in_transit | delivered | cancelled
    pickup_time = Column(DateTime, nullable=True)
    estimated_delivery = Column(DateTime, nullable=True)
    actual_delivery = Column(DateTime, nullable=True)
    proof_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    surplus_batch = relationship("SurplusBatch", back_populates="redistributions")
    ngo = relationship("NGOPartner", back_populates="redistributions")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    kitchen_id = Column(Integer, ForeignKey("kitchens.id"), nullable=True)
    ngo_id = Column(Integer, ForeignKey("ngo_partners.id"), nullable=True)
    severity = Column(String(50), default="info")  # info | warning | critical
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class WasteLog(Base):
    __tablename__ = "waste_logs"

    id = Column(Integer, primary_key=True, index=True)
    kitchen_id = Column(Integer, ForeignKey("kitchens.id"), nullable=False)
    food_item = Column(String(255), nullable=False)
    wasted_quantity_kg = Column(Float, nullable=False)
    reason = Column(String(255), default="expired")  # expired | spoiled | unconsumed_surplus
    date = Column(DateTime, default=datetime.utcnow)

