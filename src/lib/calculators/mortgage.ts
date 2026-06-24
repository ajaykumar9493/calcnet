import type { CalculationResult } from "@/types";
import { formatNumber, round } from "@/lib/utils";
import { calculateEMI, type AmortizationRow } from "./emi";
import { addMonths, format } from "date-fns";

export interface MortgageInput {
  homePrice: number;
  downPayment: number;
  annualRate: number;
  tenureYears: number;
  propertyTaxAnnual: number;
  insuranceAnnual: number;
  startDate: string;
  extraMonthlyPayment?: number;
  extraOneTimePayment?: number;
}

export function calculateMortgage(input: MortgageInput): CalculationResult {
  const principal = input.homePrice - input.downPayment;
  const base = calculateEMI({
    principal,
    annualRate: input.annualRate,
    tenureYears: input.tenureYears,
  });

  const monthlyTax = input.propertyTaxAnnual / 12;
  const monthlyInsurance = input.insuranceAnnual / 12;
  const extra = input.extraMonthlyPayment ?? 0;
  const oneTime = input.extraOneTimePayment ?? 0;

  const schedule: Array<AmortizationRow & { date: string; totalPayment: number }> = [];
  const r = input.annualRate / 12 / 100;
  let balance = principal - oneTime;
  let month = 0;
  const maxMonths = Math.round(input.tenureYears * 12) + 120;
  let totalInterest = 0;
  const start = new Date(input.startDate);

  while (balance > 0.01 && month < maxMonths) {
    month++;
    const interest = balance * r;
    let principalPortion = base.emi - interest + extra;
    if (principalPortion > balance) principalPortion = balance;
    balance -= principalPortion;
    totalInterest += interest;
    const totalPayment = principalPortion + interest + monthlyTax + monthlyInsurance;
    schedule.push({
      month,
      payment: round(principalPortion + interest),
      principal: round(principalPortion),
      interest: round(interest),
      balance: round(Math.max(0, balance)),
      date: format(addMonths(start, month - 1), "yyyy-MM-dd"),
      totalPayment: round(totalPayment),
    });
  }

  const fullMonthly = base.emi + monthlyTax + monthlyInsurance + extra;

  return {
    headline: `Monthly payment: ${formatNumber(fullMonthly)} (incl. tax & insurance)`,
    summary: {
      "Loan Amount": round(principal),
      "Base EMI": base.emi,
      "Property Tax/mo": round(monthlyTax),
      "Insurance/mo": round(monthlyInsurance),
      "Total Interest": round(totalInterest),
      "Payoff Months": month,
    },
    steps: base.steps,
    breakdown: schedule.slice(0, 12).map((row) => ({
      Date: row.date,
      Payment: row.totalPayment,
      Principal: row.principal,
      Interest: row.interest,
      Balance: row.balance,
    })),
    interpretation: extra > 0 || oneTime > 0
      ? `With extra payments, your loan pays off in ${month} months instead of ${base.schedule.length}.`
      : `Your total monthly housing cost is ${formatNumber(fullMonthly)} including escrow.`,
    assumptions: [
      "Fixed-rate mortgage with level payments.",
      "Property tax and insurance held constant.",
      "Extra payments applied directly to principal.",
    ],
    chartData: schedule.map((row) => ({
      month: row.month,
      principal: row.principal,
      interest: row.interest,
      balance: row.balance,
    })),
    raw: { schedule, fullMonthly },
  };
}
