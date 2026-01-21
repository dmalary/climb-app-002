"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";


const COLORS = ["#cc4ccc", "#4c4dff", "#4dcc4d", "#fff24c", "#ff4c4c"];

export default function AngleMixChart({ data = [] }) {
  if (!data.length) return null;

  const chartData = data.map(d => ({ name: `${d.angle}°`, value: d.count }));

  return (

      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie stroke="none" data={chartData} dataKey="value" nameKey="name" innerRadius="50%" outerRadius="80%">
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

  );
}
