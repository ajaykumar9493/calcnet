import type { CalculationResult } from "@/types";
import { differenceInSeconds, parseISO } from "date-fns";

export interface CountdownInput {
  targetDate: string;
  targetTime?: string;
  timezone?: string;
}

export function getCountdownParts(target: Date, now = new Date()) {
  const totalSeconds = Math.max(0, differenceInSeconds(target, now));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, totalSeconds, isPast: target < now };
}

export function calculateCountdown(input: CountdownInput): CalculationResult {
  const timePart = input.targetTime ?? "00:00";
  const target = parseISO(`${input.targetDate}T${timePart}:00`);
  const parts = getCountdownParts(target);

  return {
    headline: parts.isPast
      ? "Countdown complete!"
      : `${parts.days}d ${parts.hours}h ${parts.minutes}m ${parts.seconds}s`,
    summary: {
      Days: parts.days,
      Hours: parts.hours,
      Minutes: parts.minutes,
      Seconds: parts.seconds,
      "Total Seconds": parts.totalSeconds,
    },
    steps: [
      {
        label: "Target",
        formula: "target datetime - now",
        value: target.toISOString(),
      },
    ],
    breakdown: [
      { Unit: "Days", Value: parts.days },
      { Unit: "Hours", Value: parts.hours },
      { Unit: "Minutes", Value: parts.minutes },
      { Unit: "Seconds", Value: parts.seconds },
    ],
    interpretation: parts.isPast
      ? "The target date has passed."
      : `Counting down to ${input.targetDate} ${timePart}.`,
    assumptions: ["Uses local browser timezone unless specified."],
    raw: { target: target.toISOString(), ...parts },
  };
}

export function getEmbedCode(targetDate: string, targetTime: string): string {
  const params = new URLSearchParams({ d: targetDate, t: targetTime });
  return `<iframe src="/embed/countdown?${params}" width="300" height="80" frameborder="0" title="Countdown"></iframe>`;
}
