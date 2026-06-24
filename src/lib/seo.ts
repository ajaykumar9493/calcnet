import type { CalculatorMeta } from "@/types";

export function generateCalculatorJsonLd(
  calculator: CalculatorMeta,
  baseUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: calculator.name,
    description: calculator.description,
    url: `${baseUrl}/calculators/${calculator.slug}`,
    applicationCategory: "CalculatorApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    keywords: calculator.tags.join(", "),
  };
}

export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
