"use client";

import { useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CalculatorShell } from "./CalculatorShell";
import { NumberInput } from "@/components/ui/NumberInput";
import { PresetButtons } from "@/components/ui/PresetButtons";
import { calculateSIP } from "@/lib/calculators/sip";
import { encodeParams } from "@/lib/utils";
import type { CalculationResult } from "@/types";

export function SIPCalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [monthlyInvestment, setMonthlyInvestment] = useState(Number(searchParams.get("monthlyInvestment")) || 5000);
  const [annualReturn, setAnnualReturn] = useState(Number(searchParams.get("annualReturn")) || 12);
  const [years, setYears] = useState(Number(searchParams.get("years")) || 10);
  const [yearlyIncreasePercent, setYearlyIncreasePercent] = useState(Number(searchParams.get("yearlyIncreasePercent")) || 0);
  const [adjustForInflation, setAdjustForInflation] = useState(searchParams.get("adjustForInflation") === "true");
  const [inflationRate, setInflationRate] = useState(Number(searchParams.get("inflationRate")) || 6);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(() => {
    try {
      setError(null);
      const res = calculateSIP({ monthlyInvestment, annualReturn, years, yearlyIncreasePercent, adjustForInflation, inflationRate });
      setResult(res);
      router.replace(`?${encodeParams({ monthlyInvestment, annualReturn, years, yearlyIncreasePercent, inflationRate, adjustForInflation })}`, { scroll: false });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }, [monthlyInvestment, annualReturn, years, yearlyIncreasePercent, adjustForInflation, inflationRate, router]);

  return (
    <CalculatorShell slug="sip" title="SIP Calculator" result={result} error={error} onCalculate={calculate}
      chartConfig={{ xKey: "year", lines: [{ key: "invested", color: "#94a3b8", name: "Invested" }, { key: "value", color: "#22c55e", name: "Value" }], type: "area" }}>
      <PresetButtons presets={[{ label: "Sample SIP", values: { monthlyInvestment: 5000, annualReturn: 12, years: 10 } }]}
        onSelect={(v) => { setMonthlyInvestment(Number(v.monthlyInvestment)); setAnnualReturn(Number(v.annualReturn)); setYears(Number(v.years)); }} />
      <NumberInput label="Monthly Investment" value={monthlyInvestment} onChange={setMonthlyInvestment} min={1} />
      <NumberInput label="Expected Annual Return (%)" value={annualReturn} onChange={setAnnualReturn} min={0} step={0.5} />
      <NumberInput label="Investment Period (years)" value={years} onChange={setYears} min={1} max={50} />
      <NumberInput label="Yearly SIP Increase (%)" value={yearlyIncreasePercent} onChange={setYearlyIncreasePercent} min={0} step={1} hint="Annual step-up" />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={adjustForInflation} onChange={(e) => setAdjustForInflation(e.target.checked)} />
        Adjust for inflation
      </label>
      {adjustForInflation && <NumberInput label="Inflation Rate (%)" value={inflationRate} onChange={setInflationRate} min={0} step={0.5} />}
    </CalculatorShell>
  );
}
