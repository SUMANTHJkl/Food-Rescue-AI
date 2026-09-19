import React from "react";

export default function StatsCards({ summary }) {
  const stats = [
    { label: "Surplus Reported", value: `${summary?.total_surplus_reported_kg || 70} kg`, color: "#10b981", icon: "🍲" },
    { label: "Meals Rescued", value: `${summary?.total_meals_rescued || 175}`, color: "#3b82f6", icon: "🍽️" },
    { label: "CO₂ Emissions Saved", value: `${summary?.total_co2_prevented_kg || 175} kg`, color: "#8b5cf6", icon: "🌱" },
    { label: "Active Kitchens", value: `${summary?.active_kitchens_count || 3}`, color: "#f97316", icon: "🏢" },
  ];

  return (
    <div className="grid-4" style={{ marginBottom: "24px" }}>
      {stats.map((s, idx) => (
        <div key={idx} className="card" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ fontSize: "28px", background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "12px" }}>
            {s.icon}
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{s.label}</div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: s.color }}>{s.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
