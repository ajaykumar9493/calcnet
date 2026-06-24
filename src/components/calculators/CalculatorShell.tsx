"use client";

import { useCallback, useEffect, useState } from "react";
import type { CalculationResult } from "@/types";
import { ResultsCard } from "@/components/ui/ResultsCard";
import { DataTable } from "@/components/ui/DataTable";
import { Chart } from "@/components/ui/Chart";
import { ShareWidget } from "@/components/ui/ShareWidget";
import { downloadCsv } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { incrementPopularity } from "@/lib/popularity";
import { trackCalculatorUse } from "@/lib/analytics";

interface CalculatorShellProps {
  slug: string;
  title: string;
  children: React.ReactNode;
  result: CalculationResult | null;
  error: string | null;
  onCalculate: () => void;
  onExportCsv?: () => string[][];
  chartConfig?: {
    xKey: string;
    lines?: Array<{ key: string; color: string; name?: string }>;
    type?: "line" | "area" | "bar";
  };
  autoCalc?: boolean;
}

export function CalculatorShell({
  slug,
  title,
  children,
  result,
  error,
  onCalculate,
  onExportCsv,
  chartConfig,
  autoCalc = false,
}: CalculatorShellProps) {
  const [auto, setAuto] = useState(autoCalc);

  useEffect(() => {
    incrementPopularity(slug);
    trackCalculatorUse(slug);
  }, [slug]);

  useEffect(() => {
    if (auto) onCalculate();
  }, [auto, onCalculate]);

  const handlePrint = () => window.print();

  const handleExport = useCallback(() => {
    if (!onExportCsv || !result) return;
    downloadCsv(`${slug}-results.csv`, onExportCsv());
  }, [onExportCsv, result, slug]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onCalculate();
          }}
          className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900"
        >
          {children}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="submit"
              className="sticky bottom-4 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {t("btn.calculate")}
            </button>
            <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <input
                type="checkbox"
                checked={auto}
                onChange={(e) => setAuto(e.target.checked)}
                className="rounded border-zinc-300"
              />
              Auto-calculate
            </label>
          </div>
        </form>
      </div>

      <div className="space-y-6 print:block">
        {error && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}
        {result && (
          <>
            <ResultsCard headline={result.headline} summary={result.summary}>
              {chartConfig && result.chartData && (
                <Chart
                  data={result.chartData}
                  xKey={chartConfig.xKey}
                  lines={chartConfig.lines}
                  type={chartConfig.type}
                />
              )}
            </ResultsCard>

            <details className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900" open>
              <summary className="cursor-pointer font-semibold">{t("results.steps")}</summary>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
                {result.steps.map((s, i) => (
                  <li key={i}>
                    <strong>{s.label}:</strong> {s.formula} → <em>{s.value}</em>
                  </li>
                ))}
              </ol>
            </details>

            {result.breakdown.length > 0 && (
              <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
                <h3 className="font-semibold">{t("results.breakdown")}</h3>
                <DataTable
                  columns={Object.keys(result.breakdown[0])}
                  rows={result.breakdown}
                />
              </section>
            )}

            <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="font-semibold">{t("results.interpretation")}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{result.interpretation}</p>
              <ul className="mt-2 list-disc pl-5 text-xs text-zinc-500">
                {result.assumptions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </section>

            <div className="no-print flex flex-wrap gap-2">
              {onExportCsv && (
                <button type="button" onClick={handleExport} className="rounded-lg border px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800">
                  {t("btn.exportCsv")}
                </button>
              )}
              <button type="button" onClick={handlePrint} className="rounded-lg border px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800">
                {t("btn.print")}
              </button>
              <ShareWidget title={title} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
