"use client";

import { useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CalculatorShell } from "./CalculatorShell";
import { InputField } from "@/components/ui/InputField";
import { NumberInput } from "@/components/ui/NumberInput";
import { UnitSelect } from "@/components/ui/UnitSelect";
import { PresetButtons } from "@/components/ui/PresetButtons";
import { calculatePregnancyDueDate, type PregnancyInputMethod } from "@/lib/calculators/pregnancy";
import { encodeParams } from "@/lib/utils";
import type { CalculationResult } from "@/types";

export function PregnancyCalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [method, setMethod] = useState<PregnancyInputMethod>((searchParams.get("method") as PregnancyInputMethod) || "lmp");
  const [date, setDate] = useState(searchParams.get("date") || "2026-01-01");
  const [cycleLength, setCycleLength] = useState(Number(searchParams.get("cycleLength")) || 28);
  const [gestationalWeeks, setGestationalWeeks] = useState(Number(searchParams.get("gestationalWeeks")) || 12);
  const [gestationalDays, setGestationalDays] = useState(Number(searchParams.get("gestationalDays")) || 0);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(() => {
    try {
      setError(null);
      const res = calculatePregnancyDueDate({ method, date, cycleLength, gestationalWeeks, gestationalDays });
      setResult(res);
      router.replace(`?${encodeParams({ method, date, cycleLength, gestationalWeeks, gestationalDays })}`, { scroll: false });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }, [method, date, cycleLength, gestationalWeeks, gestationalDays, router]);

  return (
    <CalculatorShell slug="pregnancy-due-date" title="Pregnancy Due Date Calculator" result={result} error={error} onCalculate={calculate}>
      <PresetButtons presets={[{ label: "Sample LMP Jan 1, 2026", values: { method: "lmp", date: "2026-01-01" } }]}
        onSelect={(v) => { setMethod(v.method as PregnancyInputMethod); setDate(String(v.date)); }} />
      <UnitSelect label="Calculation Method" value={method} onChange={(v) => setMethod(v as PregnancyInputMethod)}
        options={[
          { value: "lmp", label: "Last Menstrual Period (LMP)" },
          { value: "conception", label: "Conception Date" },
          { value: "ultrasound", label: "Ultrasound Date" },
        ]} />
      <InputField label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <NumberInput label="Average Cycle Length (days)" value={cycleLength} onChange={setCycleLength} min={21} max={35} />
      {method === "ultrasound" && (
        <>
          <NumberInput label="Gestational Weeks" value={gestationalWeeks} onChange={setGestationalWeeks} min={0} max={42} />
          <NumberInput label="Gestational Days" value={gestationalDays} onChange={setGestationalDays} min={0} max={6} />
        </>
      )}
    </CalculatorShell>
  );
}
