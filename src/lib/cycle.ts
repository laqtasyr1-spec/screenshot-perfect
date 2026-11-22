/** Date helpers for a single investment cycle (start → maturity). Pure UI timing, no return math. */
const DAY = 86_400_000;

export interface CycleProgress {
  totalDays: number;
  elapsedDays: number;
  remainingDays: number;
  /** 0–1 */
  ratio: number;
}

export function cycleProgress(startISO: string, maturityISO: string, now: Date): CycleProgress {
  const start = Date.parse(startISO);
  const end = Date.parse(maturityISO);
  const totalDays = Math.max(1, Math.round((end - start) / DAY));
  const elapsed = Math.floor((now.getTime() - start) / DAY);
  const elapsedDays = Math.min(Math.max(elapsed, 0), totalDays);
  return {
    totalDays,
    elapsedDays,
    remainingDays: totalDays - elapsedDays,
    ratio: elapsedDays / totalDays,
  };
}
