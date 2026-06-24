import type { CalculationResult } from "@/types";
import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  format,
  parseISO,
  addYears,
} from "date-fns";

export interface AgeInput {
  birthDate: string;
  referenceDate?: string;
}

export function calculateAge(input: AgeInput): CalculationResult {
  const birth = parseISO(input.birthDate);
  const reference = input.referenceDate
    ? parseISO(input.referenceDate)
    : new Date();

  if (birth > reference) throw new Error("Birth date cannot be after reference date");

  const years = differenceInYears(reference, birth);
  const afterYears = addYears(birth, years);
  const months = differenceInMonths(reference, afterYears);
  const afterMonths = new Date(afterYears);
  afterMonths.setMonth(afterMonths.getMonth() + months);
  const days = differenceInDays(reference, afterMonths);
  const totalDays = differenceInDays(reference, birth);

  const nextBirthday = addYears(birth, years + (reference >= addYears(birth, years + 1) ? 1 : reference < addYears(birth, years) ? 0 : 1));
  let nextBday = addYears(birth, years);
  if (reference >= nextBday) nextBday = addYears(birth, years + 1);
  const daysToBirthday = differenceInDays(nextBday, reference);

  return {
    headline: `${years} years, ${months} months, ${days} days`,
    summary: {
      Years: years,
      Months: months,
      Days: days,
      "Total Days": totalDays,
      "Next Birthday": format(nextBday, "yyyy-MM-dd"),
      "Days to Birthday": daysToBirthday,
    },
    steps: [
      {
        label: "Birth date",
        formula: "reference - birth",
        value: format(birth, "yyyy-MM-dd"),
      },
      {
        label: "Age breakdown",
        formula: "years, remaining months, remaining days",
        value: `${years}y ${months}m ${days}d`,
      },
    ],
    breakdown: [
      { Unit: "Years", Value: years },
      { Unit: "Months (total)", Value: differenceInMonths(reference, birth) },
      { Unit: "Days (total)", Value: totalDays },
      { Unit: "Weeks (approx)", Value: Math.floor(totalDays / 7) },
    ],
    interpretation: `You are exactly ${years} years, ${months} months, and ${days} days old. Your next birthday is in ${daysToBirthday} days.`,
    assumptions: ["Uses calendar date arithmetic.", "Reference date defaults to today."],
    raw: { years, months, days, totalDays, daysToBirthday },
  };
}
