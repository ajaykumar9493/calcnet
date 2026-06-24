"use client";

import { useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CalculatorShell } from "./CalculatorShell";
import { InputField } from "@/components/ui/InputField";
import { calculateDateDifference } from "@/lib/calculators/date-diff";
import { encodeParams } from "@/lib/utils";
import type { CalculationResult } from "@/types";

export function DateDifferenceCalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "2025-01-01");
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "2026-06-22");
  const [includeEndDate, setIncludeEndDate] = useState(searchParams.get("includeEndDate") === "true");
  const [businessDaysOnly, setBusinessDaysOnly] = useState(searchParams.get("businessDaysOnly") === "true");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(() => {
    try {
      setError(null);
      const res = calculateDateDifference({ startDate, endDate, includeEndDate, businessDaysOnly });
      setResult(res);
      router.replace(`?${encodeParams({ startDate, endDate, includeEndDate, businessDaysOnly })}`, { scroll: false });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }, [startDate, endDate, includeEndDate, businessDaysOnly, router]);

  return (
    <CalculatorShell slug="date-difference" title="Date Difference Calculator" result={result} error={error} onCalculate={calculate}>
      <InputField label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <InputField label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={includeEndDate} onChange={(e) => setIncludeEndDate(e.target.checked)} />
        Include end date
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={businessDaysOnly} onChange={(e) => setBusinessDaysOnly(e.target.checked)} />
        Count business days only (exclude weekends)
      </label>
    </CalculatorShell>
  );
}
