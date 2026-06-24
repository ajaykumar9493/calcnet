"use client";

import { useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CalculatorShell } from "./CalculatorShell";
import { NumberInput } from "@/components/ui/NumberInput";
import { UnitSelect } from "@/components/ui/UnitSelect";
import { calculateIdealWeight, type IdealWeightMethod, type Sex } from "@/lib/calculators/ideal-weight";
import { encodeParams } from "@/lib/utils";
import type { CalculationResult } from "@/types";

export function IdealWeightCalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [heightCm, setHeightCm] = useState(Number(searchParams.get("heightCm")) || 175);
  const [sex, setSex] = useState<Sex>((searchParams.get("sex") as Sex) || "male");
  const [method, setMethod] = useState<IdealWeightMethod>((searchParams.get("method") as IdealWeightMethod) || "devine");
  const [targetBmi, setTargetBmi] = useState(Number(searchParams.get("targetBmi")) || 22);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(() => {
    try {
      setError(null);
      const res = calculateIdealWeight({ heightCm, sex, method, targetBmi });
      setResult(res);
      router.replace(`?${encodeParams({ heightCm, sex, method, targetBmi })}`, { scroll: false });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }, [heightCm, sex, method, targetBmi, router]);

  return (
    <CalculatorShell slug="ideal-weight" title="Ideal Weight Calculator" result={result} error={error} onCalculate={calculate}>
      <NumberInput label="Height (cm)" value={heightCm} onChange={setHeightCm} min={100} />
      <UnitSelect label="Sex" value={sex} onChange={(v) => setSex(v as Sex)} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
      <UnitSelect label="Method" value={method} onChange={(v) => setMethod(v as IdealWeightMethod)}
        options={[{ value: "devine", label: "Devine Formula" }, { value: "bmi", label: "BMI Target" }]} />
      {method === "bmi" && <NumberInput label="Target BMI" value={targetBmi} onChange={setTargetBmi} min={18} max={25} step={0.5} />}
    </CalculatorShell>
  );
}
