"use client";

import { useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CalculatorShell } from "./CalculatorShell";
import { NumberInput } from "@/components/ui/NumberInput";
import { InputField } from "@/components/ui/InputField";
import { PresetButtons } from "@/components/ui/PresetButtons";
import { calculateMortgage } from "@/lib/calculators/mortgage";
import { encodeParams } from "@/lib/utils";
import type { CalculationResult } from "@/types";
import { format } from "date-fns";

export function MortgageCalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [homePrice, setHomePrice] = useState(Number(searchParams.get("homePrice")) || 400000);
  const [downPayment, setDownPayment] = useState(Number(searchParams.get("downPayment")) || 80000);
  const [annualRate, setAnnualRate] = useState(Number(searchParams.get("annualRate")) || 6.5);
  const [tenureYears, setTenureYears] = useState(Number(searchParams.get("tenureYears")) || 30);
  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState(Number(searchParams.get("propertyTaxAnnual")) || 4800);
  const [insuranceAnnual, setInsuranceAnnual] = useState(Number(searchParams.get("insuranceAnnual")) || 1200);
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || format(new Date(), "yyyy-MM-dd"));
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState(Number(searchParams.get("extraMonthlyPayment")) || 0);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(() => {
    try {
      setError(null);
      const res = calculateMortgage({
        homePrice, downPayment, annualRate, tenureYears,
        propertyTaxAnnual, insuranceAnnual, startDate, extraMonthlyPayment,
      });
      setResult(res);
      router.replace(`?${encodeParams({ homePrice, downPayment, annualRate, tenureYears, propertyTaxAnnual, insuranceAnnual, startDate, extraMonthlyPayment })}`, { scroll: false });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }, [homePrice, downPayment, annualRate, tenureYears, propertyTaxAnnual, insuranceAnnual, startDate, extraMonthlyPayment, router]);

  return (
    <CalculatorShell slug="mortgage" title="Mortgage Calculator" result={result} error={error} onCalculate={calculate}
      chartConfig={{ xKey: "month", lines: [{ key: "balance", color: "#3b82f6" }, { key: "interest", color: "#f59e0b" }] }}>
      <PresetButtons presets={[{ label: "Sample home", values: { homePrice: 400000, downPayment: 80000, annualRate: 6.5, tenureYears: 30 } }]}
        onSelect={(v) => { setHomePrice(Number(v.homePrice)); setDownPayment(Number(v.downPayment)); setAnnualRate(Number(v.annualRate)); setTenureYears(Number(v.tenureYears)); }} />
      <NumberInput label="Home Price" value={homePrice} onChange={setHomePrice} min={1} step={10000} />
      <NumberInput label="Down Payment" value={downPayment} onChange={setDownPayment} min={0} step={5000} />
      <NumberInput label="Annual Rate (%)" value={annualRate} onChange={setAnnualRate} min={0} step={0.1} />
      <NumberInput label="Loan Term (years)" value={tenureYears} onChange={setTenureYears} min={1} max={40} />
      <NumberInput label="Annual Property Tax" value={propertyTaxAnnual} onChange={setPropertyTaxAnnual} min={0} />
      <NumberInput label="Annual Insurance" value={insuranceAnnual} onChange={setInsuranceAnnual} min={0} />
      <InputField label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <NumberInput label="Extra Monthly Payment" value={extraMonthlyPayment} onChange={setExtraMonthlyPayment} min={0} hint="Applied to principal" />
    </CalculatorShell>
  );
}
