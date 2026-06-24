import type { CalculationResult } from "@/types";
import { formatNumber, round } from "@/lib/utils";

export type Sex = "male" | "female";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";
export type Goal = "maintain" | "lose" | "gain";

const activityFactors: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export interface CalorieInput {
  age: number;
  sex: Sex;
  weightKg: number;
  heightCm: number;
  activity: ActivityLevel;
  goal: Goal;
  weeklyTargetKg?: number;
}

export function calculateCalories(input: CalorieInput): CalculationResult {
  const { age, sex, weightKg, heightCm, activity, goal } = input;
  if (age <= 0 || weightKg <= 0 || heightCm <= 0) {
    throw new Error("Age, weight, and height must be positive");
  }

  // Mifflin-St Jeor
  const bmr =
    sex === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const maintenance = bmr * activityFactors[activity];
  const weeklyKg = input.weeklyTargetKg ?? (goal === "lose" ? 0.5 : goal === "gain" ? 0.25 : 0);
  const dailyAdjustment = (weeklyKg * 7700) / 7; // 7700 kcal per kg
  let target = maintenance;
  if (goal === "lose") target = maintenance - dailyAdjustment;
  if (goal === "gain") target = maintenance + dailyAdjustment;

  return {
    headline: `Daily target: ${formatNumber(target, 0)} kcal`,
    summary: {
      BMR: round(bmr, 0),
      "Maintenance Calories": round(maintenance, 0),
      "Daily Target": round(target, 0),
      "Daily Adjustment": round(target - maintenance, 0),
      "Activity Factor": activityFactors[activity],
    },
    steps: [
      {
        label: "BMR (Mifflin-St Jeor)",
        formula:
          sex === "male"
            ? "10×W + 6.25×H - 5×A + 5"
            : "10×W + 6.25×H - 5×A - 161",
        value: `${formatNumber(bmr, 0)} kcal`,
      },
      {
        label: "TDEE",
        formula: "BMR × activity factor",
        value: `${formatNumber(maintenance, 0)} kcal`,
      },
    ],
    breakdown: [
      { Meal: "Breakfast (~25%)", Calories: round(target * 0.25, 0) },
      { Meal: "Lunch (~35%)", Calories: round(target * 0.35, 0) },
      { Meal: "Dinner (~30%)", Calories: round(target * 0.3, 0) },
      { Meal: "Snacks (~10%)", Calories: round(target * 0.1, 0) },
    ],
    interpretation: `To ${goal} weight, aim for approximately ${formatNumber(target, 0)} calories per day.`,
    assumptions: [
      "Mifflin-St Jeor equation for BMR.",
      "1 kg body weight ≈ 7,700 kcal.",
      "Individual metabolism varies.",
    ],
    raw: { bmr, maintenance, target },
  };
}
