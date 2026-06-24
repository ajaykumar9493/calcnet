import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function encodeParams(params: Record<string, string | number | boolean>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== "" && v !== undefined && v !== null) {
      search.set(k, String(v));
    }
  });
  return search.toString();
}

export function decodeParams<T extends Record<string, string>>(
  searchParams: URLSearchParams,
  defaults: T
): T {
  const result = { ...defaults };
  for (const key of Object.keys(defaults)) {
    const val = searchParams.get(key);
    if (val !== null) {
      (result as Record<string, string>)[key] = val;
    }
  }
  return result;
}

export function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function round(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}
