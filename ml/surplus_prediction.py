import math
from typing import Dict, Any, List


def predict_kitchen_surplus(
    kitchen_id: int,
    day_of_week: int = 2,  # 0=Mon, 6=Sun
    expected_headcount: int = 500,
    meal_type: str = "lunch"
) -> Dict[str, Any]:
    """
    Predicts expected food surplus quantity (in kg) for a kitchen.
    Uses meal multiplier heuristics + headcount ratio.
    """
    base_waste_per_person_kg = 0.08  # ~80 grams expected variance

    # Day of week multiplier (e.g. Fridays/Fridays weekend transition higher)
    dow_multipliers = {0: 1.0, 1: 1.05, 2: 1.0, 3: 1.1, 4: 1.25, 5: 0.7, 6: 0.6}
    dow_mult = dow_multipliers.get(day_of_week, 1.0)

    # Meal type multiplier
    meal_multipliers = {"breakfast": 0.6, "lunch": 1.0, "dinner": 0.85, "snack": 0.4}
    meal_mult = meal_multipliers.get(meal_type.lower(), 1.0)

    # Predicted waste in kg
    predicted_kg = round(expected_headcount * base_waste_per_person_kg * dow_mult * meal_mult, 1)
    confidence = 0.88 if 100 <= expected_headcount <= 2000 else 0.75

    tips: List[str] = [
        "Reduce rice and batch preparation by 10% during lunch hours.",
        "Implement real-time headcount sensors to adjust batch cooking dynamically.",
        "Pre-notify nearby NGOs 1 hour before meal service ends."
    ]

    return {
        "predicted_surplus_kg": predicted_kg,
        "confidence_score": confidence,
        "recommended_reduction_tips": tips,
    }

