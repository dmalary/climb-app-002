"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#22c55e", "#ef4444"];

function SendsTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  // For Pie, payload[0].payload is the original datum: { name, value, ... }
  const d = payload[0].payload;

  return (
    <div className="rounded-md border border-stone-700 bg-stone-900/95 px-3 py-2 text-xs text-stone-100 shadow-lg">
      <div className="font-medium text-stone-200">{d.name}</div>
      <div className="mt-1 text-stone-300">
        <span className="text-stone-400">Count:</span> {d.value}
      </div>
    </div>
  );
}

export default function SendsVsAttemptsChart({ data = [] }) {
  if (!data.length) return null;

  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            stroke="none"
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="50%"
            outerRadius="80%"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip content={<SendsTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
