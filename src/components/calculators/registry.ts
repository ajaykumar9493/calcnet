import dynamic from "next/dynamic";
import { ComponentType } from "react";

const calculatorComponents: Record<string, ComponentType> = {
  "emi-loan": dynamic(() => import("./EMICalculator").then((m) => m.EMICalculator)),
  mortgage: dynamic(() => import("./MortgageCalculator").then((m) => m.MortgageCalculator)),
  sip: dynamic(() => import("./SIPCalculator").then((m) => m.SIPCalculator)),
  "compound-interest": dynamic(() => import("./CompoundInterestCalculator").then((m) => m.CompoundInterestCalculator)),
  "income-tax": dynamic(() => import("./IncomeTaxCalculator").then((m) => m.IncomeTaxCalculator)),
  "loan-payoff": dynamic(() => import("./LoanPayoffCalculator").then((m) => m.LoanPayoffCalculator)),
  refinance: dynamic(() => import("./RefinanceCalculator").then((m) => m.RefinanceCalculator)),
  bmi: dynamic(() => import("./BMICalculator").then((m) => m.BMICalculator)),
  "daily-calories": dynamic(() => import("./DailyCaloriesCalculator").then((m) => m.DailyCaloriesCalculator)),
  "pregnancy-due-date": dynamic(() => import("./PregnancyCalculator").then((m) => m.PregnancyCalculator)),
  "ideal-weight": dynamic(() => import("./IdealWeightCalculator").then((m) => m.IdealWeightCalculator)),
  age: dynamic(() => import("./AgeCalculator").then((m) => m.AgeCalculator)),
  "date-difference": dynamic(() => import("./DateDifferenceCalculator").then((m) => m.DateDifferenceCalculator)),
  countdown: dynamic(() => import("./CountdownCalculator").then((m) => m.CountdownCalculator)),
  "unit-converter": dynamic(() => import("./UnitConverterCalculator").then((m) => m.UnitConverterCalculator)),
};

export function getCalculatorComponent(slug: string) {
  return calculatorComponents[slug] ?? null;
}
