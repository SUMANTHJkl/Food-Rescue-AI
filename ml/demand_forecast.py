from typing import Dict, Any


def forecast_ngo_demand(ngo_id: int, capacity_kg: float) -> Dict[str, Any]:
    """
    Forecasts expected daily meal demand for an NGO recipient based on capacity & day.
    """
    expected_demand_kg = round(capacity_kg * 0.85, 1)
    return {
        "ngo_id": ngo_id,
        "max_capacity_kg": capacity_kg,
        "expected_demand_kg": expected_demand_kg,
        "preferred_categories": ["cooked_meals", "produce", "bakery"],
    }

