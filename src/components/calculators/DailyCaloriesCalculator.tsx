"use client";

import { useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CalculatorShell } from "./CalculatorShell";
import { NumberInput } from "@/components/ui/NumberInput";
import { UnitSelect } from "@/components/ui/UnitSelect";
import { calculateCalories, type Sex, type ActivityLevel, type Goal } from "@/lib/calculators/calories";
import { encodeParams } from "@/lib/utils";
import type { CalculationResult } from "@/types";

export function DailyCaloriesCalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [age, setAge] = useState(Number(searchParams.get("age")) || 30);
  const [sex, setSex] = useState<Sex>((searchParams.get("sex") as Sex) || "male");
  const [weightKg, setWeightKg] = useState(Number(searchParams.get("weightKg")) || 70);
  const [heightCm, setHeightCm] = useState(Number(searchParams.get("heightCm")) || 175);
  const [activity, setActivity] = useState<ActivityLevel>((searchParams.get("activity") as ActivityLevel) || "moderate");
  const [goal, setGoal] = useState<Goal>((searchParams.get("goal") as Goal) || "maintain");
  const [weeklyTargetKg, setWeeklyTargetKg] = useState(Number(searchParams.get("weeklyTargetKg")) || 0.5);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(() => {
    try {
      setError(null);
      const res = calculateCalories({ age, sex, weightKg, heightCm, activity, goal, weeklyTargetKg });
      setResult(res);
      router.replace(`?${encodeParams({ age, sex, weightKg, heightCm, activity, goal, weeklyTargetKg })}`, { scroll: false });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }, [age, sex, weightKg, heightCm, activity, goal, weeklyTargetKg, router]);

  return (
    <CalculatorShell slug="daily-calories" title="Daily Calorie Calculator" result={result} error={error} onCalculate={calculate}>
      <NumberInput label="Age" value={age} onChange={setAge} min={15} max={100} />
      <UnitSelect label="Sex" value={sex} onChange={(v) => setSex(v as Sex)} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
      <NumberInput label="Weight (kg)" value={weightKg} onChange={setWeightKg} min={30} />
      <NumberInput label="Height (cm)" value={heightCm} onChange={setHeightCm} min={100} />
      <UnitSelect label="Activity Level" value={activity} onChange={(v) => setActivity(v as ActivityLevel)}
        options={[
          { value: "sedentary", label: "Sedentary" },
          { value: "light", label: "Lightly Active" },
          { value: "moderate", label: "Moderately Active" },
          { value: "active", label: "Active" },
          { value: "very_active", label: "Very Active" },
        ]} />
      <UnitSelect label="Goal" value={goal} onChange={(v) => setGoal(v as Goal)}
        options={[{ value: "maintain", label: "Maintain" }, { value: "lose", label: "Lose Weight" }, { value: "gain", label: "Gain Weight" }]} />
      {goal !== "maintain" && <NumberInput label="Weekly Target (kg)" value={weeklyTargetKg} onChange={setWeeklyTargetKg} min={0.1} step={0.1} />}
    </CalculatorShell>
  );
}
