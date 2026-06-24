"use client";

import { useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CalculatorShell } from "./CalculatorShell";
import { InputField } from "@/components/ui/InputField";
import { calculateAge } from "@/lib/calculators/age";
import { encodeParams } from "@/lib/utils";
import { format } from "date-fns";
import type { CalculationResult } from "@/types";

export function AgeCalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [birthDate, setBirthDate] = useState(searchParams.get("birthDate") || "1990-06-15");
  const [referenceDate, setReferenceDate] = useState(searchParams.get("referenceDate") || format(new Date(), "yyyy-MM-dd"));
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(() => {
    try {
      setError(null);
      const res = calculateAge({ birthDate, referenceDate });
      setResult(res);
      router.replace(`?${encodeParams({ birthDate, referenceDate })}`, { scroll: false });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }, [birthDate, referenceDate, router]);

  return (
    <CalculatorShell slug="age" title="Age Calculator" result={result} error={error} onCalculate={calculate}>
      <InputField label="Birth Date" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
      <InputField label="Reference Date" type="date" value={referenceDate} onChange={(e) => setReferenceDate(e.target.value)} hint="Defaults to today" />
    </CalculatorShell>
  );
}
