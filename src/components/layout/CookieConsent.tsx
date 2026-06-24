"use client";

import { useEffect, useState } from "react";
import { getAnalyticsConsent, setAnalyticsConsent } from "@/lib/analytics";
import { t } from "@/lib/i18n";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getAnalyticsConsent() === null) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {t("cookie.message")}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setAnalyticsConsent(false);
              setVisible(false);
            }}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
          >
            {t("cookie.decline")}
          </button>
          <button
            type="button"
            onClick={() => {
              setAnalyticsConsent(true);
              setVisible(false);
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {t("cookie.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
