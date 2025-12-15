"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#f59e0b", "#ef4444"]; // Sends, Flashes, Attempts

export default function SessionSummaryPie({ data = [] }) {
  return (
    <div width="100%" height={300}>
      <PieChart>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
}
