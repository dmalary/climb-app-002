"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function AttemptsTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  // For BarChart, payload[0].value corresponds to the Bar dataKey ("attempts")
  const attempts = payload[0].value;

  return (
    <div className="rounded-md border border-stone-700 bg-stone-900/95 px-3 py-2 text-xs text-stone-100 shadow-lg">
      <div className="font-medium text-stone-200">{label}</div>
      <div className="mt-1 text-stone-300">
        <span className="text-stone-400">Attempts:</span> {attempts}
      </div>
    </div>
  );
}

export default function AttemptsPerClimbChart({ data = [] }) {
  if (!data.length) return null;

  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 12, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />

          <XAxis
            dataKey="climb"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={0}
            height={40}
          />
          <YAxis tickLine={false} axisLine={false} />

          <Tooltip
            cursor={{ opacity: 0.15 }}
            content={<AttemptsTooltip />}
          />

          <Bar dataKey="attempts" fill="currentColor" className="text-emerald-500" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
