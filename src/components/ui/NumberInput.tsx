"use client";

import { cn } from "@/lib/utils";

interface NumberInputProps {
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  error?: string;
  id?: string;
}

export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  hint,
  error,
  id,
}: NumberInputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  const num = typeof value === "string" ? parseFloat(value) : value;

  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
        {hint && <span className="ml-1 text-zinc-400" title={hint}>ⓘ</span>}
      </label>
      <div className="flex">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(Math.max(min ?? -Infinity, num - step))}
          className="rounded-l-lg border border-r-0 border-zinc-300 px-3 py-2 hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
        >
          −
        </button>
        <input
          id={inputId}
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={cn(
            "w-full border border-zinc-300 bg-white px-3 py-2 text-center text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800",
            error && "border-red-500"
          )}
          aria-invalid={!!error}
        />
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(Math.min(max ?? Infinity, num + step))}
          className="rounded-r-lg border border-l-0 border-zinc-300 px-3 py-2 hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
        >
          +
        </button>
      </div>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
    </div>
  );
}
