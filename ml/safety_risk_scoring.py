from typing import Dict, Any
from security.safety_gates import evaluate_food_safety_gate


def compute_safety_score(
    food_category: str,
    hours_since_prep: float,
    storage_temp: str = "ambient"
) -> Dict[str, Any]:
    """
    ML / Rule-based risk scoring engine for food items.
    Returns risk score, safety classification, remaining safe hours, and actionable recommendation.
    """
    category_max_hours = {
        "cooked_meals": {"ambient": 4.0, "chilled": 24.0, "frozen": 48.0},
        "produce": {"ambient": 48.0, "chilled": 120.0, "frozen": 240.0},
        "dairy": {"ambient": 2.0, "chilled": 48.0, "frozen": 72.0},
        "bakery": {"ambient": 24.0, "chilled": 72.0, "frozen": 168.0},
        "packaged": {"ambient": 168.0, "chilled": 336.0, "frozen": 720.0},
    }

    limits = category_max_hours.get(food_category.lower(), category_max_hours["cooked_meals"])
    max_safe = limits.get(storage_temp.lower(), 4.0)

    remaining_hours = max(0.0, max_safe - hours_since_prep)
    risk_score = min(1.0, max(0.0, hours_since_prep / max_safe))

    if risk_score <= 0.4:
        safety_class = "SAFE_DONATE"
        rec = "Optimal condition for standard donation and redistribution."
    elif risk_score <= 0.8:
        safety_class = "PRIORITY_DONATE"
        rec = "High priority dispatch required. Dispatch within remaining window."
    else:
        safety_class = "DISCARD"
        rec = "Exceeded safe threshold. Do not redistribute for human consumption."

    return {
        "risk_score": round(risk_score, 2),
        "safety_classification": safety_class,
        "remaining_safe_hours": round(remaining_hours, 1),
        "recommendation": rec,
    }

