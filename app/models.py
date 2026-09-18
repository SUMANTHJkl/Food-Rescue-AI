from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text

from app.database import Base


class Kitchen(Base):
    __tablename__ = "kitchens"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    type = Column(String(50), default="canteen")  # canteen | mess | processing_unit | event
    address = Column(Text)
    lat = Column(Float)
    lng = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)


class InventoryItem(Base):
    __tablename__ = "inventory"
    id = Column(Integer, primary_key=True)
    kitchen_id = Column(Integer, ForeignKey("kitchens.id"))
    item_name = Column(String(255), nullable=False)
    quantity = Column(Float, default=0)
    unit = Column(String(20), default="kg")
    expiry_at = Column(DateTime)
    quality_status = Column(String(20), default="good")  # good | doubtful | unsafe


class SurplusBatch(Base):
    __tablename__ = "surplus_batches"
    id = Column(Integer, primary_key=True)
    kitchen_id = Column(Integer, ForeignKey("kitchens.id"))
    description = Column(Text)
    quantity = Column(Float, nullable=False)
    unit = Column(String(20), default="kg")
    status = Column(String(20), default="pending")  # pending | classified | matched | delivered
    safety_class = Column(String(20))  # safe | reusable | donate | discard
    risk_score = Column(Float, default=0.0)
    predicted_demand = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)


class NGOPartner(Base):
    __tablename__ = "ngo_partners"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    type = Column(String(50), default="ngo")  # ngo | food_bank | shelter
    contact = Column(String(255))
    capacity_kg = Column(Float, default=0)
    lat = Column(Float)
    lng = Column(Float)


class Redistribution(Base):
    __tablename__ = "redistributions"
    id = Column(Integer, primary_key=True)
    surplus_batch_id = Column(Integer, ForeignKey("surplus_batches.id"))
    ngo_id = Column(Integer, ForeignKey("ngo_partners.id"))
    urgency = Column(String(20), default="normal")  # critical | high | normal
    status = Column(String(20), default="assigned")  # assigned | picked_up | delivered
    delivered_at = Column(DateTime)


class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True)
    kitchen_id = Column(Integer, ForeignKey("kitchens.id"))
    severity = Column(String(20), default="info")  # info | warning | critical
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
