import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { name: "Mon", kg: 45, fill: "#10b981" },
  { name: "Tue", kg: 60, fill: "#10b981" },
  { name: "Wed", kg: 35, fill: "#10b981" },
  { name: "Thu", kg: 80, fill: "#3b82f6" },
  { name: "Fri", kg: 110, fill: "#f97316" },
  { name: "Sat", kg: 25, fill: "#8b5cf6" },
  { name: "Sun", kg: 20, fill: "#8b5cf6" },
];

export default function ImpactCharts() {
  return (
    <div className="card">
      <div className="card-title">
        <span>📈 Weekly Surplus & Rescue Metrics (kg)</span>
      </div>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
            <Bar dataKey="kg" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
