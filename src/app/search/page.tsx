"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { searchCalculators, groupSearchResults } from "@/lib/search";

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const results = q.trim() ? searchCalculators(q, 50) : [];
  const grouped = groupSearchResults(results);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold">Search Results</h1>
      {q ? (
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{q}&quot;
        </p>
      ) : (
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">Enter a search term using the search bar above.</p>
      )}

      {results.length === 0 && q && (
        <p className="mt-8 text-zinc-500">No calculators found. Try different keywords.</p>
      )}

      <div className="mt-8 space-y-8">
        {Object.entries(grouped).map(([category, items]) => (
          <section key={category}>
            <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">{category}</h2>
            <ul className="mt-3 divide-y divide-zinc-200 dark:divide-zinc-700">
              {items.map((item) => (
                <li key={item.slug}>
                  <Link href={`/calculators/${item.slug}/`} className="block py-3 hover:text-blue-600">
                    <span className="font-medium">{item.name}</span>
                    <p className="text-sm text-zinc-500">{item.shortDescription}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-zinc-500">Loading search...</div>}>
      <SearchResults />
    </Suspense>
  );
}
