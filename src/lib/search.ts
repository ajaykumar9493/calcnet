import Fuse from "fuse.js";
import { calculators } from "@/config/calculators";
import { categories } from "@/config/categories";
import type { CalculatorMeta } from "@/types";

export interface SearchResult extends CalculatorMeta {
  categoryName: string;
  score?: number;
}

const index: SearchResult[] = calculators.map((c) => ({
  ...c,
  categoryName:
    categories.find((cat) => cat.id === c.category)?.name ?? c.category,
}));

const fuse = new Fuse(index, {
  keys: [
    { name: "name", weight: 0.4 },
    { name: "shortDescription", weight: 0.2 },
    { name: "tags", weight: 0.3 },
    { name: "categoryName", weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
});

export function searchCalculators(
  query: string,
  limit = 20
): SearchResult[] {
  if (!query.trim()) return [];
  return fuse.search(query, { limit }).map((r) => ({
    ...r.item,
    score: r.score,
  }));
}

export function getTopSuggestions(query: string, limit = 5): SearchResult[] {
  return searchCalculators(query, limit);
}

export function groupSearchResults(results: SearchResult[]) {
  const grouped: Record<string, SearchResult[]> = {};
  for (const r of results) {
    if (!grouped[r.categoryName]) grouped[r.categoryName] = [];
    grouped[r.categoryName].push(r);
  }
  return grouped;
}
