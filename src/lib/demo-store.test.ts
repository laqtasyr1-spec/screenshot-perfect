import { describe, expect, it } from "vitest";
import { demoActions, getDemoState } from "./demo-store";

describe("demo store investment requests", () => {
  it("records $500 at the default 5% as a $25 estimated return", () => {
    const res = demoActions.requestInvestment(500);
    const inv = getDemoState().investments.find((i) => i.id === res?.id);
    expect(inv?.estimatedReturn).toBe(25);
  });

  it("uses the admin-edited rate: growth at 6% gives $30 on $500", () => {
    demoActions.updatePlan("growth", { monthlyRate: 0.06 });
    const res = demoActions.requestInvestment(500);
    const inv = getDemoState().investments.find((i) => i.id === res?.id);
    expect(inv?.estimatedReturn).toBe(30);
  });
});
