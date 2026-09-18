from matching.location_matcher import calculate_location_score, haversine_distance_km
from matching.quantity_matcher import allocate_quantity
from matching.surplus_classifier import match_surplus_to_ngos
from matching.urgency_matcher import determine_urgency


def test_haversine_distance():
    # Distance between Pune Canteen (18.5204, 73.8567) and Annadhan Food Bank (18.5230, 73.8500)
    dist = haversine_distance_km(18.5204, 73.8567, 18.5230, 73.8500)
    assert 0.5 <= dist <= 1.5


def test_location_score():
    dist, score = calculate_location_score(18.5204, 73.8567, 18.5230, 73.8500, 15.0)
    assert dist > 0
    assert 0.8 <= score <= 1.0


def test_determine_urgency():
    level, mult = determine_urgency(0.8, 15.0)
    assert level == "critical"
    assert mult == 1.5

    level_normal, mult_normal = determine_urgency(0.2, 2.0)
    assert level_normal == "normal"
    assert mult_normal == 1.0


def test_allocate_quantity():
    allocated, remaining = allocate_quantity(50.0, 30.0)
    assert allocated == 30.0
    assert remaining == 20.0


def test_multi_criteria_matching():
    kitchen = {"lat": 18.5204, "lng": 73.8567}
    surplus_batch = {"quantity": 50.0, "risk_score": 0.3, "storage_temp": "ambient"}
    ngos = [
        {"id": 1, "name": "Close NGO", "lat": 18.5210, "lng": 73.8570, "capacity_kg": 100, "refrigeration_capacity": True},
        {"id": 2, "name": "Far NGO", "lat": 18.6000, "lng": 73.9500, "capacity_kg": 20, "refrigeration_capacity": False},
    ]

    results = match_surplus_to_ngos(surplus_batch, kitchen, ngos)
    assert len(results) == 2
    assert results[0]["ngo_id"] == 1  # Closer NGO ranks higher
    assert results[0]["match_score"] > results[1]["match_score"]

