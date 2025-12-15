import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AngleDistributionChart({ data = [] }) {
  const chartData = data.map(d => ({
    name: `${d.angle}°`,
    value: d.count,
  }));

  // add legend

  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            innerRadius="55%"
            outerRadius="80%"
            dataKey="value"
            nameKey="name"
          >
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
