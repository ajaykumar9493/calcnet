import type { PopularityEntry } from "@/types";

const STORAGE_KEY = "calcnet-popularity";

const defaultPopularity: Record<string, number> = {
  "emi-loan": 100,
  bmi: 98,
  sip: 90,
  "unit-converter": 92,
  mortgage: 95,
  age: 88,
};

export function getLocalPopularity(): Record<string, number> {
  if (typeof window === "undefined") return defaultPopularity;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const entries: PopularityEntry[] = JSON.parse(stored);
      return Object.fromEntries(entries.map((e) => [e.slug, e.views]));
    }
  } catch {
    /* ignore */
  }
  return { ...defaultPopularity };
}

export function incrementLocalPopularity(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const entries: PopularityEntry[] = stored ? JSON.parse(stored) : [];
    const existing = entries.find((e) => e.slug === slug);
    if (existing) {
      existing.views += 1;
      existing.lastViewed = new Date().toISOString();
    } else {
      entries.push({
        slug,
        views: (defaultPopularity[slug] ?? 0) + 1,
        lastViewed: new Date().toISOString(),
      });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* ignore */
  }
}

export async function incrementPopularity(slug: string): Promise<void> {
  incrementLocalPopularity(slug);
  try {
    await fetch("/api/popularity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
  } catch {
    /* fallback to local only */
  }
}

export async function fetchPopularity(): Promise<Record<string, number>> {
  try {
    const res = await fetch("/api/popularity");
    if (res.ok) {
      const data = await res.json();
      return data.counts ?? getLocalPopularity();
    }
  } catch {
    /* ignore */
  }
  return getLocalPopularity();
}
