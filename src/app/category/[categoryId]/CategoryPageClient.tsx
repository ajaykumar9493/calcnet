"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { getCategory } from "@/config/categories";
import { getCalculatorsByCategory, sortCalculators } from "@/config/calculators";
import type { SortOption } from "@/types";

function CategoryContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const categoryId = params.categoryId as string;
  const sort = (searchParams.get("sort") as SortOption) || "popular";
  const cat = getCategory(categoryId);

  if (!cat) {
    return <p className="p-8">Category not found.</p>;
  }

  const items = sortCalculators(getCalculatorsByCategory(categoryId), sort);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav className="text-sm text-zinc-500">
        <Link href="/" className="hover:text-blue-600">Home</Link> / {cat.name}
      </nav>
      <h1 className="mt-2 text-3xl font-bold">{cat.name} Calculators</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">{cat.description}</p>

      <div className="mt-6 flex gap-2">
        {(["popular", "new", "alphabetical"] as SortOption[]).map((s) => (
          <Link
            key={s}
            href={`/category/${categoryId}/?sort=${s}`}
            className={`rounded-lg px-3 py-1.5 text-sm capitalize ${sort === s ? "bg-blue-600 text-white" : "border border-zinc-300 dark:border-zinc-600"}`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((calc) => (
          <Link
            key={calc.slug}
            href={`/calculators/${calc.slug}/`}
            className="rounded-xl border border-zinc-200 p-5 hover:border-blue-500 dark:border-zinc-700"
          >
            <h2 className="font-semibold">{calc.name}</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{calc.shortDescription}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {calc.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800">{tag}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function CategoryPageClient() {
  return (
    <Suspense fallback={<div className="p-8 text-zinc-500">Loading...</div>}>
      <CategoryContent />
    </Suspense>
  );
}
