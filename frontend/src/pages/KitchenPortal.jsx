import React, { useState, useEffect } from "react";
import axios from "axios";
import QRCodeModal from "../components/QRCodeModal";
import QRScannerModal from "../components/QRScannerModal";

export default function KitchenPortal() {
  const [kitchens, setKitchens] = useState([]);
  const [selectedKitchen, setSelectedKitchen] = useState("1");
  const [foodItem, setFoodItem] = useState("");
  const [platesCount, setPlatesCount] = useState(250);
  const [category, setCategory] = useState("cooked_meals");
  const [storageTemp, setStorageTemp] = useState("ambient");
  const [hoursSincePrep, setHoursSincePrep] = useState(1.5);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedQRItem, setSelectedQRItem] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    fetchKitchens();
    fetchSurplus();
  }, []);

  const fetchKitchens = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/kitchens");
      setKitchens(res.data);
    } catch (err) {
      setKitchens([{ id: 1, name: "Royal Palace Banquet Kitchen" }, { id: 2, name: "TechPark Central Cafeteria" }]);
    }
  };

  const fetchSurplus = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/surplus");
      setBatches(res.data);
    } catch (err) {
      setBatches([
        {
          id: 101,
          food_item: "Paneer Butter Masala & Roti",
          perishable_category: "cooked_meals",
          plates_count: 250,
          quantity: 87.5,
          storage_temp: "hot_holding",
          status: "AVAILABLE",
          created_at: "10:30 AM"
        },
        {
          id: 102,
          food_item: "Pure Mineral Water Bottles & Fresh Juice",
          perishable_category: "beverages",
          plates_count: 300,
          quantity: 120.0,
          storage_temp: "refrigerated",
          status: "AVAILABLE",
          created_at: "11:15 AM"
        }
      ]);
    }
  };

  const handleAnalyzeAI = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/v1/ai/analyze-condition", {
        food_item: foodItem || "Cooked Meals",
        plates_count: parseInt(platesCount) || 100,
        hours_since_prep: parseFloat(hoursSincePrep) || 1.0,
        storage_temp: storageTemp,
      });
      setAiAnalysis(res.data);
    } catch (err) {
      const isDiscard = hoursSincePrep > 4.0 && storageTemp === "ambient";
      setAiAnalysis({
        action: isDiscard ? "BIO_RECYCLE" : "HUMAN_DONATION",
        channel: isDiscard ? "Farmers & Animal Feed" : "NGO Partners",
        recommendation: isDiscard
          ? "Exceeded 4-hour ambient limit. Rationally routed to Bio-Cycle Farmers."
          : `Fresh food (${platesCount} plates / ${Math.round(platesCount * 0.35)}kg). Ready for human donation.`,
      });
    }
  };

  const handleSubmitSurplus = async (e) => {
    e.preventDefault();
    setLoading(true);
    const estKg = Math.round(platesCount * 0.35 * 10) / 10;

    const newBatch = {
      id: 100 + batches.length + 1,
      food_item: foodItem || "Fresh Veg Meals",
      perishable_category: category,
      plates_count: parseInt(platesCount),
      quantity: estKg,
      storage_temp: storageTemp,
      status: "AVAILABLE",
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    try {
      await axios.post("http://localhost:8000/api/v1/surplus", {
        kitchen_id: parseInt(selectedKitchen),
        food_item: newBatch.food_item,
        description: `${platesCount} plates prepared ${hoursSincePrep} hours ago`,
        perishable_category: category,
        plates_count: parseInt(platesCount),
        quantity: estKg,
        storage_temp: storageTemp,
      });
      setFoodItem("");
      setAiAnalysis(null);
      fetchSurplus();
    } catch (err) {
      setBatches([newBatch, ...batches]);
      setFoodItem("");
      setAiAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kitchen-portal fade-in">
      {/* Header Banner */}
      <div className="card margin-bottom-lg flex justify-between items-center wrap-gap" style={{ borderLeft: '4px solid #0ea5e9' }}>
        <div>
          <div className="flex items-center gap-xs">
            <span className="badge-pill">🍳 Donor Kitchen Hub</span>
            <span className="badge-pill" style={{ borderColor: '#f97316', color: '#fb923c' }}>AI Food Safety Verified</span>
          </div>
          <h1 className="text-3xl font-bold margin-top-xs" style={{ color: '#f0f9ff' }}>
            Broadcasting Surplus Food Orders
          </h1>
          <p className="text-muted text-sm margin-top-xs">
            Register dishes, generate unique QR Safety Passes, and broadcast directly to verified NGO logistics networks.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsScannerOpen(true)}>
          📷 Scan Dispatch QR
        </button>
      </div>

      <div className="grid grid-2 gap-lg align-start">
        {/* Left Form: Register Surplus */}
        <div className="card">
          <h2 className="card-title text-xl">
            <span>📝 Post New Surplus Dish</span>
            <span className="badge-pill">Live Safety AI</span>
          </h2>

          <form onSubmit={handleSubmitSurplus}>
            <div className="form-group">
              <label>Select Kitchen / Facility</label>
              <select
                className="form-select"
                value={selectedKitchen}
                onChange={(e) => setSelectedKitchen(e.target.value)}
              >
                {kitchens.map((k) => (
                  <option key={k.id} value={k.id}>{k.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Dish / Food Item Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Paneer Butter Masala & Roti OR Mineral Water Bottles"
                value={foodItem}
                onChange={(e) => setFoodItem(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-2 gap-md">
              <div className="form-group">
                <label>Plates / Portion Count</label>
                <input
                  type="number"
                  className="form-input"
                  value={platesCount}
                  onChange={(e) => setPlatesCount(e.target.value)}
                  min="10"
                  required
                />
              </div>

              <div className="form-group">
                <label>Food Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="cooked_meals">🍲 Cooked Hot Dishes (Orange Tag)</option>
                  <option value="beverages">💧 Water / Juice / Beverage (Icy Blue Tag)</option>
                  <option value="bakery">🍞 Bakery & Bread</option>
                  <option value="fresh_produce">🍎 Fresh Fruits & Salads</option>
                </select>
              </div>
            </div>

            <div className="grid grid-2 gap-md">
              <div className="form-group">
                <label>Storage Temperature</label>
                <select
                  className="form-select"
                  value={storageTemp}
                  onChange={(e) => setStorageTemp(e.target.value)}
                >
                  <option value="hot_holding">🔥 Hot Holding (&gt;60°C)</option>
                  <option value="refrigerated">❄️ Refrigerated (&lt;4°C)</option>
                  <option value="ambient">🌡️ Ambient Room Temp</option>
                </select>
              </div>

              <div className="form-group">
                <label>Hours Since Preparation</label>
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  value={hoursSincePrep}
                  onChange={(e) => setHoursSincePrep(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-sm margin-top-md">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleAnalyzeAI}
              >
                🤖 Pre-Check Safety AI
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Broadcasting..." : "🚀 Broadcast Surplus & Create QR"}
              </button>
            </div>
          </form>

          {/* AI Pre-Check Card */}
          {aiAnalysis && (
            <div className="card margin-top-md" style={{ background: "rgba(14, 165, 233, 0.12)", border: "1px solid #38bdf8" }}>
              <div className="flex justify-between items-center">
                <span className="badge-pill" style={{ background: aiAnalysis.action === "HUMAN_DONATION" ? "rgba(16, 185, 129, 0.25)" : "rgba(249, 115, 22, 0.25)", color: aiAnalysis.action === "HUMAN_DONATION" ? "#34d399" : "#fb923c" }}>
                  Action: {aiAnalysis.action}
                </span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Target: {aiAnalysis.channel}</span>
              </div>
              <p style={{ fontSize: "13px", marginTop: "8px", color: "#f0f9ff" }}>{aiAnalysis.recommendation}</p>
            </div>
          )}
        </div>

        {/* Right Column: Targeted Table of Surplus Batches */}
        <div className="card">
          <h2 className="card-title text-xl">
            <span>📋 Active Surplus Batch Inventory</span>
            <span className="badge-pill">{batches.length} Items</span>
          </h2>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Food Item & Category</th>
                  <th>Quantity / Plates</th>
                  <th>Storage Temp</th>
                  <th>QR Pass</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((item) => {
                  const isBeverage = item.perishable_category === 'beverages' || item.food_item.toLowerCase().includes('water');
                  return (
                    <tr key={item.id}>
                      <td style={{ fontWeight: "700", color: "#38bdf8" }}>#{item.id}</td>
                      <td>
                        <div style={{ fontWeight: "700", color: "#fff" }}>{item.food_item}</div>
                        <span className={isBeverage ? "badge-icy btn-xs" : "badge-orange btn-xs"}>
                          {isBeverage ? "💧 Beverage (Icy Blue)" : "🍲 Cooked Meal (Light Orange)"}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: "800", color: "#fb923c" }}>
                          {item.plates_count || 100} Plates
                        </div>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>({item.quantity} kg)</span>
                      </td>
                      <td>
                        <span className="badge-pill">
                          {item.storage_temp || "ambient"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-xs btn-outline"
                          onClick={() => setSelectedQRItem(item)}
                        >
                          🔍 QR Pass
                        </button>
                      </td>
                      <td>
                        <span className="status-tag tag-safe">{item.status || "AVAILABLE"}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* QR Modals */}
      {selectedQRItem && (
        <QRCodeModal item={selectedQRItem} onClose={() => setSelectedQRItem(null)} />
      )}
      <QRScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </div>
  );
}
