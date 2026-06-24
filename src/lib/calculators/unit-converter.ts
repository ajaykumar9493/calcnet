import type { CalculationResult } from "@/types";
import { formatNumber, round } from "@/lib/utils";

export type UnitCategory =
  | "length"
  | "weight"
  | "temperature"
  | "speed"
  | "volume"
  | "area"
  | "time"
  | "data"
  | "energy"
  | "pressure";

interface UnitDef {
  id: string;
  name: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

function linearUnit(factor: number): Pick<UnitDef, "toBase" | "fromBase"> {
  return {
    toBase: (v) => v * factor,
    fromBase: (v) => v / factor,
  };
}

const lengthUnits: Record<string, UnitDef> = {
  mm: { id: "mm", name: "Millimeters", ...linearUnit(0.001) },
  cm: { id: "cm", name: "Centimeters", ...linearUnit(0.01) },
  m: { id: "m", name: "Meters", ...linearUnit(1) },
  km: { id: "km", name: "Kilometers", ...linearUnit(1000) },
  inch: { id: "inch", name: "Inches", ...linearUnit(0.0254) },
  ft: { id: "ft", name: "Feet", ...linearUnit(0.3048) },
  yard: { id: "yard", name: "Yards", ...linearUnit(0.9144) },
  mile: { id: "mile", name: "Miles", ...linearUnit(1609.344) },
};

const weightUnits: Record<string, UnitDef> = {
  mg: { id: "mg", name: "Milligrams", ...linearUnit(0.000001) },
  g: { id: "g", name: "Grams", ...linearUnit(0.001) },
  kg: { id: "kg", name: "Kilograms", ...linearUnit(1) },
  tonne: { id: "tonne", name: "Metric Tons", ...linearUnit(1000) },
  oz: { id: "oz", name: "Ounces", ...linearUnit(0.028349523125) },
  lb: { id: "lb", name: "Pounds", ...linearUnit(0.45359237) },
};

const temperatureUnits: Record<string, UnitDef> = {
  C: {
    id: "C",
    name: "Celsius",
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  F: {
    id: "F",
    name: "Fahrenheit",
    toBase: (v) => (v - 32) * (5 / 9),
    fromBase: (v) => v * (9 / 5) + 32,
  },
  K: {
    id: "K",
    name: "Kelvin",
    toBase: (v) => v - 273.15,
    fromBase: (v) => v + 273.15,
  },
};

const speedUnits: Record<string, UnitDef> = {
  "m/s": { id: "m/s", name: "Meters/second", ...linearUnit(1) },
  "km/h": { id: "km/h", name: "Kilometers/hour", ...linearUnit(1 / 3.6) },
  mph: { id: "mph", name: "Miles/hour", ...linearUnit(0.44704) },
  knot: { id: "knot", name: "Knots", ...linearUnit(0.514444) },
};

const volumeUnits: Record<string, UnitDef> = {
  ml: { id: "ml", name: "Milliliters", ...linearUnit(0.000001) },
  l: { id: "l", name: "Liters", ...linearUnit(0.001) },
  "fl-oz": { id: "fl-oz", name: "Fluid Ounces", ...linearUnit(0.0000295735) },
  cup: { id: "cup", name: "Cups", ...linearUnit(0.000236588) },
  gallon: { id: "gallon", name: "Gallons (US)", ...linearUnit(0.00378541) },
};

const areaUnits: Record<string, UnitDef> = {
  "m2": { id: "m2", name: "Square Meters", ...linearUnit(1) },
  "km2": { id: "km2", name: "Square Kilometers", ...linearUnit(1e6) },
  acre: { id: "acre", name: "Acres", ...linearUnit(4046.86) },
  "ft2": { id: "ft2", name: "Square Feet", ...linearUnit(0.092903) },
};

const timeUnits: Record<string, UnitDef> = {
  sec: { id: "sec", name: "Seconds", ...linearUnit(1) },
  min: { id: "min", name: "Minutes", ...linearUnit(60) },
  hr: { id: "hr", name: "Hours", ...linearUnit(3600) },
  day: { id: "day", name: "Days", ...linearUnit(86400) },
};

const dataUnits: Record<string, UnitDef> = {
  B: { id: "B", name: "Bytes", ...linearUnit(1) },
  KB: { id: "KB", name: "Kilobytes", ...linearUnit(1024) },
  MB: { id: "MB", name: "Megabytes", ...linearUnit(1048576) },
  GB: { id: "GB", name: "Gigabytes", ...linearUnit(1073741824) },
  TB: { id: "TB", name: "Terabytes", ...linearUnit(1099511627776) },
};

const energyUnits: Record<string, UnitDef> = {
  J: { id: "J", name: "Joules", ...linearUnit(1) },
  kJ: { id: "kJ", name: "Kilojoules", ...linearUnit(1000) },
  cal: { id: "cal", name: "Calories", ...linearUnit(4.184) },
  kcal: { id: "kcal", name: "Kilocalories", ...linearUnit(4184) },
};

const pressureUnits: Record<string, UnitDef> = {
  Pa: { id: "Pa", name: "Pascals", ...linearUnit(1) },
  kPa: { id: "kPa", name: "Kilopascals", ...linearUnit(1000) },
  bar: { id: "bar", name: "Bar", ...linearUnit(100000) },
  psi: { id: "psi", name: "PSI", ...linearUnit(6894.76) },
  atm: { id: "atm", name: "Atmospheres", ...linearUnit(101325) },
};

export const unitCategories: Record<
  UnitCategory,
  { name: string; units: Record<string, UnitDef> }
> = {
  length: { name: "Length", units: lengthUnits },
  weight: { name: "Weight/Mass", units: weightUnits },
  temperature: { name: "Temperature", units: temperatureUnits },
  speed: { name: "Speed", units: speedUnits },
  volume: { name: "Volume", units: volumeUnits },
  area: { name: "Area", units: areaUnits },
  time: { name: "Time", units: timeUnits },
  data: { name: "Data", units: dataUnits },
  energy: { name: "Energy", units: energyUnits },
  pressure: { name: "Pressure", units: pressureUnits },
};

export interface UnitConvertInput {
  value: number;
  category: UnitCategory;
  fromUnit: string;
  toUnit: string;
  precision?: number;
}

export function convertUnit(input: UnitConvertInput): number {
  const cat = unitCategories[input.category];
  const from = cat.units[input.fromUnit];
  const to = cat.units[input.toUnit];
  if (!from || !to) throw new Error("Invalid unit");
  const base = from.toBase(input.value);
  return to.fromBase(base);
}

export function batchConvert(
  value: number,
  category: UnitCategory,
  fromUnit: string,
  precision = 4
): Array<{ unit: string; name: string; value: number }> {
  const cat = unitCategories[category];
  return Object.values(cat.units).map((u) => ({
    unit: u.id,
    name: u.name,
    value: round(convertUnit({ value, category, fromUnit, toUnit: u.id }), precision),
  }));
}

export function calculateUnitConversion(input: UnitConvertInput): CalculationResult {
  const precision = input.precision ?? 4;
  const result = convertUnit(input);
  const batch = batchConvert(input.value, input.category, input.fromUnit, precision);
  const fromName = unitCategories[input.category].units[input.fromUnit].name;
  const toName = unitCategories[input.category].units[input.toUnit].name;

  return {
    headline: `${formatNumber(input.value, precision)} ${input.fromUnit} = ${formatNumber(result, precision)} ${input.toUnit}`,
    summary: {
      Input: `${input.value} ${input.fromUnit}`,
      Result: round(result, precision),
      Category: unitCategories[input.category].name,
    },
    steps: [
      {
        label: "Convert to base unit",
        formula: `${input.value} ${fromName} → base`,
        value: formatNumber(
          unitCategories[input.category].units[input.fromUnit].toBase(input.value),
          precision
        ),
      },
      {
        label: "Convert to target",
        formula: `base → ${toName}`,
        value: formatNumber(result, precision),
      },
    ],
    breakdown: batch.map((b) => ({
      Unit: b.unit,
      Name: b.name,
      Value: b.value,
    })),
    interpretation: `${input.value} ${input.fromUnit} equals ${formatNumber(result, precision)} ${input.toUnit}.`,
    assumptions: ["Uses standard conversion factors.", "Temperature uses exact formulas."],
    raw: { result, batch },
  };
}

export function getUnitsForCategory(category: UnitCategory) {
  return Object.values(unitCategories[category].units);
}
