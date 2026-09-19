import React from "react";

export default function NGODirectory({ ngos = [] }) {
  return (
    <div className="card">
      <div className="card-title">
        <span>🤝 Registered NGO Partners & Shelters</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
        {ngos.map((n) => (
          <div key={n.id} style={{ background: "rgba(15, 23, 42, 0.6)", padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontWeight: "600", color: "#38bdf8" }}>{n.name}</div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Type: {n.type}</div>
            <div style={{ fontSize: "12px", color: "#34d399", marginTop: "4px" }}>Cap: {n.capacity_kg} kg/day</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>📞 {n.contact || n.phone || "Verified"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
