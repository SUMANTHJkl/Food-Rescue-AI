from typing import List, Dict, Any
from matching.location_matcher import calculate_location_score
from matching.quantity_matcher import allocate_quantity
from matching.urgency_matcher import determine_urgency


def match_surplus_to_ngos(
    surplus_batch: Dict[str, Any],
    kitchen: Dict[str, Any],
    ngo_partners: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Ranks recipient NGO partners for a given surplus batch.
    Weights: 50% Distance, 30% Capacity Match, 20% Refrigeration Capability.
    Adjusted by urgency multiplier.
    """
    results = []

    k_lat = kitchen.get("lat")
    k_lng = kitchen.get("lng")
    surplus_kg = surplus_batch.get("quantity", 0.0)
    risk_score = surplus_batch.get("risk_score", 0.0)
    storage_temp = surplus_batch.get("storage_temp", "ambient")

    for ngo in ngo_partners:
        n_lat = ngo.get("lat")
        n_lng = ngo.get("lng")
        n_cap = ngo.get("capacity_kg", 100.0)
        n_refrig = ngo.get("refrigeration_capacity", True)

        distance_km, loc_score = calculate_location_score(
            k_lat, k_lng, n_lat, n_lng, ngo.get("delivery_radius_km", 15.0)
        )

        # Capacity score: 1.0 if capacity >= batch size, ratio otherwise
        cap_score = min(1.0, n_cap / surplus_kg) if surplus_kg > 0 else 1.0

        # Refrigeration score if storage temp requires cold chain
        if storage_temp in ["chilled", "frozen"] and not n_refrig:
            refrig_score = 0.2
        else:
            refrig_score = 1.0

        urgency_level, urgency_mult = determine_urgency(risk_score, distance_km)

        # Raw combined score (0.0 to 1.0)
        raw_score = (0.5 * loc_score) + (0.3 * cap_score) + (0.2 * refrig_score)
        final_score = round(min(1.0, raw_score * urgency_mult), 2)

        allocated_kg, _ = allocate_quantity(surplus_kg, n_cap)

        results.append({
            "ngo_id": ngo.get("id"),
            "ngo_name": ngo.get("name"),
            "match_score": final_score,
            "distance_km": distance_km,
            "urgency_level": urgency_level,
            "quantity_allocated": allocated_kg,
            "capacity_kg": n_cap,
            "refrigeration": n_refrig,
        })

    # Sort descending by match score
    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results

