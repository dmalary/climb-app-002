"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";


export default function AttemptsPerClimbChart({ data = [] }) {
  if (!data.length) return null;

  return (

      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="climb" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="attempts" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

  );
}
