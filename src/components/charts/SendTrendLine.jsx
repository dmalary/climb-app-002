import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SendTrendChart({ data = [] }) {
  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis
            dataKey="week"
            type="number"
            scale="time"
            tickFormatter={ts =>
              new Date(ts).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
          />
          <YAxis
            domain={[0, 1]}
            tickFormatter={v => `${Math.round(v * 100)}%`}
          />
          <Tooltip
            labelFormatter={d => new Date(d).toLocaleDateString()}
            formatter={v => `${(v * 100).toFixed(1)}%`}
          />
          <Line type="monotone" dataKey="sendRate" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
