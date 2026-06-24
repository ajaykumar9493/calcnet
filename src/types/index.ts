export type CategoryId = "financial" | "health" | "date-time" | "unit-converter";

export type SortOption = "popular" | "new" | "alphabetical";

export interface CalculatorMeta {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: CategoryId;
  tags: string[];
  addedAt: string;
  popularity: number;
  sampleResult?: string;
}

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  description: string;
}

export interface CalculationStep {
  label: string;
  formula: string;
  value: string;
}

export interface CalculationResult<T = Record<string, unknown>> {
  headline: string;
  summary: Record<string, string | number>;
  steps: CalculationStep[];
  breakdown: Array<Record<string, string | number>>;
  interpretation: string;
  assumptions: string[];
  chartData?: Array<Record<string, string | number>>;
  raw: T;
}

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
}

export interface TaxRegime {
  id: string;
  country: string;
  currency: string;
  year: number;
  filingStatuses: string[];
  brackets: Record<string, TaxBracket[]>;
  standardDeduction: Record<string, number>;
}

export interface PopularityEntry {
  slug: string;
  views: number;
  lastViewed: string;
}
