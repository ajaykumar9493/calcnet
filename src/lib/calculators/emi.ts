import type { CalculationResult } from "@/types";
import { formatNumber, round } from "@/lib/utils";

export interface EMIInput {
  principal: number;
  annualRate: number;
  tenureYears: number;
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export function calculateEMI(input: EMIInput): CalculationResult & {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  schedule: AmortizationRow[];
} {
  const { principal, annualRate, tenureYears } = input;
  if (principal <= 0) throw new Error("Principal must be positive");
  if (annualRate < 0) throw new Error("Interest rate cannot be negative");
  if (tenureYears <= 0) throw new Error("Tenure must be positive");

  const r = annualRate / 12 / 100;
  const N = Math.round(tenureYears * 12);

  let emi: number;
  if (r === 0) {
    emi = principal / N;
  } else {
    const factor = Math.pow(1 + r, N);
    emi = (principal * r * factor) / (factor - 1);
  }

  const schedule: AmortizationRow[] = [];
  let balance = principal;
  let totalInterest = 0;

  for (let month = 1; month <= N; month++) {
    const interest = balance * r;
    const principalPortion = emi - interest;
    balance = Math.max(0, balance - principalPortion);
    totalInterest += interest;
    schedule.push({
      month,
      payment: round(emi),
      principal: round(principalPortion),
      interest: round(interest),
      balance: round(balance),
    });
  }

  const totalPayment = emi * N;

  return {
    headline: `Monthly EMI: ${formatNumber(emi)}`,
    summary: {
      EMI: round(emi),
      "Total Payment": round(totalPayment),
      "Total Interest": round(totalInterest),
      "Loan Tenure (months)": N,
    },
    steps: [
      {
        label: "Monthly interest rate",
        formula: "r = annual_rate / 12 / 100",
        value: `${formatNumber(r * 100, 4)}%`,
      },
      {
        label: "Number of months",
        formula: "N = tenure_years × 12",
        value: String(N),
      },
      {
        label: "EMI formula",
        formula: "EMI = P × r × (1+r)^N / ((1+r)^N - 1)",
        value: formatNumber(emi),
      },
    ],
    breakdown: schedule.slice(0, 12).map((row) => ({
      Month: row.month,
      Payment: row.payment,
      Principal: row.principal,
      Interest: row.interest,
      Balance: row.balance,
    })),
    interpretation:
      `Your monthly payment of ${formatNumber(emi)} over ${N} months will cost ${formatNumber(totalInterest)} in total interest.`,
    assumptions: [
      "Fixed interest rate for the entire loan term.",
      "Payments made at the end of each month.",
      "No fees, prepayment penalties, or rate changes.",
    ],
    chartData: schedule.map((row) => ({
      month: row.month,
      principal: row.principal,
      interest: row.interest,
      balance: row.balance,
    })),
    raw: { emi, totalPayment, totalInterest, schedule },
    emi: round(emi),
    totalPayment: round(totalPayment),
    totalInterest: round(totalInterest),
    schedule,
  };
}
