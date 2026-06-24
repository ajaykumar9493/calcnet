import type { CalculationResult } from "@/types";
import { formatNumber, round } from "@/lib/utils";

export type IdealWeightMethod = "devine" | "bmi";
export type Sex = "male" | "female";

export interface IdealWeightInput {
  heightCm: number;
  sex: Sex;
  method: IdealWeightMethod;
  targetBmi?: number;
}

function heightToInches(cm: number): number {
  return cm / 2.54;
}

export function devineWeightKg(sex: Sex, heightCm: number): number {
  const inches = heightToInches(heightCm);
  const inchesOver5ft = Math.max(0, inches - 60);
  const base = sex === "male" ? 50 : 45.5;
  return base + 2.3 * inchesOver5ft;
}

export function bmiTargetWeightKg(heightCm: number, targetBmi = 22): number {
  const heightM = heightCm / 100;
  return targetBmi * heightM * heightM;
}

export function calculateIdealWeight(input: IdealWeightInput): CalculationResult {
  const { heightCm, sex, method, targetBmi = 22 } = input;
  if (heightCm <= 0) throw new Error("Height must be positive");

  const devine = devineWeightKg(sex, heightCm);
  const bmiTarget = bmiTargetWeightKg(heightCm, targetBmi);
  const bmiMin = bmiTargetWeightKg(heightCm, 18.5);
  const bmiMax = bmiTargetWeightKg(heightCm, 24.9);
  const primary = method === "devine" ? devine : bmiTarget;

  return {
    headline: `Ideal weight: ${formatNumber(primary, 1)} kg`,
    summary: {
      "Devine Formula": round(devine, 1),
      "BMI Target (22)": round(bmiTarget, 1),
      "Healthy BMI Range": `${round(bmiMin, 1)} - ${round(bmiMax, 1)} kg`,
      Method: method === "devine" ? "Devine" : `BMI target (${targetBmi})`,
    },
    steps: [
      {
        label: "Devine formula",
        formula:
          sex === "male"
            ? "50 kg + 2.3 kg per inch over 5 ft"
            : "45.5 kg + 2.3 kg per inch over 5 ft",
        value: `${formatNumber(devine, 1)} kg`,
      },
      {
        label: "BMI-based target",
        formula: "weight = BMI × height(m)²",
        value: `${formatNumber(bmiTarget, 1)} kg`,
      },
    ],
    breakdown: [
      { Method: "Devine", Weight: round(devine, 1) },
      { Method: "BMI 18.5 (min)", Weight: round(bmiMin, 1) },
      { Method: "BMI 22 (mid)", Weight: round(bmiTarget, 1) },
      { Method: "BMI 24.9 (max)", Weight: round(bmiMax, 1) },
    ],
    interpretation: `Based on the ${method} method, your ideal weight is approximately ${formatNumber(primary, 1)} kg.`,
    assumptions: [
      "Devine formula is an estimate for adults.",
      "Healthy weight varies by body composition.",
      "Consult a healthcare provider for personalized goals.",
    ],
    raw: { devine, bmiTarget, bmiMin, bmiMax, primary },
  };
}
