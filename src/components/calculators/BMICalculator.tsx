"use client";

import { useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CalculatorShell } from "./CalculatorShell";
import { NumberInput } from "@/components/ui/NumberInput";
import { UnitSelect } from "@/components/ui/UnitSelect";
import { PresetButtons } from "@/components/ui/PresetButtons";
import { calculateBMI, type WeightUnit, type HeightUnit } from "@/lib/calculators/bmi";
import { encodeParams } from "@/lib/utils";
import type { CalculationResult } from "@/types";

export function BMICalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [weight, setWeight] = useState(Number(searchParams.get("weight")) || 70);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>((searchParams.get("weightUnit") as WeightUnit) || "kg");
  const [height, setHeight] = useState(Number(searchParams.get("height")) || 175);
  const [heightUnit, setHeightUnit] = useState<HeightUnit>((searchParams.get("heightUnit") as HeightUnit) || "cm");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(() => {
    try {
      setError(null);
      const res = calculateBMI({ weight, weightUnit, height, heightUnit });
      setResult(res);
      router.replace(`?${encodeParams({ weight, weightUnit, height, heightUnit })}`, { scroll: false });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }, [weight, weightUnit, height, heightUnit, router]);

  return (
    <CalculatorShell slug="bmi" title="BMI Calculator" result={result} error={error} onCalculate={calculate}
      chartConfig={{ xKey: "category", lines: [{ key: "max", color: "#94a3b8" }, { key: "current", color: "#3b82f6" }], type: "bar" }}>
      <PresetButtons presets={[{ label: "Sample: 70kg, 175cm", values: { weight: 70, weightUnit: "kg", height: 175, heightUnit: "cm" } }]}
        onSelect={(v) => { setWeight(Number(v.weight)); setWeightUnit(v.weightUnit as WeightUnit); setHeight(Number(v.height)); setHeightUnit(v.heightUnit as HeightUnit); }} />
      <NumberInput label="Weight" value={weight} onChange={setWeight} min={1} />
      <UnitSelect label="Weight Unit" value={weightUnit} onChange={(v) => setWeightUnit(v as WeightUnit)}
        options={[{ value: "kg", label: "Kilograms" }, { value: "lb", label: "Pounds" }]} />
      <NumberInput label="Height" value={height} onChange={setHeight} min={1} />
      <UnitSelect label="Height Unit" value={heightUnit} onChange={(v) => setHeightUnit(v as HeightUnit)}
        options={[{ value: "cm", label: "Centimeters" }, { value: "m", label: "Meters" }, { value: "ft-in", label: "Feet" }]} />
    </CalculatorShell>
  );
}
