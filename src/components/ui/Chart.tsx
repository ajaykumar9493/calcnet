"use client";

import dynamic from "next/dynamic";

const RechartsChart = dynamic(() => import("./ChartInner"), { ssr: false, loading: () => (
  <div className="flex h-64 items-center justify-center text-zinc-400">Loading chart...</div>
)});

export interface ChartProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
  lines?: Array<{ key: string; color: string; name?: string }>;
  areas?: Array<{ key: string; color: string; name?: string }>;
  type?: "line" | "area" | "bar";
}

export function Chart(props: ChartProps) {
  if (!props.data?.length) return null;
  return <RechartsChart {...props} />;
}
