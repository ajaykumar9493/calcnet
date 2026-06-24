interface ResultsCardProps {
  headline: string;
  summary: Record<string, string | number>;
  children?: React.ReactNode;
}

export function ResultsCard({ headline, summary, children }: ResultsCardProps) {
  return (
    <section
      aria-live="polite"
      aria-atomic="true"
      className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
    >
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{headline}</h2>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {Object.entries(summary).map(([key, val]) => (
          <div key={key} className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{key}</dt>
            <dd className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{val}</dd>
          </div>
        ))}
      </dl>
      {children}
    </section>
  );
}
