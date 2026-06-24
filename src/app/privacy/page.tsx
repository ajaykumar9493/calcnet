import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "CalcNet privacy policy and cookie usage.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <div className="prose prose-zinc mt-6 space-y-4 dark:prose-invert">
        <p><strong>Last updated:</strong> June 2026</p>
        <h2 className="text-xl font-semibold">Data Collection</h2>
        <p>
          CalcNet performs calculations in your browser. We do not collect personal
          data unless you consent to analytics cookies.
        </p>
        <h2 className="text-xl font-semibold">Analytics</h2>
        <p>
          With your consent, we may use Google Analytics or Plausible to understand
          usage patterns. Analytics data is anonymized.
        </p>
        <h2 className="text-xl font-semibold">Local Storage</h2>
        <p>
          We store theme preference, calculator popularity counts, and conversion
          history locally in your browser.
        </p>
        <h2 className="text-xl font-semibold">Contact</h2>
        <p>For privacy inquiries, contact support@calcnet.example.</p>
      </div>
    </div>
  );
}
