import type { CalculationResult } from "@/types";
import { formatNumber, round } from "@/lib/utils";

export interface SIPInput {
  monthlyInvestment: number;
  annualReturn: number;
  years: number;
  yearlyIncreasePercent?: number;
  inflationRate?: number;
  adjustForInflation?: boolean;
}

export function calculateSIP(input: SIPInput): CalculationResult {
  const { monthlyInvestment, annualReturn, years } = input;
  if (monthlyInvestment <= 0) throw new Error("Monthly investment must be positive");
  if (annualReturn < 0) throw new Error("Return rate cannot be negative");
  if (years <= 0) throw new Error("Investment period must be positive");

  const r = annualReturn / 12 / 100;
  const N = years * 12;
  const yearlyIncrease = (input.yearlyIncreasePercent ?? 0) / 100;
  const inflation = input.inflationRate ?? 0;

  let balance = 0;
  let totalInvested = 0;
  let monthlyAmount = monthlyInvestment;
  const yearlyTable: Array<{ year: number; invested: number; value: number; returns: number }> = [];

  for (let month = 1; month <= N; month++) {
    if (month > 1 && (month - 1) % 12 === 0 && yearlyIncrease > 0) {
      monthlyAmount *= 1 + yearlyIncrease;
    }
    balance = (balance + monthlyAmount) * (1 + r);
    totalInvested += monthlyAmount;

    if (month % 12 === 0) {
      const year = month / 12;
      yearlyTable.push({
        year,
        invested: round(totalInvested),
        value: round(balance),
        returns: round(balance - totalInvested),
      });
    }
  }

  let finalCorpus = balance;
  if (input.adjustForInflation && inflation > 0) {
    finalCorpus = balance / Math.pow(1 + inflation / 100, years);
  }

  const totalReturns = balance - totalInvested;

  // Standard FV formula for verification
  let fvFormula: number;
  if (r === 0) {
    fvFormula = monthlyInvestment * N;
  } else {
    fvFormula = monthlyInvestment * (((Math.pow(1 + r, N) - 1) / r) * (1 + r));
  }

  return {
    headline: `Final corpus: ${formatNumber(balance)}`,
    summary: {
      "Final Corpus": round(balance),
      "Total Invested": round(totalInvested),
      "Total Returns": round(totalReturns),
      "Inflation-Adjusted": input.adjustForInflation ? round(finalCorpus) : "N/A",
      "Formula FV (no step-up)": round(fvFormula),
    },
    steps: [
      {
        label: "Monthly rate",
        formula: "r = annual_return / 12 / 100",
        value: `${formatNumber(r * 100, 4)}%`,
      },
      {
        label: "FV of annuity due",
        formula: "FV = P × [((1+r)^N - 1) / r] × (1+r)",
        value: formatNumber(fvFormula),
      },
    ],
    breakdown: yearlyTable.map((y) => ({
      Year: y.year,
      Invested: y.invested,
      Value: y.value,
      Returns: y.returns,
    })),
    interpretation: `Investing ${formatNumber(monthlyInvestment)}/month at ${annualReturn}% for ${years} years grows to ${formatNumber(balance)}.`,
    assumptions: [
      "Returns compounded monthly.",
      "Investments made at the start of each month.",
      "Past performance does not guarantee future returns.",
    ],
    chartData: yearlyTable.map((y) => ({
      year: y.year,
      invested: y.invested,
      value: y.value,
    })),
    raw: { balance, totalInvested, totalReturns, yearlyTable },
  };
}
