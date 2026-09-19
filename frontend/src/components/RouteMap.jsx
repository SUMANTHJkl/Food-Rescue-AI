import React from "react";

export default function RouteMap({
  fromName = "University Main Canteen",
  toName = "Annadhan Food Bank",
  distanceKm = 1.2,
  durationMins = 12,
  status = "In Transit"
}) {
  return (
    <div className="card" style={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
      <div className="card-title">
        <span>🗺️ Dispatch Route & Live Tracker</span>
        <span className="status-tag tag-safe">{status}</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", padding: "12px", background: "rgba(255,255,255,0.03)", borderRadius: "8px" }}>
        <div>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>FROM (ORIGIN)</span>
          <div style={{ fontWeight: "600", color: "#34d399" }}>📍 {fromName}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>DISTANCE</span>
          <div style={{ fontWeight: "700", fontSize: "16px", color: "#60a5fa" }}>⚡ {distanceKm} km</div>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>~{durationMins} mins ETA</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>TO (DESTINATION)</span>
          <div style={{ fontWeight: "600", color: "#f472b6" }}>🏠 {toName}</div>
        </div>
      </div>

      {/* Visual Route Diagram */}
      <div style={{ position: "relative", height: "100px", background: "#090d16", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", padding: "16px" }}>
        <svg width="100%" height="100%" viewBox="0 0 500 70">
          <line x1="40" y1="35" x2="460" y2="35" stroke="#334155" strokeWidth="4" strokeDasharray="6 6" />
          <circle cx="40" cy="35" r="12" fill="#10b981" />
          <text x="40" y="40" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">K</text>
          
          <circle cx="250" cy="35" r="8" fill="#3b82f6" />
          <text x="250" y="20" textAnchor="middle" fill="#60a5fa" fontSize="10">🚚 Express Vehicle #104</text>

          <circle cx="460" cy="35" r="12" fill="#ec4899" />
          <text x="460" y="40" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">N</text>
        </svg>
      </div>
    </div>
  );
}
