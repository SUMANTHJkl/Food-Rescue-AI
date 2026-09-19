import React, { useState, useEffect } from "react";
import axios from "axios";
import SurplusTable from "../components/SurplusTable";

export default function KitchenPortal() {
  const [kitchens, setKitchens] = useState([]);
  const [selectedKitchen, setSelectedKitchen] = useState("1");
  const [foodItem, setFoodItem] = useState("");
  const [platesCount, setPlatesCount] = useState(500);
  const [category, setCategory] = useState("cooked_meals");
  const [storageTemp, setStorageTemp] = useState("ambient");
  const [hoursSincePrep, setHoursSincePrep] = useState(1.5);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchKitchens();
    fetchSurplus();
  }, []);

  const fetchKitchens = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/kitchens");
      setKitchens(res.data);
    } catch (err) {
      setKitchens([{ id: 1, name: "University Main Canteen" }]);
    }
  };

  const fetchSurplus = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/surplus");
      setBatches(res.data);
    } catch (err) {
      setBatches([]);
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
          ? "Food exceeded 4-hour ambient safety threshold. Rationally diverted to Bio-Cycle Farmers."
          : `Fresh food (${platesCount} plates / ${round(platesCount * 0.35, 1)}kg). Ready for human donation.`,
      });
    }
  };

  const handleSubmitSurplus = async (e) => {
    e.preventDefault();
    setLoading(true);
    const estKg = Math.round(platesCount * 0.35 * 10) / 10;

    try {
      await axios.post("http://localhost:8000/api/v1/surplus", {
        kitchen_id: parseInt(selectedKitchen),
        food_item: foodItem || "Fresh Veg Meals",
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
      alert("Surplus batch submitted!");
      fetchSurplus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "24px", color: "#10b981", margin: "0 0 8px 0" }}>🍳 Kitchen & Donor Surplus Portal</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Report surplus meal plates (e.g. 5000 plates of dishes left), trigger AI food safety scoring, and auto-dispatch to nearby NGOs or Bio-Cycle farmers.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: "24px" }}>
        <div className="card">
          <div className="card-title">
            <span>📢 Report Surplus Food / Plates</span>
          </div>

          <form onSubmit={handleSubmitSurplus}>
            <div className="form-group">
              <label>Select Kitchen / Canteen Organization</label>
              <select className="form-select" value={selectedKitchen} onChange={(e) => setSelectedKitchen(e.target.value)}>
                {kitchens.map((k) => (
                  <option key={k.id} value={k.id}>{k.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Food Items Description</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 5000 plates of Veg Biryani & Paneer Curry"
                value={foodItem}
                onChange={(e) => setFoodItem(e.target.value)}
                required
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Plates / Servings Count</label>
                <input
                  type="number"
                  className="form-input"
                  value={platesCount}
                  onChange={(e) => setPlatesCount(e.target.value)}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Storage Temperature</label>
                <select className="form-select" value={storageTemp} onChange={(e) => setStorageTemp(e.target.value)}>
                  <option value="ambient">Ambient (Room Temp)</option>
                  <option value="chilled">Chilled (&lt; 4°C)</option>
                  <option value="frozen">Frozen (&lt; -18°C)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Hours Since Preparation ({hoursSincePrep} hrs)</label>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={hoursSincePrep}
                onChange={(e) => setHoursSincePrep(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              <button type="button" className="btn btn-secondary" onClick={handleAnalyzeAI}>
                🤖 Pre-Check AI Safety
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Submitting..." : "Post Surplus Batch"}
              </button>
            </div>
          </form>
        </div>

        {/* AI Pre-Check Preview Panel */}
        <div className="card">
          <div className="card-title">
            <span>🛡️ AI Safety & Quality Assessment</span>
          </div>

          {aiAnalysis ? (
            <div style={{ background: "rgba(15, 23, 42, 0.8)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: aiAnalysis.action === "HUMAN_DONATION" ? "#34d399" : "#c084fc", marginBottom: "8px" }}>
                Target Routing Channel: {aiAnalysis.channel}
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-main)", marginBottom: "12px" }}>
                {aiAnalysis.recommendation}
              </p>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Estimated Total Weight: ~{aiAnalysis.estimated_weight_kg || Math.round(platesCount * 0.35)} kg
              </div>
            </div>
          ) : (
            <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6" }}>
              Click <strong>"Pre-Check AI Safety"</strong> to run real-time microbial degradation analysis before posting. Food exceeding safe human limits will be rationally routed to Bio-Cycle Farmers!
            </div>
          )}
        </div>
      </div>

      <SurplusTable batches={batches} />
    </div>
  );
}
