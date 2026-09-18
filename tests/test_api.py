def test_list_kitchens(client):
    response = client.get("/api/v1/kitchens")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_create_and_list_surplus(client):
    # 1. Create surplus batch
    payload = {
        "kitchen_id": 1,
        "food_item": "Test Meals",
        "description": "Integration test batch",
        "perishable_category": "cooked_meals",
        "quantity": 25.0,
        "unit": "kg",
        "storage_temp": "ambient"
    }
    create_resp = client.post("/api/v1/surplus", json=payload)
    assert create_resp.status_code == 201
    batch = create_resp.json()
    assert batch["food_item"] == "Test Meals"
    assert batch["safety_class"] == "SAFE_DONATE"

    # 2. List surplus
    list_resp = client.get("/api/v1/surplus")
    assert list_resp.status_code == 200
    batches = list_resp.json()
    assert len(batches) >= 1


def test_predictions_api(client):
    pred_payload = {"kitchen_id": 1, "expected_headcount": 600, "meal_type": "lunch"}
    resp = client.post("/api/v1/predictions/surplus", json=pred_payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["predicted_surplus_kg"] > 0


def test_analytics_summary_api(client):
    resp = client.get("/api/v1/analytics/summary")
    assert resp.status_code == 200
    summary = resp.json()
    assert "total_meals_rescued" in summary
    assert "total_co2_prevented_kg" in summary
