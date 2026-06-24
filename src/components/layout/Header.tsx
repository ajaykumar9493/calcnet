"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { SearchBar } from "@/components/search/SearchBar";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100"
          aria-label={`${t("site.name")} home`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            C
          </span>
          <span className="hidden sm:inline">{t("site.name")}</span>
        </Link>

        <div className="flex flex-1 justify-center px-2">
          <SearchBar />
        </div>

        <nav className="flex shrink-0 items-center gap-1 sm:gap-2" aria-label="Main">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          {[
            { href: "/about", label: t("nav.about") },
            { href: "/contact", label: t("nav.contact") },
            { href: "/privacy", label: t("nav.privacy") },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "hidden rounded-lg px-3 py-2 text-sm font-medium hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 md:inline-block",
                pathname === link.href
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-zinc-600 dark:text-zinc-400"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
