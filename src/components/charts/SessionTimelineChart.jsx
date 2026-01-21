"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Label,
} from "recharts";

function formatGrade(g) {
  if (g == null) return "—";
  return typeof g === "string" ? g : String(g);
}

function TimelineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  // Recharts gives you payload[0].payload as the original data point
  const d = payload[0].payload;

  const climbName = d.climb_name || d.name || "Climb";
  const gradeText = d.gradeLabel ?? d.displayed_grade ?? d.grade_label ?? formatGrade(d.grade);
  const tries = d.attempts ?? d.tries_total ?? d.totalTries ?? d.tries ?? "—";
  const angle = d.angle ?? "—";

  return (
    <div className="rounded-md border border-stone-700 bg-stone-900/95 px-3 py-2 text-xs text-stone-100 shadow-lg">
      <div className="text-stone-200 font-medium mb-1">{climbName}</div>

      {/* <div className="mt-1 text-stone-300">
        <span className="text-stone-400">Order:</span> #{d.index ?? label}
      </div> */}

      <div className="text-stone-300">
        <span className="text-stone-400">Grade:</span> {gradeText}
      </div>

      <div className="text-stone-300">
        <span className="text-stone-400">Angle:</span> {angle}°
      </div>

      <div className="text-stone-300">
        <span className="text-stone-400">Tries:</span> {tries}
      </div>
    </div>
  );
}

export default function SessionTimelineChart({ data = [] }) {
  if (!data.length) return null;

  const chartData = data.map((d, i) => ({
    ...d,
    index: d.index ?? i + 1,
    gradeLabel: d.displayed_grade ?? d.grade_label ?? formatGrade(d.grade),
  }));

  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 10, right: 16, bottom: 24, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />

          <XAxis
            dataKey="index"
            type="number"
            domain={[1, "dataMax"]}
            tickMargin={8}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          >
            <Label value="Climb order" position="insideBottom" offset={-16} />
          </XAxis>

          <YAxis
            dataKey="grade"
            type="number"
            tickMargin={8}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          >
            <Label value="Grade" angle={-90} position="insideLeft" />
          </YAxis>

          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={<TimelineTooltip />}
          />

          <Scatter
            data={chartData}
            fill="currentColor"
            className="text-emerald-500"
            isAnimationActive={false}
            activeShape={{ r: 7 }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
