import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How Calculations Work",
  description: "Learn how CalcNet calculators derive results with transparent formulas.",
};

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">How Calculations Work</h1>
      <div className="mt-6 space-y-6 text-zinc-600 dark:text-zinc-400">
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Transparent Formulas</h2>
          <p className="mt-2">
            Every calculator shows the exact formula used, step-by-step derivation,
            and intermediate values so you can verify the math yourself.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Client-Side Processing</h2>
          <p className="mt-2">
            Calculations run in your browser for speed and privacy. No personal
            financial or health data is sent to our servers.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Shareable URLs</h2>
          <p className="mt-2">
            Input values are encoded in the URL query string so you can bookmark
            or share exact calculation scenarios.
          </p>
        </section>
        <p>
          Try the <Link href="/calculators/emi-loan" className="text-blue-600 hover:underline">EMI Calculator</Link> or{" "}
          <Link href="/calculators/bmi" className="text-blue-600 hover:underline">BMI Calculator</Link> to see it in action.
        </p>
      </div>
    </div>
  );
}
