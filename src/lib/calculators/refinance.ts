import type { CalculationResult } from "@/types";
import { formatNumber, round } from "@/lib/utils";
import { calculateEMI } from "./emi";

export interface RefinanceInput {
  currentPrincipal: number;
  currentRate: number;
  currentRemainingYears: number;
  newRate: number;
  newTenureYears: number;
  closingCosts: number;
}

export function calculateRefinance(input: RefinanceInput): CalculationResult {
  const current = calculateEMI({
    principal: input.currentPrincipal,
    annualRate: input.currentRate,
    tenureYears: input.currentRemainingYears,
  });

  const newPrincipal = input.currentPrincipal + input.closingCosts;
  const refinanced = calculateEMI({
    principal: newPrincipal,
    annualRate: input.newRate,
    tenureYears: input.newTenureYears,
  });

  const monthlySavings = current.emi - refinanced.emi;
  const breakEvenMonths =
    monthlySavings > 0
      ? Math.ceil(input.closingCosts / monthlySavings)
      : Infinity;
  const currentTotal = current.emi * current.schedule.length;
  const newTotal = refinanced.emi * refinanced.schedule.length;
  const lifetimeSavings = currentTotal - newTotal;

  return {
    headline:
      monthlySavings > 0
        ? `Save ${formatNumber(monthlySavings)}/month (break-even: ${breakEvenMonths} months)`
        : `Refinancing costs ${formatNumber(Math.abs(monthlySavings))}/month more`,
    summary: {
      "Current EMI": current.emi,
      "New EMI": refinanced.emi,
      "Monthly Savings": round(monthlySavings),
      "Closing Costs": round(input.closingCosts),
      "Break-even Months": breakEvenMonths === Infinity ? "N/A" : breakEvenMonths,
      "Lifetime Savings": round(lifetimeSavings),
    },
    steps: [
      {
        label: "Current loan EMI",
        formula: `P=${formatNumber(input.currentPrincipal)}, r=${input.currentRate}%`,
        value: formatNumber(current.emi),
      },
      {
        label: "Refinanced EMI",
        formula: `P=${formatNumber(newPrincipal)}, r=${input.newRate}%`,
        value: formatNumber(refinanced.emi),
      },
    ],
    breakdown: [
      { Item: "Current Total Cost", Value: round(currentTotal) },
      { Item: "New Total Cost", Value: round(newTotal) },
      { Item: "Monthly Difference", Value: round(monthlySavings) },
      { Item: "Break-even", Value: breakEvenMonths === Infinity ? "Never" : `${breakEvenMonths} mo` },
    ],
    interpretation:
      monthlySavings > 0
        ? `Refinancing saves ${formatNumber(monthlySavings)} monthly. You'll recover closing costs in ${breakEvenMonths} months.`
        : "The new loan has a higher monthly payment. Consider a shorter term only if you can afford it.",
    assumptions: [
      "Closing costs rolled into new principal.",
      "Fixed rates for both loans.",
      "Does not account for tax implications.",
    ],
    chartData: [
      { option: "Current", emi: current.emi, total: currentTotal },
      { option: "Refinanced", emi: refinanced.emi, total: newTotal },
    ],
    raw: { current, refinanced, monthlySavings, breakEvenMonths },
  };
}
