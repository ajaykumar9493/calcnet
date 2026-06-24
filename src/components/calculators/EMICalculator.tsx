"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CalculatorShell } from "./CalculatorShell";
import { NumberInput } from "@/components/ui/NumberInput";
import { PresetButtons } from "@/components/ui/PresetButtons";
import { calculateEMI } from "@/lib/calculators/emi";
import { encodeParams } from "@/lib/utils";
import type { CalculationResult } from "@/types";

const presets = [
  {
    label: "Sample: ₹50L loan",
    values: { principal: 5000000, annualRate: 7.5, tenureYears: 20 },
  },
];

export function EMICalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [principal, setPrincipal] = useState(
    Number(searchParams.get("principal")) || 5000000
  );
  const [annualRate, setAnnualRate] = useState(
    Number(searchParams.get("annualRate")) || 7.5
  );
  const [tenureYears, setTenureYears] = useState(
    Number(searchParams.get("tenureYears")) || 20
  );
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(() => {
    try {
      setError(null);
      const res = calculateEMI({ principal, annualRate, tenureYears });
      setResult(res);
      router.replace(`?${encodeParams({ principal, annualRate, tenureYears })}`, { scroll: false });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation error");
      setResult(null);
    }
  }, [principal, annualRate, tenureYears, router]);

  const exportCsv = useMemo(() => {
    if (!result?.raw) return undefined;
    const schedule = (result.raw as { schedule: Array<Record<string, number>> }).schedule;
    return () => [
      ["Month", "Payment", "Principal", "Interest", "Balance"],
      ...schedule.map((r) => [r.month, r.payment, r.principal, r.interest, r.balance].map(String)),
    ];
  }, [result]);

  return (
    <CalculatorShell
      slug="emi-loan"
      title="EMI / Loan Calculator"
      result={result}
      error={error}
      onCalculate={calculate}
      onExportCsv={exportCsv}
      chartConfig={{
        xKey: "month",
        lines: [
          { key: "principal", color: "#3b82f6", name: "Principal" },
          { key: "interest", color: "#f59e0b", name: "Interest" },
        ],
      }}
    >
      <PresetButtons
        presets={presets}
        onSelect={(v) => {
          setPrincipal(Number(v.principal));
          setAnnualRate(Number(v.annualRate));
          setTenureYears(Number(v.tenureYears));
        }}
      />
      <NumberInput label="Principal" value={principal} onChange={setPrincipal} min={1} step={10000} hint="Loan amount" />
      <NumberInput label="Annual Interest Rate (%)" value={annualRate} onChange={setAnnualRate} min={0} max={50} step={0.1} />
      <NumberInput label="Tenure (years)" value={tenureYears} onChange={setTenureYears} min={1} max={40} step={1} />
    </CalculatorShell>
  );
}
