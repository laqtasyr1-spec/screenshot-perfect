import { describe, expect, it } from "vitest";
import { cycleProgress } from "./cycle";

describe("cycleProgress", () => {
  it("is halfway on day 15 of a 30-day cycle", () => {
    const p = cycleProgress("2026-11-01", "2026-12-01", new Date("2026-11-16T12:00:00Z"));
    expect(p.totalDays).toBe(30);
    expect(p.elapsedDays).toBe(15);
    expect(p.remainingDays).toBe(15);
  });
  it("never goes past maturity", () => {
    const p = cycleProgress("2026-11-01", "2026-12-01", new Date("2027-02-01"));
    expect(p.ratio).toBe(1);
    expect(p.remainingDays).toBe(0);
  });
});
