import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CumulativeVolumeChart({ data = [] }) {
  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            type="number"
            scale="time"
            tickFormatter={ts =>
              new Date(ts).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
          />
          <YAxis />
          <Tooltip labelFormatter={d => new Date(d).toLocaleDateString()} />
          <Line type="monotone" dataKey="cumulative" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
