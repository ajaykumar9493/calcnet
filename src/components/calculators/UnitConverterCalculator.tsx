"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CalculatorShell } from "./CalculatorShell";
import { NumberInput } from "@/components/ui/NumberInput";
import { UnitSelect } from "@/components/ui/UnitSelect";
import { PresetButtons } from "@/components/ui/PresetButtons";
import {
  calculateUnitConversion,
  unitCategories,
  type UnitCategory,
  getUnitsForCategory,
} from "@/lib/calculators/unit-converter";
import { encodeParams } from "@/lib/utils";
import type { CalculationResult } from "@/types";

const HISTORY_KEY = "calcnet-conversion-history";

export function UnitConverterCalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [category, setCategory] = useState<UnitCategory>((searchParams.get("category") as UnitCategory) || "length");
  const units = getUnitsForCategory(category);
  const [value, setValue] = useState(Number(searchParams.get("value")) || 10);
  const [fromUnit, setFromUnit] = useState(searchParams.get("fromUnit") || "mile");
  const [toUnit, setToUnit] = useState(searchParams.get("toUnit") || "km");
  const [precision, setPrecision] = useState(Number(searchParams.get("precision")) || 4);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const calculate = useCallback(() => {
    try {
      setError(null);
      const res = calculateUnitConversion({ value, category, fromUnit, toUnit, precision });
      setResult(res);
      const entry = `${value} ${fromUnit} → ${res.raw ? (res.raw as { result: number }).result : ""} ${toUnit}`;
      const newHistory = [entry, ...history.filter((h) => h !== entry)].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      router.replace(`?${encodeParams({ value, category, fromUnit, toUnit, precision })}`, { scroll: false });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }, [value, category, fromUnit, toUnit, precision, history, router]);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const unitOptions = units.map((u) => ({ value: u.id, label: u.name }));

  return (
    <CalculatorShell slug="unit-converter" title="Unit Converter" result={result} error={error} onCalculate={calculate}>
      <PresetButtons presets={[{ label: "10 miles → km", values: { value: 10, category: "length", fromUnit: "mile", toUnit: "km" } }]}
        onSelect={(v) => {
          setValue(Number(v.value));
          setCategory(v.category as UnitCategory);
          setFromUnit(String(v.fromUnit));
          setToUnit(String(v.toUnit));
        }} />
      <UnitSelect label="Category" value={category} onChange={(v) => {
        const cat = v as UnitCategory;
        setCategory(cat);
        const catUnits = getUnitsForCategory(cat);
        setFromUnit(catUnits[0].id);
        setToUnit(catUnits[1]?.id ?? catUnits[0].id);
      }} options={Object.entries(unitCategories).map(([k, v]) => ({ value: k, label: v.name }))} />
      <NumberInput label="Value" value={value} onChange={setValue} />
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
        <UnitSelect label="From" value={fromUnit} onChange={setFromUnit} options={unitOptions} />
        <button type="button" onClick={swapUnits} className="mb-1 rounded-lg border px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800" aria-label="Swap units">⇄</button>
        <UnitSelect label="To" value={toUnit} onChange={setToUnit} options={unitOptions} />
      </div>
      <UnitSelect label="Precision" value={String(precision)} onChange={(v) => setPrecision(Number(v))}
        options={[2, 3, 4, 6, 8].map((p) => ({ value: String(p), label: `${p} decimals` }))} />
      {history.length > 0 && (
        <div>
          <h4 className="text-sm font-medium">Conversion History</h4>
          <ul className="mt-1 space-y-1 text-xs text-zinc-500">
            {history.map((h, i) => <li key={i}>{h}</li>)}
          </ul>
        </div>
      )}
    </CalculatorShell>
  );
}
