from typing import Tuple


def determine_urgency(risk_score: float, distance_km: float) -> Tuple[str, float]:
    """
    Returns (urgency_level, urgency_multiplier).
    """
    if risk_score >= 0.7 or distance_km > 12.0:
        return ("critical", 1.5)
    elif risk_score >= 0.4 or distance_km > 6.0:
        return ("high", 1.2)
    else:
        return ("normal", 1.0)

