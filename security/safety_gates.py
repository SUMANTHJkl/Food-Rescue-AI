from datetime import datetime, timedelta
from typing import Dict, Tuple


def evaluate_food_safety_gate(
    perishable_category: str,
    prep_time: datetime,
    storage_temp: str
) -> Tuple[bool, str, float]:
    """
    Evaluates whether a food batch passes safety gates for redistribution.
    Returns: (passes_gate, safety_class, risk_score)
    """
    now = datetime.utcnow()
    hours_elapsed = (now - prep_time).total_seconds() / 3600.0 if prep_time else 0.0

    # Max allowed hours by category & storage temperature
    max_safe_hours = {
        "cooked_meals": {"ambient": 4.0, "chilled": 24.0, "frozen": 48.0},
        "produce": {"ambient": 48.0, "chilled": 120.0, "frozen": 240.0},
        "dairy": {"ambient": 2.0, "chilled": 48.0, "frozen": 72.0},
        "bakery": {"ambient": 24.0, "chilled": 72.0, "frozen": 168.0},
        "packaged": {"ambient": 168.0, "chilled": 336.0, "frozen": 720.0},
    }

    category_limits = max_safe_hours.get(perishable_category, max_safe_hours["cooked_meals"])
    max_hours = category_limits.get(storage_temp, category_limits.get("ambient", 4.0))

    if max_hours <= 0:
        ratio = 1.0
    else:
        ratio = min(hours_elapsed / max_hours, 1.0)

    risk_score = round(ratio, 2)

    if ratio < 0.5:
        return (True, "SAFE_DONATE", risk_score)
    elif ratio < 0.85:
        return (True, "PRIORITY_DONATE", risk_score)
    else:
        return (False, "DISCARD", risk_score)

