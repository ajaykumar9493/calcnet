"use client";

import { useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CalculatorShell } from "./CalculatorShell";
import { NumberInput } from "@/components/ui/NumberInput";
import { calculateRefinance } from "@/lib/calculators/refinance";
import { encodeParams } from "@/lib/utils";
import type { CalculationResult } from "@/types";

export function RefinanceCalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPrincipal, setCurrentPrincipal] = useState(Number(searchParams.get("currentPrincipal")) || 250000);
  const [currentRate, setCurrentRate] = useState(Number(searchParams.get("currentRate")) || 7);
  const [currentRemainingYears, setCurrentRemainingYears] = useState(Number(searchParams.get("currentRemainingYears")) || 25);
  const [newRate, setNewRate] = useState(Number(searchParams.get("newRate")) || 5.5);
  const [newTenureYears, setNewTenureYears] = useState(Number(searchParams.get("newTenureYears")) || 25);
  const [closingCosts, setClosingCosts] = useState(Number(searchParams.get("closingCosts")) || 5000);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(() => {
    try {
      setError(null);
      const res = calculateRefinance({ currentPrincipal, currentRate, currentRemainingYears, newRate, newTenureYears, closingCosts });
      setResult(res);
      router.replace(`?${encodeParams({ currentPrincipal, currentRate, currentRemainingYears, newRate, newTenureYears, closingCosts })}`, { scroll: false });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }, [currentPrincipal, currentRate, currentRemainingYears, newRate, newTenureYears, closingCosts, router]);

  return (
    <CalculatorShell slug="refinance" title="Refinance Calculator" result={result} error={error} onCalculate={calculate}
      chartConfig={{ xKey: "option", lines: [{ key: "emi", color: "#3b82f6" }, { key: "total", color: "#22c55e" }], type: "bar" }}>
      <h3 className="font-medium">Current Loan</h3>
      <NumberInput label="Remaining Balance" value={currentPrincipal} onChange={setCurrentPrincipal} min={1} />
      <NumberInput label="Current Rate (%)" value={currentRate} onChange={setCurrentRate} min={0} />
      <NumberInput label="Remaining Years" value={currentRemainingYears} onChange={setCurrentRemainingYears} min={1} />
      <h3 className="font-medium">New Loan</h3>
      <NumberInput label="New Rate (%)" value={newRate} onChange={setNewRate} min={0} />
      <NumberInput label="New Term (years)" value={newTenureYears} onChange={setNewTenureYears} min={1} />
      <NumberInput label="Closing Costs" value={closingCosts} onChange={setClosingCosts} min={0} />
    </CalculatorShell>
  );
}
