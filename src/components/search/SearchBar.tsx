"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { searchCalculators } from "@/lib/search";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const results = query.trim() ? searchCalculators(query, 5) : [];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const goToSearch = useCallback(() => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  }, [query, router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (activeIndex >= 0 && results[activeIndex]) {
        router.push(`/calculators/${results[activeIndex].slug}`);
        setOpen(false);
      } else {
        goToSearch();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <label htmlFor="global-search" className="sr-only">
        {t("search.placeholder")}
      </label>
      <input
        ref={inputRef}
        id="global-search"
        type="search"
        role="combobox"
        aria-expanded={open && results.length > 0}
        aria-controls="search-suggestions"
        aria-autocomplete="list"
        placeholder={t("search.placeholder")}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        onKeyDown={handleKeyDown}
        className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
      />
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
        🔍
      </span>
      <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-zinc-300 px-1.5 text-xs text-zinc-400 sm:inline dark:border-zinc-600">
        /
      </span>

      {open && results.length > 0 && (
        <ul
          id="search-suggestions"
          role="listbox"
          className="absolute top-full z-50 mt-1 w-full rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
        >
          {results.map((r, i) => (
            <li key={r.slug} role="option" aria-selected={i === activeIndex}>
              <Link
                href={`/calculators/${r.slug}`}
                className={cn(
                  "block px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800",
                  i === activeIndex && "bg-zinc-50 dark:bg-zinc-800"
                )}
                onClick={() => setOpen(false)}
              >
                <span className="font-medium">{r.name}</span>
                <span className="ml-2 text-xs text-zinc-500">{r.categoryName}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={goToSearch}
              className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              See all results for &quot;{query}&quot;
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
