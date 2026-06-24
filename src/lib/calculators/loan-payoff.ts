import type { CalculationResult } from "@/types";
import { formatNumber, round } from "@/lib/utils";

export interface LoanPayoffInput {
  principal: number;
  annualRate: number;
  tenureYears: number;
  extraMonthly: number;
  extraOneTime: number;
}

export function calculateLoanPayoff(input: LoanPayoffInput): CalculationResult {
  const r = input.annualRate / 12 / 100;
  const N = Math.round(input.tenureYears * 12);
  const factor = r === 0 ? 1 : (Math.pow(1 + r, N) * r) / (Math.pow(1 + r, N) - 1);
  const emi = input.principal * factor;

  let balance = input.principal - input.extraOneTime;
  let month = 0;
  let totalInterest = 0;
  const schedule: Array<{ month: number; payment: number; interest: number; balance: number }> = [];

  while (balance > 0.01 && month < N + 360) {
    month++;
    const interest = balance * r;
    let principalPortion = emi - interest + input.extraMonthly;
    if (principalPortion > balance) principalPortion = balance;
    balance -= principalPortion;
    totalInterest += interest;
    schedule.push({
      month,
      payment: round(principalPortion + interest),
      interest: round(interest),
      balance: round(Math.max(0, balance)),
    });
  }

  const standardInterest = emi * N - input.principal;
  const interestSaved = standardInterest - totalInterest;

  return {
    headline: `Payoff in ${month} months (save ${formatNumber(interestSaved)} interest)`,
    summary: {
      "Regular EMI": round(emi),
      "Payoff Months": month,
      "Standard Term": N,
      "Total Interest": round(totalInterest),
      "Interest Saved": round(interestSaved),
      "Months Saved": N - month,
    },
    steps: [
      {
        label: "Base EMI",
        formula: "standard amortization formula",
        value: formatNumber(emi),
      },
      {
        label: "With extra payments",
        formula: "accelerated principal reduction",
        value: `${month} months`,
      },
    ],
    breakdown: schedule.filter((_, i) => i % 12 === 0 || i === schedule.length - 1).map((s) => ({
      Month: s.month,
      Payment: s.payment,
      Interest: s.interest,
      Balance: s.balance,
    })),
    interpretation: `Extra payments of ${formatNumber(input.extraMonthly)}/month reduce your loan by ${N - month} months.`,
    assumptions: ["No prepayment penalties.", "Extra payments applied to principal."],
    chartData: schedule.map((s) => ({
      month: s.month,
      balance: s.balance,
      interest: s.interest,
    })),
    raw: { month, totalInterest, interestSaved, schedule },
  };
}
