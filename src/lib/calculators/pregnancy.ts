import type { CalculationResult } from "@/types";
import { addDays, differenceInDays, format, parseISO } from "date-fns";

export type PregnancyInputMethod = "lmp" | "conception" | "ultrasound";

export interface PregnancyInput {
  method: PregnancyInputMethod;
  date: string;
  cycleLength?: number;
  gestationalWeeks?: number;
  gestationalDays?: number;
}

const milestones = [
  { week: 4, title: "Missed period", description: "Pregnancy test may be positive" },
  { week: 8, title: "First prenatal visit", description: "Confirm pregnancy with provider" },
  { week: 12, title: "End of 1st trimester", description: "Risk of miscarriage decreases" },
  { week: 20, title: "Anatomy scan", description: "Mid-pregnancy ultrasound" },
  { week: 28, title: "Third trimester", description: "Baby grows rapidly" },
  { week: 37, title: "Early term", description: "Baby is considered early term" },
  { week: 40, title: "Due date", description: "Estimated delivery date" },
];

export function calculatePregnancyDueDate(input: PregnancyInput): CalculationResult {
  const cycleLength = input.cycleLength ?? 28;
  const baseDate = parseISO(input.date);

  let lmpDate: Date;
  if (input.method === "lmp") {
    lmpDate = baseDate;
  } else if (input.method === "conception") {
    lmpDate = addDays(baseDate, -14);
  } else {
    const gestDays = (input.gestationalWeeks ?? 0) * 7 + (input.gestationalDays ?? 0);
    lmpDate = addDays(baseDate, -gestDays);
  }

  // Naegele's rule with cycle adjustment
  const cycleAdjustment = cycleLength - 28;
  const dueDate = addDays(lmpDate, 280 + cycleAdjustment);
  const today = new Date();
  const gestationalDays = differenceInDays(today, lmpDate);
  const gestWeeks = Math.floor(gestationalDays / 7);
  const gestDaysRemainder = gestationalDays % 7;
  const daysUntilDue = differenceInDays(dueDate, today);

  let trimester = "First";
  if (gestWeeks >= 28) trimester = "Third";
  else if (gestWeeks >= 13) trimester = "Second";

  return {
    headline: `Due date: ${format(dueDate, "MMMM d, yyyy")}`,
    summary: {
      "Due Date": format(dueDate, "yyyy-MM-dd"),
      "LMP Date": format(lmpDate, "yyyy-MM-dd"),
      "Gestational Age": `${gestWeeks} weeks, ${gestDaysRemainder} days`,
      Trimester: trimester,
      "Days Until Due": daysUntilDue,
    },
    steps: [
      {
        label: "Naegele's rule",
        formula: "Due date = LMP + 280 days (+ cycle adjustment)",
        value: format(dueDate, "yyyy-MM-dd"),
      },
      {
        label: "Cycle adjustment",
        formula: `280 + (${cycleLength} - 28) days`,
        value: `${280 + cycleAdjustment} days from LMP`,
      },
    ],
    breakdown: milestones.map((m) => ({
      Week: m.week,
      Milestone: m.title,
      Date: format(addDays(lmpDate, m.week * 7), "yyyy-MM-dd"),
      Description: m.description,
    })),
    interpretation:
      daysUntilDue > 0
        ? `You are ${gestWeeks} weeks pregnant. Approximately ${daysUntilDue} days until your due date.`
        : `Your due date has passed by ${Math.abs(daysUntilDue)} days. Consult your provider.`,
    assumptions: [
      "Based on Naegele's rule (280 days from LMP).",
      "Only ~5% of babies arrive on the exact due date.",
      "Ultrasound dating is more accurate in early pregnancy.",
    ],
    raw: { dueDate, lmpDate, gestWeeks, gestDaysRemainder, daysUntilDue },
  };
}
