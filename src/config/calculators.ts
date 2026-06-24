import type { CalculatorMeta } from "@/types";

export const calculators: CalculatorMeta[] = [
  {
    slug: "emi-loan",
    name: "EMI / Loan Calculator",
    shortDescription: "Calculate monthly loan payments and amortization schedule.",
    description:
      "Compute equated monthly installments (EMI), total interest, and full amortization schedule for any loan.",
    category: "financial",
    tags: ["finance", "emi", "loan", "mortgage", "payment", "amortization"],
    addedAt: "2025-01-15",
    popularity: 100,
    sampleResult: "EMI ≈ ₹40,389.64 for ₹50L at 7.5% over 20 years",
  },
  {
    slug: "mortgage",
    name: "Mortgage Calculator",
    shortDescription: "Full mortgage with taxes, insurance, and extra payments.",
    description:
      "Calculate mortgage payments including property tax, insurance, down payment, and early payoff scenarios.",
    category: "financial",
    tags: ["finance", "mortgage", "home", "loan", "property"],
    addedAt: "2025-01-20",
    popularity: 95,
  },
  {
    slug: "sip",
    name: "SIP Calculator",
    shortDescription: "Project returns from systematic investment plans.",
    description:
      "Estimate future corpus from monthly SIP investments with optional yearly increases and inflation adjustment.",
    category: "financial",
    tags: ["finance", "sip", "investment", "mutual fund", "savings"],
    addedAt: "2025-02-01",
    popularity: 90,
    sampleResult: "Final corpus ≈ ₹11,62,702 for ₹5,000/mo at 12% over 10 years",
  },
  {
    slug: "compound-interest",
    name: "Compound Interest Calculator",
    shortDescription: "See how your money grows with compound interest.",
    description:
      "Calculate compound interest with flexible compounding frequency and yearly growth schedule.",
    category: "financial",
    tags: ["finance", "interest", "savings", "investment"],
    addedAt: "2025-02-10",
    popularity: 85,
  },
  {
    slug: "income-tax",
    name: "Income Tax Calculator",
    shortDescription: "Estimate income tax with progressive brackets.",
    description:
      "Calculate tax payable, net income, and bracket breakdown using configurable tax rules.",
    category: "financial",
    tags: ["finance", "tax", "income", "payroll"],
    addedAt: "2025-02-15",
    popularity: 80,
  },
  {
    slug: "loan-payoff",
    name: "Loan Payoff Calculator",
    shortDescription: "See how extra payments reduce loan term and interest.",
    description:
      "Simulate extra monthly or one-time payments to see early payoff date and interest savings.",
    category: "financial",
    tags: ["finance", "loan", "payoff", "debt"],
    addedAt: "2025-03-01",
    popularity: 70,
  },
  {
    slug: "refinance",
    name: "Refinance Calculator",
    shortDescription: "Compare two loan options side by side.",
    description:
      "Compare current vs refinanced loan terms to find monthly savings and break-even point.",
    category: "financial",
    tags: ["finance", "refinance", "loan", "compare"],
    addedAt: "2025-03-10",
    popularity: 65,
  },
  {
    slug: "bmi",
    name: "BMI Calculator",
    shortDescription: "Calculate Body Mass Index and health category.",
    description:
      "Compute BMI from weight and height with WHO category classification and visual range chart.",
    category: "health",
    tags: ["health", "bmi", "weight", "fitness"],
    addedAt: "2025-01-10",
    popularity: 98,
    sampleResult: "BMI ≈ 22.9 (Normal) for 70 kg, 175 cm",
  },
  {
    slug: "daily-calories",
    name: "Daily Calorie Calculator",
    shortDescription: "Estimate daily calories using Mifflin-St Jeor.",
    description:
      "Calculate BMR, maintenance calories, and goal-adjusted intake based on activity level.",
    category: "health",
    tags: ["health", "calories", "diet", "nutrition", "bmr"],
    addedAt: "2025-01-25",
    popularity: 75,
  },
  {
    slug: "pregnancy-due-date",
    name: "Pregnancy Due Date Calculator",
    shortDescription: "Estimate due date and track pregnancy milestones.",
    description:
      "Calculate due date from LMP, conception, or ultrasound using Naegele's rule with trimester timeline.",
    category: "health",
    tags: ["health", "pregnancy", "due date", "baby"],
    addedAt: "2025-02-05",
    popularity: 72,
    sampleResult: "Due date Oct 8, 2026 for LMP Jan 1, 2026",
  },
  {
    slug: "ideal-weight",
    name: "Ideal Weight Calculator",
    shortDescription: "Find ideal weight by Devine formula or BMI target.",
    description:
      "Estimate healthy weight range using Devine formula or target BMI method.",
    category: "health",
    tags: ["health", "weight", "ideal", "fitness"],
    addedAt: "2025-02-20",
    popularity: 60,
  },
  {
    slug: "age",
    name: "Age Calculator",
    shortDescription: "Calculate exact age in years, months, and days.",
    description:
      "Find precise age between two dates with next birthday countdown.",
    category: "date-time",
    tags: ["date", "age", "birthday"],
    addedAt: "2025-01-05",
    popularity: 88,
  },
  {
    slug: "date-difference",
    name: "Date Difference Calculator",
    shortDescription: "Find days, weeks, and months between two dates.",
    description:
      "Calculate date differences with business days option and holiday exclusions.",
    category: "date-time",
    tags: ["date", "difference", "days", "business days"],
    addedAt: "2025-01-12",
    popularity: 82,
  },
  {
    slug: "countdown",
    name: "Countdown Timer",
    shortDescription: "Live countdown to any date and time.",
    description:
      "Create a live countdown with timezone support and embeddable widget code.",
    category: "date-time",
    tags: ["date", "countdown", "timer", "event"],
    addedAt: "2025-02-25",
    popularity: 68,
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    shortDescription: "Convert between metric and imperial units.",
    description:
      "Accurate unit conversions for length, weight, temperature, speed, volume, and more.",
    category: "unit-converter",
    tags: ["unit", "convert", "length", "weight", "temperature"],
    addedAt: "2025-01-01",
    popularity: 92,
    sampleResult: "10 miles = 16.0934 km",
  },
];

export function getCalculator(slug: string) {
  return calculators.find((c) => c.slug === slug);
}

export function getCalculatorsByCategory(category: string) {
  return calculators.filter((c) => c.category === category);
}

export function sortCalculators(
  items: CalculatorMeta[],
  sort: "popular" | "new" | "alphabetical",
  popularityMap?: Record<string, number>
) {
  const sorted = [...items];
  if (sort === "popular") {
    sorted.sort(
      (a, b) =>
        (popularityMap?.[b.slug] ?? b.popularity) -
        (popularityMap?.[a.slug] ?? a.popularity)
    );
  } else if (sort === "new") {
    sorted.sort(
      (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    );
  } else {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  return sorted;
}

export const featuredSlugs = ["emi-loan", "bmi", "sip", "unit-converter", "mortgage", "age"];
