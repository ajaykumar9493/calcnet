import type { Metadata } from "next";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "About",
  description: `About ${t("site.name")} - free online calculators.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">About {t("site.name")}</h1>
      <div className="prose prose-zinc mt-6 dark:prose-invert">
        <p>
          {t("site.name")} provides free, accurate online calculators for finance,
          health, dates, and unit conversions. Every calculator shows step-by-step
          math, breakdown tables, and plain-language explanations.
        </p>
        <p>
          Our mission is to make complex calculations accessible to everyone —
          with privacy-first design, no account required, and transparent formulas.
        </p>
      </div>
    </div>
  );
}
