import Link from "next/link";
import { calculators, featuredSlugs, sortCalculators } from "@/config/calculators";
import { categories } from "@/config/categories";
import { t } from "@/lib/i18n";

export default function HomePage() {
  const popular = sortCalculators(
    calculators.filter((c) => featuredSlugs.includes(c.slug)),
    "popular"
  );
  const latest = sortCalculators(calculators, "new").slice(0, 6);

  return (
    <div>
      <section className="bg-gradient-to-b from-blue-50 to-white px-4 py-16 dark:from-zinc-900 dark:to-zinc-950 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
            {t("site.name")}
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            {t("site.tagline")} — accurate formulas, clear explanations, and
            privacy-first design.
          </p>
          <Link
            href="/category/financial"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            {t("nav.allCalculators")}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-bold">Popular Calculators</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((calc) => (
            <Link
              key={calc.slug}
              href={`/calculators/${calc.slug}`}
              className="rounded-xl border border-zinc-200 p-5 transition hover:border-blue-500 hover:shadow-md dark:border-zinc-700 dark:hover:border-blue-500"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{calc.name}</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{calc.shortDescription}</p>
              {calc.sampleResult && (
                <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">{calc.sampleResult}</p>
              )}
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-zinc-50 px-4 py-12 dark:bg-zinc-900 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold">Categories</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="rounded-xl border border-zinc-200 bg-white p-5 hover:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
              >
                <h3 className="font-semibold">{cat.name}</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-bold">Latest Calculators</h2>
        <ul className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-700">
          {latest.map((calc) => (
            <li key={calc.slug}>
              <Link href={`/calculators/${calc.slug}`} className="flex items-center justify-between py-3 hover:text-blue-600">
                <span>{calc.name}</span>
                <span className="text-sm text-zinc-500">{calc.addedAt}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
