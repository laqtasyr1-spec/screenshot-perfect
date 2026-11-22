import { describe, expect, it } from "vitest";
import { PLANS, compareRenewal, estimateReturns, getPlanForAmount, type Plan } from "./plans";

describe("plan tiers", () => {
  it("rejects amounts below the $10 minimum", () => {
    expect(getPlanForAmount(9.99)).toBeNull();
  });
  it("puts $10 up to $99.99 in the 7% plan", () => {
    expect(getPlanForAmount(10)?.monthlyRate).toBe(0.07);
    expect(getPlanForAmount(99.99)?.monthlyRate).toBe(0.07);
  });
  it("puts exactly $100 in the 5% plan", () => {
    expect(getPlanForAmount(100)?.monthlyRate).toBe(0.05);
  });
  it("keeps exactly $1000 in the 5% plan", () => {
    expect(getPlanForAmount(1000)?.monthlyRate).toBe(0.05);
  });
  it("puts amounts above $1000 in the 4% plan", () => {
    expect(getPlanForAmount(1000.01)?.monthlyRate).toBe(0.04);
  });
});

describe("return estimate", () => {
  it("computes $500 over 6 months without compounding", () => {
    const r = estimateReturns(500, 6);
    expect(r.monthlyReturn).toBe(25);
    expect(r.totalReturn).toBe(150);
    expect(r.finalValue).toBe(650);
  });
  it("computes $50 at 7% for one month", () => {
    expect(estimateReturns(50, 1).monthlyReturn).toBe(3.5);
  });
  it("computes $2000 at 4% over 12 months", () => {
    const r = estimateReturns(2000, 12);
    expect(r.totalReturn).toBe(960);
    expect(r.finalValue).toBe(2960);
  });
  it("returns zero when the amount is below the minimum", () => {
    expect(estimateReturns(5, 12).totalReturn).toBe(0);
  });
});

describe("compareRenewal", () => {
  it("renewing $500 for 12 months reaches $800 (5% × 12 on principal)", () => {
    const pts = compareRenewal(500, 12);
    expect(pts).toHaveLength(13);
    expect(pts[12]?.withRenewal).toBe(800);
  });
  it("without renewal $500 stops at $525 after the first month", () => {
    const pts = compareRenewal(500, 12);
    expect(pts[1]?.withoutRenewal).toBe(525);
    expect(pts[12]?.withoutRenewal).toBe(525);
  });
  it("returns nothing below the $10 minimum", () => {
    expect(compareRenewal(9, 12)).toEqual([]);
  });
});

describe("custom plan lists (admin edits)", () => {
  const edited: Plan[] = PLANS.map((p) => (p.id === "growth" ? { ...p, monthlyRate: 0.06 } : p));

  it("keeps default results identical when no list is passed", () => {
    expect(getPlanForAmount(500)).toBe(getPlanForAmount(500, PLANS));
    expect(estimateReturns(500, 6)).toEqual(estimateReturns(500, 6, PLANS));
    expect(compareRenewal(500, 12)).toEqual(compareRenewal(500, 12, PLANS));
    expect(estimateReturns(500, 1).monthlyReturn).toBe(25);
  });

  it("uses an edited growth rate of 6% for $500", () => {
    expect(getPlanForAmount(500, edited)?.monthlyRate).toBe(0.06);
    expect(estimateReturns(500, 1, edited).monthlyReturn).toBe(30);
    expect(compareRenewal(500, 12, edited)[12]?.withRenewal).toBe(860);
  });

  it("does not move tier boundaries when rates are edited", () => {
    expect(getPlanForAmount(99.99, edited)?.id).toBe("starter");
    expect(getPlanForAmount(1000, edited)?.id).toBe("growth");
    expect(getPlanForAmount(1000.01, edited)?.id).toBe("capital");
  });
});
