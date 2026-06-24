import type { CalculationResult } from "@/types";
import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  format,
  parseISO,
  eachDayOfInterval,
  isWeekend,
} from "date-fns";

export interface DateDiffInput {
  startDate: string;
  endDate: string;
  includeEndDate: boolean;
  businessDaysOnly: boolean;
  holidays?: string[];
}

function countBusinessDays(
  start: Date,
  end: Date,
  holidays: Set<string>
): number {
  const days = eachDayOfInterval({ start, end });
  return days.filter(
    (d) => !isWeekend(d) && !holidays.has(format(d, "yyyy-MM-dd"))
  ).length;
}

export function calculateDateDifference(input: DateDiffInput): CalculationResult {
  const start = parseISO(input.startDate);
  let end = parseISO(input.endDate);
  if (start > end) throw new Error("Start date must be before end date");

  if (input.includeEndDate) {
    end = new Date(end);
    end.setDate(end.getDate() + 1);
  }

  const totalDays = differenceInDays(end, start);
  const years = differenceInYears(end, start);
  const months = differenceInMonths(end, start);
  const weeks = Math.floor(totalDays / 7);

  const holidaySet = new Set(input.holidays ?? []);
  const businessDays = input.businessDaysOnly
    ? countBusinessDays(start, end, holidaySet)
    : null;

  const ref = new Date(start);
  const y = differenceInYears(end, ref);
  ref.setFullYear(ref.getFullYear() + y);
  const m = differenceInMonths(end, ref);
  ref.setMonth(ref.getMonth() + m);
  const d = differenceInDays(end, ref);

  return {
    headline: `${totalDays} days between dates`,
    summary: {
      "Total Days": totalDays,
      Weeks: weeks,
      "Total Months": months,
      Years: years,
      "Y-M-D": `${y} years, ${m} months, ${d} days`,
      ...(businessDays !== null ? { "Business Days": businessDays } : {}),
    },
    steps: [
      {
        label: "Date range",
        formula: `${format(start, "yyyy-MM-dd")} to ${format(parseISO(input.endDate), "yyyy-MM-dd")}`,
        value: `${totalDays} days`,
      },
    ],
    breakdown: [
      { Unit: "Days", Value: totalDays },
      { Unit: "Weeks", Value: weeks },
      { Unit: "Months", Value: months },
      { Unit: "Years", Value: years },
      ...(businessDays !== null
        ? [{ Unit: "Business Days", Value: businessDays }]
        : []),
    ],
    interpretation: `From ${format(start, "MMM d, yyyy")} to ${format(parseISO(input.endDate), "MMM d, yyyy")} is ${totalDays} days (${y}y ${m}m ${d}d).`,
    assumptions: [
      input.includeEndDate ? "End date is included." : "End date is excluded.",
      input.businessDaysOnly
        ? "Business days exclude weekends and listed holidays."
        : "Calendar days counted.",
    ],
    raw: { totalDays, years: y, months: m, days: d, businessDays },
  };
}
