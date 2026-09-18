from ml.demand_forecast import forecast_ngo_demand
from ml.safety_risk_scoring import compute_safety_score
from ml.surplus_prediction import predict_kitchen_surplus
from ml.waste_pattern import analyze_waste_patterns


def test_predict_kitchen_surplus():
    res = predict_kitchen_surplus(kitchen_id=1, day_of_week=2, expected_headcount=500, meal_type="lunch")
    assert "predicted_surplus_kg" in res
    assert res["predicted_surplus_kg"] > 0
    assert "confidence_score" in res


def test_compute_safety_score_fresh():
    res = compute_safety_score("cooked_meals", hours_since_prep=1.0, storage_temp="ambient")
    assert res["safety_classification"] == "SAFE_DONATE"
    assert res["risk_score"] < 0.5


def test_compute_safety_score_expired():
    res = compute_safety_score("cooked_meals", hours_since_prep=6.0, storage_temp="ambient")
    assert res["safety_classification"] == "DISCARD"
    assert res["risk_score"] >= 0.85


def test_forecast_ngo_demand():
    res = forecast_ngo_demand(ngo_id=1, capacity_kg=100.0)
    assert res["expected_demand_kg"] == 85.0


def test_analyze_waste_patterns():
    logs = [{"food_item": "Rice", "wasted_quantity_kg": 10.0}]
    res = analyze_waste_patterns(1, logs)
    assert res["total_waste_kg"] == 10.0

