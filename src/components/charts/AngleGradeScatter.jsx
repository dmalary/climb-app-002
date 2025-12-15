import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function AngleGradeChart({ data = [] }) {


  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer>
        <ScatterChart>
          <XAxis dataKey="grade" type="number" />
          <YAxis dataKey="angle" type="number" unit="°" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={data} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
