"use client";

import { useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CalculatorShell } from "./CalculatorShell";
import { NumberInput } from "@/components/ui/NumberInput";
import { calculateLoanPayoff } from "@/lib/calculators/loan-payoff";
import { encodeParams } from "@/lib/utils";
import type { CalculationResult } from "@/types";

export function LoanPayoffCalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [principal, setPrincipal] = useState(Number(searchParams.get("principal")) || 200000);
  const [annualRate, setAnnualRate] = useState(Number(searchParams.get("annualRate")) || 6);
  const [tenureYears, setTenureYears] = useState(Number(searchParams.get("tenureYears")) || 30);
  const [extraMonthly, setExtraMonthly] = useState(Number(searchParams.get("extraMonthly")) || 200);
  const [extraOneTime, setExtraOneTime] = useState(Number(searchParams.get("extraOneTime")) || 0);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(() => {
    try {
      setError(null);
      const res = calculateLoanPayoff({ principal, annualRate, tenureYears, extraMonthly, extraOneTime });
      setResult(res);
      router.replace(`?${encodeParams({ principal, annualRate, tenureYears, extraMonthly, extraOneTime })}`, { scroll: false });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }, [principal, annualRate, tenureYears, extraMonthly, extraOneTime, router]);

  return (
    <CalculatorShell slug="loan-payoff" title="Loan Payoff Calculator" result={result} error={error} onCalculate={calculate}
      chartConfig={{ xKey: "month", lines: [{ key: "balance", color: "#3b82f6" }] }}>
      <NumberInput label="Loan Balance" value={principal} onChange={setPrincipal} min={1} />
      <NumberInput label="Annual Rate (%)" value={annualRate} onChange={setAnnualRate} min={0} />
      <NumberInput label="Remaining Term (years)" value={tenureYears} onChange={setTenureYears} min={1} />
      <NumberInput label="Extra Monthly Payment" value={extraMonthly} onChange={setExtraMonthly} min={0} />
      <NumberInput label="One-time Extra Payment" value={extraOneTime} onChange={setExtraOneTime} min={0} />
    </CalculatorShell>
  );
}
