export type Locale = "en";

export const defaultLocale: Locale = "en";

export const locales: Locale[] = ["en"];

const messages: Record<Locale, Record<string, string>> = {
  en: {
    "site.name": "CalcNet",
    "site.tagline": "Free Online Calculators",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.privacy": "Privacy",
    "nav.allCalculators": "All Calculators",
    "search.placeholder": "Search calculators...",
    "search.hint": "Press / to search",
    "btn.calculate": "Calculate",
    "btn.trySample": "Try Sample Data",
    "btn.exportCsv": "Export CSV",
    "btn.print": "Print / PDF",
    "results.title": "Results",
    "results.steps": "How we calculated this",
    "results.breakdown": "Breakdown",
    "results.interpretation": "What this means",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "cookie.message":
      "We use cookies for analytics to improve our calculators. You can accept or decline.",
    "cookie.accept": "Accept",
    "cookie.decline": "Decline",
  },
};

export function t(key: string, locale: Locale = defaultLocale): string {
  return messages[locale][key] ?? key;
}

export function formatCurrency(
  value: number,
  currency = "USD",
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}
