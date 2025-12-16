"use client";

import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";


export default function SessionTimelineChart({ data = [] }) {
  if (!data.length) return null;

  return (

      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <ScatterChart>
            <XAxis dataKey="index" name="Climb #" />
            <YAxis dataKey="grade" name="Grade" />
            <Tooltip
              formatter={(value, name, props) => {
                const { payload } = props;
                return [`Grade: ${payload.grade}`, `Attempts: ${payload.attempts}`];
              }}
            />
            <Scatter data={data} fill="#22c55e" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

  );
}
