"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";


const COLORS = ["#22c55e", "#ef4444"];

export default function SendsVsAttemptsChart({ data = [] }) {
  if (!data.length) return null;

  return (

      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie stroke="none" data={data} dataKey="value" nameKey="name" innerRadius="50%" outerRadius="80%">
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

  );
}
