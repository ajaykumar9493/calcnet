import type { CalculationResult } from "@/types";
import { formatNumber, round } from "@/lib/utils";

export type WeightUnit = "kg" | "lb";
export type HeightUnit = "cm" | "m" | "ft-in";

export interface BMIInput {
  weight: number;
  weightUnit: WeightUnit;
  height: number;
  heightUnit: HeightUnit;
  heightInches?: number;
}

const categories = [
  { name: "Underweight", min: 0, max: 18.5, color: "#60a5fa" },
  { name: "Normal", min: 18.5, max: 25, color: "#34d399" },
  { name: "Overweight", min: 25, max: 30, color: "#fbbf24" },
  { name: "Obese", min: 30, max: 100, color: "#f87171" },
];

function toKg(weight: number, unit: WeightUnit): number {
  return unit === "lb" ? weight * 0.45359237 : weight;
}

function toMeters(
  height: number,
  unit: HeightUnit,
  inches = 0
): number {
  if (unit === "cm") return height / 100;
  if (unit === "m") return height;
  return (height * 12 + inches) * 0.0254;
}

export function getBMICategory(bmi: number): string {
  for (const cat of categories) {
    if (bmi < cat.max) return cat.name;
  }
  return "Obese";
}

export function calculateBMI(input: BMIInput): CalculationResult {
  const weightKg = toKg(input.weight, input.weightUnit);
  const heightM = toMeters(input.height, input.heightUnit, input.heightInches);

  if (weightKg <= 0) throw new Error("Weight must be positive");
  if (heightM <= 0) throw new Error("Height must be positive");

  const bmi = weightKg / (heightM * heightM);
  const category = getBMICategory(bmi);
  const idealMin = 18.5 * heightM * heightM;
  const idealMax = 24.9 * heightM * heightM;

  return {
    headline: `BMI: ${formatNumber(bmi, 1)} (${category})`,
    summary: {
      BMI: round(bmi, 1),
      Category: category,
      "Weight (kg)": round(weightKg, 1),
      "Height (m)": round(heightM, 2),
      "Ideal Weight Range (kg)": `${round(idealMin, 1)} - ${round(idealMax, 1)}`,
    },
    steps: [
      {
        label: "Convert to metric",
        formula: "weight in kg, height in meters",
        value: `${round(weightKg, 1)} kg, ${round(heightM, 2)} m`,
      },
      {
        label: "BMI formula",
        formula: "BMI = weight(kg) / height(m)²",
        value: formatNumber(bmi, 1),
      },
    ],
    breakdown: categories.map((c) => ({
      Category: c.name,
      Range: `${c.min} - ${c.max === 100 ? "40+" : c.max}`,
      "Your BMI": bmi >= c.min && bmi < c.max ? "✓" : "",
    })),
    interpretation:
      category === "Normal"
        ? "Your BMI is within the healthy range. Maintain balanced nutrition and regular activity."
        : `Your BMI of ${formatNumber(bmi, 1)} is classified as ${category}. Consult a healthcare provider for personalized advice.`,
    assumptions: [
      "BMI does not distinguish muscle from fat.",
      "WHO ranges used for adults 20+.",
      "Not suitable for athletes, pregnant women, or children.",
    ],
    chartData: categories.map((c) => ({
      category: c.name,
      min: c.min,
      max: c.max === 100 ? 40 : c.max,
      current: bmi,
    })),
    raw: { bmi, category, weightKg, heightM },
  };
}

export { categories as bmiCategories };
