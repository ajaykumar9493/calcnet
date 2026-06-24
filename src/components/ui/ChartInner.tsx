"use client";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChartProps } from "./Chart";

export default function ChartInner({
  data,
  xKey,
  lines = [],
  areas = [],
  type = "line",
}: ChartProps) {
  return (
    <div className="mt-6 h-64 w-full" role="img" aria-label="Calculation chart">
      <ResponsiveContainer width="100%" height="100%">
        {type === "area" ? (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {areas.map((a) => (
              <Area key={a.key} type="monotone" dataKey={a.key} stroke={a.color} fill={a.color} fillOpacity={0.3} name={a.name ?? a.key} />
            ))}
          </AreaChart>
        ) : type === "bar" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {lines.map((l) => (
              <Bar key={l.key} dataKey={l.key} fill={l.color} name={l.name ?? l.key} />
            ))}
          </BarChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {lines.map((l) => (
              <Line key={l.key} type="monotone" dataKey={l.key} stroke={l.color} name={l.name ?? l.key} />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
