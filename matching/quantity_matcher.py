from typing import Tuple


def allocate_quantity(requested_surplus_kg: float, ngo_capacity_kg: float) -> Tuple[float, float]:
    """
    Returns (allocated_kg, remaining_unallocated_kg).
    """
    allocated = min(requested_surplus_kg, ngo_capacity_kg)
    remaining = max(0.0, requested_surplus_kg - allocated)
    return (round(allocated, 1), round(remaining, 1))

