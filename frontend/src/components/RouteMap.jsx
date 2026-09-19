import React, { useState } from "react";

export default function RouteMap({
  fromName = "Royal Palace Banquet Kitchen",
  toName = "Annadhan Relief Center",
  distanceKm = 3.4,
  durationMins = 14,
  fromLat = 12.9750,
  fromLng = 77.6090,
  toLat = 12.9780,
  toLng = 77.6400,
  status = "In Transit",
  onClose
}) {
  const [routeMode, setRouteMode] = useState("SAFEST");

  // Route Profiles
  const routes = {
    SAFEST: {
      title: "🛡️ Safest Cold-Chain Route",
      badge: "RECOMMENDED BY AI",
      distance: distanceKm,
      time: durationMins,
      safetyScore: 98,
      tempControl: "Active 4°C - 8°C",
      traffic: "Clear (Low Delay Risk)",
      color: "#10b981",
      steps: [
        "1. Depart Donor Kitchen via MG Road Metro Corridor",
        "2. Thermal Insulation Monitoring OK - Temp: 5.2°C",
        "3. Bypass Congested Junction via Elevated Expressway",
        "4. Direct Priority Dropoff at NGO Feeding Facility"
      ]
    },
    FASTEST: {
      title: "⚡ Highway Express Route",
      badge: "SPEED OPTIMIZED",
      distance: (distanceKm * 0.9).toFixed(1),
      time: Math.max(8, durationMins - 4),
      safetyScore: 91,
      tempControl: "Standard Insulation",
      traffic: "Moderate (Ring Rd Toll)",
      color: "#38bdf8",
      steps: [
        "1. Direct Corridor via Ring Road Expressway",
        "2. Toll Gate Auto-Pass Verified",
        "3. Fast Arrival at NGO Warehouse Loading Dock"
      ]
    },
    ECO: {
      title: "🌿 Eco Low-Carbon Route",
      badge: "MINIMUM EMISSION",
      distance: (distanceKm * 1.1).toFixed(1),
      time: durationMins + 5,
      safetyScore: 94,
      tempControl: "Active Passive Cooler",
      traffic: "Smooth Local Access",
      color: "#a855f7",
      steps: [
        "1. Electric Fleet Green Corridor",
        "2. Optimized Steady Cruise Control",
        "3. Zero-Emission Drop-off Zone"
      ]
    }
  };

  const activeRoute = routes[routeMode];

  return (
    <div className="card" style={{ background: "rgba(11, 25, 44, 0.95)", border: "1px solid rgba(56, 189, 248, 0.35)", boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
      {/* Header */}
      <div className="card-title" style={{ borderBottom: "1px solid rgba(56, 189, 248, 0.15)", paddingBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "20px" }}>🗺️</span>
          <div>
            <h3 style={{ fontSize: "16px", color: "#38bdf8", margin: 0 }}>Rescue Route Visualizer & Map</h3>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>GPS Coordinates: ({fromLat}, {fromLng}) ➔ ({toLat}, {toLng})</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="badge-pill" style={{ background: "rgba(16,185,129,0.2)", color: "#34d399", border: "1px solid rgba(16,185,129,0.4)" }}>
            🟢 {status}
          </span>
          {onClose && (
            <button onClick={onClose} className="btn btn-xs btn-outline" style={{ borderRadius: "50%", width: "28px", height: "28px" }}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div style={{ display: "flex", gap: "8px", margin: "14px 0" }}>
        <button
          className={`btn btn-xs ${routeMode === "SAFEST" ? "btn-emerald" : "btn-outline"}`}
          onClick={() => setRouteMode("SAFEST")}
        >
          🛡️ Safest Route (98%)
        </button>
        <button
          className={`btn btn-xs ${routeMode === "FASTEST" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setRouteMode("FASTEST")}
        >
          ⚡ Express Highway
        </button>
        <button
          className={`btn btn-xs ${routeMode === "ECO" ? "btn-orange" : "btn-outline"}`}
          onClick={() => setRouteMode("ECO")}
        >
          🌿 Eco Corridor
        </button>
      </div>

      {/* Origin -> Destination Summary Panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "12px", alignItems: "center", padding: "12px 16px", background: "rgba(15, 23, 42, 0.7)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "16px" }}>
        <div>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>PICKUP (DONOR)</span>
          <div style={{ fontWeight: "700", color: "#34d399", fontSize: "14px" }}>📍 {fromName}</div>
        </div>

        <div style={{ textAlign: "center", padding: "0 12px" }}>
          <span className="badge-pill" style={{ borderColor: activeRoute.color, color: activeRoute.color, marginBottom: "4px" }}>
            {activeRoute.badge}
          </span>
          <div style={{ fontWeight: "800", fontSize: "18px", color: "#38bdf8" }}>⚡ {activeRoute.distance} km</div>
          <span style={{ fontSize: "11px", color: "#fb923c", fontWeight: "600" }}>ETA ~{activeRoute.time} mins</span>
        </div>

        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>DROPOFF (RECIPIENT)</span>
          <div style={{ fontWeight: "700", color: "#fb923c", fontSize: "14px" }}>🏠 {toName}</div>
        </div>
      </div>

      {/* Interactive SVG Route Map Canvas */}
      <div style={{ position: "relative", height: "130px", background: "#050b14", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(56, 189, 248, 0.2)", padding: "12px", marginBottom: "16px" }}>
        <svg width="100%" height="100%" viewBox="0 0 600 100" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
          <line x1="150" y1="0" x2="150" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
          <line x1="450" y1="0" x2="450" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

          {/* Curved Route Line */}
          <path
            d="M 50,50 Q 200,15 300,50 T 550,50"
            fill="none"
            stroke={activeRoute.color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="8 4"
          />

          {/* Origin Marker */}
          <circle cx="50" cy="50" r="16" fill="#10b981" />
          <text x="50" y="55" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">K</text>
          <text x="50" y="85" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="600">Donor</text>

          {/* Animated Express Vehicle Marker */}
          <g>
            <circle cx="280" cy="40" r="14" fill="#38bdf8" />
            <text x="280" y="44" textAnchor="middle" fill="#000" fontSize="10" fontWeight="bold">🚚</text>
            <rect x="230" y="10" width="100" height="20" rx="4" fill="rgba(7, 17, 30, 0.9)" stroke="#38bdf8" strokeWidth="1" />
            <text x="280" y="24" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">Express #104 (5.2°C)</text>
          </g>

          {/* Destination Marker */}
          <circle cx="550" cy="50" r="16" fill="#f97316" />
          <text x="550" y="55" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">NGO</text>
          <text x="550" y="85" textAnchor="middle" fill="#fb923c" fontSize="10" fontWeight="600">Relief Hub</text>
        </svg>
      </div>

      {/* Turn-by-Turn Route Navigation Steps */}
      <div style={{ background: "rgba(15, 23, 42, 0.5)", borderRadius: "10px", padding: "12px 14px", border: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "12px", fontWeight: "700" }}>
          <span style={{ color: "#38bdf8" }}>📋 Turn-by-Turn Navigation & Logistics:</span>
          <span style={{ color: "#34d399" }}>Safety Score: {activeRoute.safetyScore}%</span>
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {activeRoute.steps.map((step, idx) => (
            <li key={idx} style={{ fontSize: "12px", color: "var(--text-muted)", padding: "3px 0", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ color: activeRoute.color }}>▶</span> {step}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
