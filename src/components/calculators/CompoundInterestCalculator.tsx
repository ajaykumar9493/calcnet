"use client";

import { useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CalculatorShell } from "./CalculatorShell";
import { NumberInput } from "@/components/ui/NumberInput";
import { UnitSelect } from "@/components/ui/UnitSelect";
import { calculateCompoundInterest, type CompoundingFrequency } from "@/lib/calculators/compound-interest";
import { encodeParams } from "@/lib/utils";
import type { CalculationResult } from "@/types";

export function CompoundInterestCalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [principal, setPrincipal] = useState(Number(searchParams.get("principal")) || 10000);
  const [annualRate, setAnnualRate] = useState(Number(searchParams.get("annualRate")) || 5);
  const [years, setYears] = useState(Number(searchParams.get("years")) || 10);
  const [frequency, setFrequency] = useState<CompoundingFrequency>((searchParams.get("frequency") as CompoundingFrequency) || "monthly");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(() => {
    try {
      setError(null);
      const res = calculateCompoundInterest({ principal, annualRate, years, frequency });
      setResult(res);
      router.replace(`?${encodeParams({ principal, annualRate, years, frequency })}`, { scroll: false });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }, [principal, annualRate, years, frequency, router]);

  return (
    <CalculatorShell slug="compound-interest" title="Compound Interest Calculator" result={result} error={error} onCalculate={calculate}
      chartConfig={{ xKey: "year", lines: [{ key: "amount", color: "#3b82f6" }, { key: "interest", color: "#22c55e" }] }}>
      <NumberInput label="Principal" value={principal} onChange={setPrincipal} min={1} />
      <NumberInput label="Annual Rate (%)" value={annualRate} onChange={setAnnualRate} min={0} step={0.1} />
      <NumberInput label="Time (years)" value={years} onChange={setYears} min={1} />
      <UnitSelect label="Compounding Frequency" value={frequency} onChange={(v) => setFrequency(v as CompoundingFrequency)}
        options={[
          { value: "annual", label: "Annually" },
          { value: "quarterly", label: "Quarterly" },
          { value: "monthly", label: "Monthly" },
          { value: "daily", label: "Daily" },
        ]} />
    </CalculatorShell>
  );
}
