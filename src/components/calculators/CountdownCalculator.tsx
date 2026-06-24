"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CalculatorShell } from "./CalculatorShell";
import { InputField } from "@/components/ui/InputField";
import { calculateCountdown, getCountdownParts, getEmbedCode } from "@/lib/calculators/countdown";
import { encodeParams } from "@/lib/utils";
import type { CalculationResult } from "@/types";

export function CountdownCalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [targetDate, setTargetDate] = useState(searchParams.get("targetDate") || "2026-12-31");
  const [targetTime, setTargetTime] = useState(searchParams.get("targetTime") || "00:00");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const calculate = useCallback(() => {
    try {
      setError(null);
      const res = calculateCountdown({ targetDate, targetTime });
      setResult(res);
      router.replace(`?${encodeParams({ targetDate, targetTime })}`, { scroll: false });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }, [targetDate, targetTime, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      const target = new Date(`${targetDate}T${targetTime}:00`);
      setLive(getCountdownParts(target));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  return (
    <CalculatorShell slug="countdown" title="Countdown Timer" result={result} error={error} onCalculate={calculate}>
      <InputField label="Target Date" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
      <InputField label="Target Time" type="time" value={targetTime} onChange={(e) => setTargetTime(e.target.value)} />
      <div className="rounded-lg bg-zinc-100 p-6 text-center dark:bg-zinc-800" aria-live="polite">
        <p className="text-3xl font-bold tabular-nums">
          {live.days}d {live.hours}h {live.minutes}m {live.seconds}s
        </p>
      </div>
      {result && (
        <div className="mt-4">
          <p className="text-sm font-medium">Embed code:</p>
          <code className="mt-1 block overflow-x-auto rounded bg-zinc-100 p-2 text-xs dark:bg-zinc-800">
            {getEmbedCode(targetDate, targetTime)}
          </code>
        </div>
      )}
    </CalculatorShell>
  );
}
