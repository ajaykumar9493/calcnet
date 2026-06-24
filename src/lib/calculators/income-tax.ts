import type { CalculationResult, TaxBracket, TaxRegime } from "@/types";
import { formatNumber, round } from "@/lib/utils";
import taxRulesData from "@/config/tax-rules.json";

export interface IncomeTaxInput {
  grossIncome: number;
  filingStatus: string;
  deductions: number;
  regimeId: string;
}

export function getTaxRegimes(): TaxRegime[] {
  return taxRulesData.regimes as unknown as TaxRegime[];
}

export function getTaxRegime(id: string): TaxRegime | undefined {
  return getTaxRegimes().find((r) => r.id === id);
}

function computeBracketTax(taxableIncome: number, brackets: TaxBracket[]) {
  let tax = 0;
  let marginalRate = 0;
  const breakdown: Array<{
    bracket: string;
    rate: string;
    taxable: number;
    tax: number;
  }> = [];

  for (const bracket of brackets) {
    const max = bracket.max ?? Infinity;
    if (taxableIncome <= bracket.min) break;
    const taxable = Math.min(taxableIncome, max) - bracket.min;
    if (taxable <= 0) continue;
    const bracketTax = taxable * bracket.rate;
    tax += bracketTax;
    marginalRate = bracket.rate;
    breakdown.push({
      bracket: `${formatNumber(bracket.min, 0)} - ${bracket.max ? formatNumber(bracket.max, 0) : "∞"}`,
      rate: `${bracket.rate * 100}%`,
      taxable: round(taxable),
      tax: round(bracketTax),
    });
  }

  return { tax, marginalRate, breakdown };
}

export function calculateIncomeTax(input: IncomeTaxInput): CalculationResult {
  const regime = getTaxRegime(input.regimeId);
  if (!regime) throw new Error("Tax regime not found");

  const standardDeduction =
    regime.standardDeduction[input.filingStatus] ?? 0;
  const totalDeductions = standardDeduction + input.deductions;
  const taxableIncome = Math.max(0, input.grossIncome - totalDeductions);
  const brackets = regime.brackets[input.filingStatus];
  if (!brackets) throw new Error("Invalid filing status");

  const { tax, marginalRate, breakdown } = computeBracketTax(
    taxableIncome,
    brackets
  );
  const netIncome = input.grossIncome - tax;
  const effectiveRate =
    input.grossIncome > 0 ? (tax / input.grossIncome) * 100 : 0;

  return {
    headline: `Tax payable: ${formatNumber(tax)} ${regime.currency}`,
    summary: {
      "Gross Income": round(input.grossIncome),
      Deductions: round(totalDeductions),
      "Taxable Income": round(taxableIncome),
      "Tax Payable": round(tax),
      "Net Income": round(netIncome),
      "Marginal Rate": `${round(marginalRate * 100, 1)}%`,
      "Effective Rate": `${round(effectiveRate, 2)}%`,
    },
    steps: [
      {
        label: "Taxable income",
        formula: "gross - standard_deduction - deductions",
        value: formatNumber(taxableIncome),
      },
      {
        label: "Progressive bracket tax",
        formula: "sum of (bracket_income × rate)",
        value: formatNumber(tax),
      },
    ],
    breakdown: breakdown.map((b) => ({
      Bracket: b.bracket,
      Rate: b.rate,
      Taxable: b.taxable,
      Tax: b.tax,
    })),
    interpretation: `You owe ${formatNumber(tax)} in taxes on ${formatNumber(input.grossIncome)} gross income, leaving ${formatNumber(netIncome)} net.`,
    assumptions: [
      `Using ${regime.country} ${regime.year} tax brackets.`,
      "Does not include credits, state/local taxes, or payroll taxes.",
      "Consult a tax professional for official filing.",
    ],
    raw: { tax, netIncome, marginalRate, effectiveRate },
  };
}

export function calculateTaxFromPayrollCsv(
  rows: Array<{ month: string; gross: number }>,
  regimeId: string,
  filingStatus: string,
  deductions: number
) {
  const annualGross = rows.reduce((sum, r) => sum + r.gross, 0);
  return calculateIncomeTax({
    grossIncome: annualGross,
    filingStatus,
    deductions,
    regimeId,
  });
}
