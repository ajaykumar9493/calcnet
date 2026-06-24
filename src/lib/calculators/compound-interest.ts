import type { CalculationResult } from "@/types";
import { formatNumber, round } from "@/lib/utils";

export type CompoundingFrequency = "annual" | "quarterly" | "monthly" | "daily";

const frequencyMap: Record<CompoundingFrequency, number> = {
  annual: 1,
  quarterly: 4,
  monthly: 12,
  daily: 365,
};

export interface CompoundInterestInput {
  principal: number;
  annualRate: number;
  years: number;
  frequency: CompoundingFrequency;
}

export function calculateCompoundInterest(
  input: CompoundInterestInput
): CalculationResult {
  const { principal, annualRate, years, frequency } = input;
  if (principal <= 0) throw new Error("Principal must be positive");
  if (annualRate < 0) throw new Error("Rate cannot be negative");
  if (years <= 0) throw new Error("Time must be positive");

  const m = frequencyMap[frequency];
  const r = annualRate / 100;
  const amount = principal * Math.pow(1 + r / m, m * years);
  const interest = amount - principal;

  const schedule: Array<{ year: number; amount: number; interest: number }> = [];
  const intYears = Math.floor(years);
  for (let t = 1; t <= intYears; t++) {
    const a = principal * Math.pow(1 + r / m, m * t);
    schedule.push({
      year: t,
      amount: round(a),
      interest: round(a - principal),
    });
  }

  return {
    headline: `Final amount: ${formatNumber(amount)}`,
    summary: {
      Principal: round(principal),
      "Final Amount": round(amount),
      "Interest Earned": round(interest),
      "Effective Annual Rate": round((Math.pow(1 + r / m, m) - 1) * 100, 4) + "%",
    },
    steps: [
      {
        label: "Compounding periods per year",
        formula: "m = frequency",
        value: String(m),
      },
      {
        label: "Compound interest formula",
        formula: "A = P × (1 + r/m)^(m×t)",
        value: formatNumber(amount),
      },
    ],
    breakdown: schedule.map((s) => ({
      Year: s.year,
      Amount: s.amount,
      Interest: s.interest,
    })),
    interpretation: `Your ${formatNumber(principal)} grows to ${formatNumber(amount)} over ${years} years at ${annualRate}% compounded ${frequency}.`,
    assumptions: [
      "No additional deposits or withdrawals.",
      "Constant interest rate throughout the period.",
    ],
    chartData: schedule.map((s) => ({
      year: s.year,
      amount: s.amount,
      interest: s.interest,
    })),
    raw: { amount, interest, schedule },
  };
}
