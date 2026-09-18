import math
from typing import Tuple


def haversine_distance_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """
    Computes distance between two coordinates in kilometers using the Haversine formula.
    """
    if lat1 is None or lng1 is None or lat2 is None or lng2 is None:
        return 5.0  # Default fallback distance

    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)


def calculate_location_score(
    kitchen_lat: float,
    kitchen_lng: float,
    ngo_lat: float,
    ngo_lng: float,
    max_radius_km: float = 15.0
) -> Tuple[float, float]:
    """
    Returns (distance_km, distance_score) where score is 1.0 (very close) to 0.0 (too far).
    """
    distance_km = haversine_distance_km(kitchen_lat, kitchen_lng, ngo_lat, ngo_lng)

    if distance_km <= 0:
        score = 1.0
    elif distance_km >= max_radius_km:
        score = max(0.0, 1.0 - (distance_km / (max_radius_km * 2)))
    else:
        score = 1.0 - (distance_km / max_radius_km)

    return (distance_km, round(score, 2))

