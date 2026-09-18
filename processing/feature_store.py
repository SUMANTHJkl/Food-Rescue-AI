from typing import Dict, Any


def extract_kitchen_features(kitchen_data: Dict[str, Any], day_of_week: int, headcount: int) -> Dict[str, Any]:
    """
    Extracts standardized feature vectors for kitchen surplus prediction.
    """
    return {
        "kitchen_type_code": 1 if kitchen_data.get("type") == "canteen" else 2,
        "capacity_meals": kitchen_data.get("capacity_meals", 500),
        "headcount": headcount,
        "day_of_week": day_of_week,
        "is_weekend": 1 if day_of_week >= 5 else 0,
    }

