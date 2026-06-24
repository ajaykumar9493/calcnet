"use client";

import { useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CalculatorShell } from "./CalculatorShell";
import { NumberInput } from "@/components/ui/NumberInput";
import { UnitSelect } from "@/components/ui/UnitSelect";
import { InputField } from "@/components/ui/InputField";
import { calculateIncomeTax, getTaxRegimes } from "@/lib/calculators/income-tax";
import { encodeParams } from "@/lib/utils";
import type { CalculationResult } from "@/types";

const regimes = getTaxRegimes();

export function IncomeTaxCalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [regimeId, setRegimeId] = useState(searchParams.get("regimeId") || "us-2025");
  const regime = regimes.find((r) => r.id === regimeId) ?? regimes[0];
  const [filingStatus, setFilingStatus] = useState(searchParams.get("filingStatus") || regime.filingStatuses[0]);
  const [grossIncome, setGrossIncome] = useState(Number(searchParams.get("grossIncome")) || 75000);
  const [deductions, setDeductions] = useState(Number(searchParams.get("deductions")) || 0);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(() => {
    try {
      setError(null);
      const res = calculateIncomeTax({ grossIncome, filingStatus, deductions, regimeId });
      setResult(res);
      router.replace(`?${encodeParams({ regimeId, filingStatus, grossIncome, deductions })}`, { scroll: false });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }, [grossIncome, filingStatus, deductions, regimeId, router]);

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.trim().split("\n").slice(1);
      const total = lines.reduce((sum, line) => {
        const cols = line.split(",");
        return sum + (parseFloat(cols[1]) || 0);
      }, 0);
      setGrossIncome(total);
    };
    reader.readAsText(file);
  };

  return (
    <CalculatorShell slug="income-tax" title="Income Tax Calculator" result={result} error={error} onCalculate={calculate}>
      <UnitSelect label="Tax Regime" value={regimeId} onChange={setRegimeId}
        options={regimes.map((r) => ({ value: r.id, label: `${r.country} (${r.year})` }))} />
      <UnitSelect label="Filing Status" value={filingStatus} onChange={setFilingStatus}
        options={regime.filingStatuses.map((s) => ({ value: s, label: s.replace(/_/g, " ") }))} />
      <NumberInput label="Annual Gross Income" value={grossIncome} onChange={setGrossIncome} min={0} />
      <NumberInput label="Additional Deductions" value={deductions} onChange={setDeductions} min={0} />
      <div>
        <label className="block text-sm font-medium">Upload Payroll CSV (month, gross)</label>
        <input type="file" accept=".csv" onChange={handleCsvUpload} className="mt-1 text-sm" />
      </div>
    </CalculatorShell>
  );
}
