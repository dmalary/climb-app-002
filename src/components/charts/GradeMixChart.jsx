"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#feedb0", "#f29568", "#cf4556", "#841c63", "#2f0e3e"];

export default function GradeMixChart({ data = [] }) {
  if (!data.length) return null;

  return (

      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie stroke="none" data={data} dataKey="count" nameKey="grade" innerRadius="50%" outerRadius="80%">
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
