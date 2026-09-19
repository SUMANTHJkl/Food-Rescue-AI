import React from "react";

export default function SurplusTable({ batches = [], onRunMatch }) {
  return (
    <div className="card">
      <div className="card-title">
        <span>📦 Live Food Surplus Feed</span>
        <span className="badge-pill">{batches.length} Active Batches</span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Food Item</th>
              <th>Quantity (kg)</th>
              <th>Temp</th>
              <th>Safety Class</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((b) => (
              <tr key={b.id}>
                <td>#{b.id}</td>
                <td style={{ fontWeight: "600" }}>{b.food_item}</td>
                <td>{b.quantity} kg</td>
                <td style={{ textTransform: "capitalize" }}>{b.storage_temp}</td>
                <td>
                  <span className={`status-tag ${
                    b.safety_class === "SAFE_DONATE" ? "tag-safe" : 
                    b.safety_class === "PRIORITY_DONATE" ? "tag-priority" : "tag-discard"
                  }`}>
                    {b.safety_class}
                  </span>
                </td>
                <td>
                  <span className={`status-tag ${b.status === "biowaste_available" ? "tag-biowaste" : "tag-safe"}`}>
                    {b.status}
                  </span>
                </td>
                <td>
                  {b.status === "biowaste_available" ? (
                    <span style={{ fontSize: "12px", color: "#c084fc" }}>🌾 Farmer Biowaste Hub</span>
                  ) : (
                    <button className="btn btn-primary" style={{ padding: "4px 10px", fontSize: "12px" }} onClick={() => onRunMatch && onRunMatch(b.id)}>
                      AI Match NGO
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
