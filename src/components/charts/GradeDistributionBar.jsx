"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export function GradeDistributionBar({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="grade" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#f59e0b" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MiniGradeDistributionBar({ data }) {
  return (
    <ResponsiveContainer width="100%" height={80}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 5, left: 5, bottom: 0 }}
        barCategoryGap="25%"
      >
        {/* Tiny tick marks instead of labels */}
        <XAxis dataKey="grade" tick={false} axisLine={false} />
        <Bar dataKey="count" fill="#f59e0b" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}