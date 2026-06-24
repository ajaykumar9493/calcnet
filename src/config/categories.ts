import type { CategoryMeta } from "@/types";

export const categories: CategoryMeta[] = [
  {
    id: "financial",
    name: "Financial",
    description:
      "Loan, mortgage, investment, tax, and savings calculators for smart money decisions.",
  },
  {
    id: "health",
    name: "Health",
    description:
      "BMI, calorie, pregnancy, and wellness calculators based on established medical formulas.",
  },
  {
    id: "date-time",
    name: "Date & Time",
    description:
      "Age, date difference, and countdown calculators for planning and scheduling.",
  },
  {
    id: "unit-converter",
    name: "Unit Converter",
    description:
      "Convert length, weight, temperature, speed, volume, and more with precise factors.",
  },
];

export function getCategory(id: string) {
  return categories.find((c) => c.id === id);
}
