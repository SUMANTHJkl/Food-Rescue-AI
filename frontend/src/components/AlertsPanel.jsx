import React from "react";

export default function AlertsPanel({ alerts = [] }) {
  return (
    <div className="card">
      <div className="card-title">
        <span>🚨 Real-Time Safety & System Alerts</span>
        <span className="badge-pill">{alerts.length} Alerts</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "250px", overflowY: "auto" }}>
        {alerts.length === 0 ? (
          <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>No critical alerts active.</div>
        ) : (
          alerts.map((a) => (
            <div
              key={a.id}
              style={{
                background: a.severity === "critical" ? "rgba(239, 68, 68, 0.15)" : "rgba(249, 115, 22, 0.15)",
                border: a.severity === "critical" ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(249, 115, 22, 0.3)",
                padding: "12px",
                borderRadius: "10px",
                fontSize: "13px"
              }}
            >
              <div style={{ fontWeight: "600", color: a.severity === "critical" ? "#f87171" : "#fb923c" }}>
                {a.severity.toUpperCase()}: {a.message}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                {new Date(a.created_at).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
