import csv
import os
import sys
from datetime import datetime, timedelta

# Ensure parent directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import models
from app.database import Base, SessionLocal, engine
from security.auth import get_password_hash


def seed_data():
    print("[INFO] Initializing Database Schema...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Kitchens
        if db.query(models.Kitchen).count() == 0:
            print("[INFO] Seeding Kitchens...")
            kitchens_file = os.path.join(os.path.dirname(__file__), "../data/seed/kitchens.csv")
            if os.path.exists(kitchens_file):
                with open(kitchens_file, mode="r", encoding="utf-8-sig") as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        # Clean dictionary keys (strip whitespace/BOM)
                        cleaned_row = {k.strip() if k else k: v.strip() if v else v for k, v in row.items()}
                        k = models.Kitchen(
                            name=cleaned_row.get("name", "Canteen"),
                            type=cleaned_row.get("type", "canteen"),
                            address=cleaned_row.get("address", ""),
                            lat=float(cleaned_row["lat"]) if cleaned_row.get("lat") else 18.5204,
                            lng=float(cleaned_row["lng"]) if cleaned_row.get("lng") else 73.8567,
                            capacity_meals=500,
                        )
                        db.add(k)
            else:
                default_kitchens = [
                    models.Kitchen(name="University Main Canteen", type="canteen", address="Campus Rd, Pune", lat=18.5204, lng=73.8567),
                    models.Kitchen(name="Hostel Mess Block-B", type="mess", address="Hostel Circle, Pune", lat=18.5210, lng=73.8570),
                    models.Kitchen(name="FoodCorp Processing Unit", type="processing_unit", address="MIDC Area, Pune", lat=18.5290, lng=73.8740),
                ]
                db.add_all(default_kitchens)
            db.commit()
            print(f"[OK] Kitchens seeded ({db.query(models.Kitchen).count()} total).")

        # 2. Seed NGOs
        if db.query(models.NGOPartner).count() == 0:
            print("[INFO] Seeding NGO Partners...")
            ngos_file = os.path.join(os.path.dirname(__file__), "../data/seed/ngos.csv")
            if os.path.exists(ngos_file):
                with open(ngos_file, mode="r", encoding="utf-8-sig") as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        cleaned_row = {k.strip() if k else k: v.strip() if v else v for k, v in row.items()}
                        n = models.NGOPartner(
                            name=cleaned_row.get("name", "Food Bank"),
                            type=cleaned_row.get("type", "ngo"),
                            contact=cleaned_row.get("contact", ""),
                            capacity_kg=float(cleaned_row.get("capacity_kg", 100)),
                            lat=float(cleaned_row["lat"]) if cleaned_row.get("lat") else 18.5230,
                            lng=float(cleaned_row["lng"]) if cleaned_row.get("lng") else 73.8500,
                        )
                        db.add(n)
            else:
                default_ngos = [
                    models.NGOPartner(name="Annadhan Food Bank", type="food_bank", contact="contact@annadhan.org", capacity_kg=200, lat=18.5230, lng=73.8500),
                    models.NGOPartner(name="Hope Shelter Home", type="shelter", contact="+91-90000-00000", capacity_kg=80, lat=18.5310, lng=73.8620),
                    models.NGOPartner(name="Seva NGO Kitchen", type="ngo", contact="hello@seva.org", capacity_kg=150, lat=18.5150, lng=73.8680),
                ]
                db.add_all(default_ngos)
            db.commit()
            print(f"[OK] NGO Partners seeded ({db.query(models.NGOPartner).count()} total).")

        # 3. Seed Default Users
        if db.query(models.User).count() == 0:
            print("[INFO] Seeding System Users...")
            default_users = [
                models.User(email="admin@foodrescue.org", hashed_password=get_password_hash("AdminPass123!"), full_name="System Admin", role="admin"),
                models.User(email="kitchen@canteen.edu", hashed_password=get_password_hash("KitchenPass123!"), full_name="Canteen Staff", role="kitchen_staff", kitchen_id=1),
                models.User(email="ngo@annadhan.org", hashed_password=get_password_hash("NgoPass123!"), full_name="NGO Coordinator", role="ngo_admin", ngo_id=1),
                models.User(email="driver@express.com", hashed_password=get_password_hash("DriverPass123!"), full_name="Express Logistics Driver", role="driver"),
            ]
            db.add_all(default_users)
            db.commit()
            print(f"[OK] Users seeded ({db.query(models.User).count()} total).")

        # 4. Seed Initial Surplus Batch
        if db.query(models.SurplusBatch).count() == 0:
            print("[INFO] Seeding Initial Surplus Batch...")
            sample_batch = models.SurplusBatch(
                kitchen_id=1,
                food_item="Fresh Veg Meals & Rice",
                description="Cooked lunch meals from campus canteen",
                perishable_category="cooked_meals",
                quantity=45.0,
                unit="kg",
                prep_time=datetime.utcnow() - timedelta(hours=1),
                expiry_time=datetime.utcnow() + timedelta(hours=3),
                storage_temp="ambient",
                status="classified",
                safety_class="SAFE_DONATE",
                risk_score=0.25,
                predicted_demand=40.0
            )
            db.add(sample_batch)
            db.commit()
            print("[OK] Sample Surplus Batch seeded.")

        print("[SUCCESS] Database seeding completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error seeding database: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()

