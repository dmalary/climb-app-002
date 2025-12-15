import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function AttemptsToSendChart({ data = [] }) {
  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer>
        <ScatterChart>
          <XAxis dataKey="grade" />
          <YAxis dataKey="attemptsToSend" />
          <Tooltip />
          <Scatter data={data} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
