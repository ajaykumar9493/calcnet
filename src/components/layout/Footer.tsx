import Link from "next/link";
import { categories } from "@/config/categories";
import { calculators } from "@/config/calculators";
import { t } from "@/lib/i18n";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {t("site.name")}
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Free online calculators for finance, health, dates, and unit
              conversions. Accurate formulas, clear explanations, and
              privacy-first design.
            </p>
          </div>
          {categories.map((cat) => (
            <div key={cat.id}>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                {cat.name}
              </h3>
              <ul className="mt-2 space-y-1">
                {calculators
                  .filter((c) => c.category === cat.id)
                  .slice(0, 5)
                  .map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/calculators/${c.slug}`}
                        className="text-sm text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 text-sm text-zinc-500 dark:border-zinc-800 sm:flex-row">
          <p>© {new Date().getFullYear()} {t("site.name")}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-blue-600">Privacy</Link>
            <Link href="/how-it-works" className="hover:text-blue-600">How It Works</Link>
            <Link href="/contact" className="hover:text-blue-600">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
