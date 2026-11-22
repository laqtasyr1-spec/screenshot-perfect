/**
 * Tiny in-memory store for the interactive prototype. State lives only in the browser
 * tab and resets on reload — no real money moves anywhere.
 */
import { useSyncExternalStore } from "react";
import {
  ADMIN_DEPOSIT_REQUESTS,
  ADMIN_INVESTMENT_REQUESTS,
  ADMIN_USERS,
  ADMIN_WITHDRAWALS,
  DEMO_AVAILABLE_BALANCE,
  DEMO_INVESTMENTS,
  DEMO_INVESTOR,
  DEMO_TRANSACTIONS,
  DEMO_WITHDRAWALS,
  type AdminUser,
  type DepositRequest,
  type Investment,
  type InvestmentRequest,
  type Transaction,
  type UserStatus,
  type Withdrawal,
  type WithdrawalStatus,
} from "./demo-data";
import { PLANS, estimateReturns, getPlanForAmount, type Plan, type PlanId } from "./plans";
import { addMonthsISO } from "./format";

export interface DemoState {
  investor: typeof DEMO_INVESTOR;
  investments: Investment[];
  transactions: Transaction[];
  withdrawals: Withdrawal[];
  availableBalance: number;
  users: AdminUser[];
  investmentRequests: InvestmentRequest[];
  depositRequests: DepositRequest[];
  adminWithdrawals: Withdrawal[];
  plans: Plan[];
}

const initialState: DemoState = {
  investor: DEMO_INVESTOR,
  investments: DEMO_INVESTMENTS,
  transactions: DEMO_TRANSACTIONS,
  withdrawals: DEMO_WITHDRAWALS,
  availableBalance: DEMO_AVAILABLE_BALANCE,
  users: ADMIN_USERS,
  investmentRequests: ADMIN_INVESTMENT_REQUESTS,
  depositRequests: ADMIN_DEPOSIT_REQUESTS,
  adminWithdrawals: ADMIN_WITHDRAWALS,
  plans: PLANS,
};

let state = initialState;
const listeners = new Set<() => void>();

function setState(updater: (s: DemoState) => DemoState) {
  state = updater(state);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Current snapshot, for non-React callers and tests. */
export function getDemoState(): DemoState {
  return state;
}

export function useDemoStore<T>(selector: (s: DemoState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(initialState),
  );
}

const today = () => new Date().toISOString().slice(0, 10);
let counter = 1000;
const nextId = (prefix: string) => `${prefix}-${++counter}`;

export const demoActions = {
  requestWithdrawal(amount: number, method: string) {
    const id = nextId("WD");
    const txId = nextId("TX");
    setState((s) => ({
      ...s,
      availableBalance: Math.round((s.availableBalance - amount) * 100) / 100,
      withdrawals: [{ id, amount, method, date: today(), status: "pending" }, ...s.withdrawals],
      transactions: [
        {
          id: txId,
          type: "withdrawal",
          amount,
          date: today(),
          status: "pending",
          note: "طلب سحب قيد المراجعة",
        },
        ...s.transactions,
      ],
    }));
    return { id, txId };
  },

  /** Undo a just-submitted withdrawal request (still pending). */
  cancelWithdrawal(id: string, txId: string) {
    setState((s) => {
      const w = s.withdrawals.find((x) => x.id === id);
      if (!w || w.status !== "pending") return s;
      return {
        ...s,
        availableBalance: Math.round((s.availableBalance + w.amount) * 100) / 100,
        withdrawals: s.withdrawals.filter((x) => x.id !== id),
        transactions: s.transactions.filter((t) => t.id !== txId),
      };
    });
  },

  /** Undo a just-submitted investment request (still pending). */
  cancelInvestment(id: string, reqId: string) {
    setState((s) => {
      const inv = s.investments.find((x) => x.id === id);
      if (!inv || inv.status !== "pending") return s;
      return {
        ...s,
        investments: s.investments.filter((x) => x.id !== id),
        investmentRequests: s.investmentRequests.filter((r) => r.id !== reqId),
      };
    });
  },

  requestInvestment(amount: number) {
    const plan = getPlanForAmount(amount, state.plans);
    if (!plan) return null;
    const id = nextId("INV");
    const reqId = nextId("REQ");
    const start = today();
    setState((s) => ({
      ...s,
      investments: [
        {
          id,
          planId: plan.id,
          amount,
          startDate: start,
          maturityDate: addMonthsISO(start, 1),
          estimatedReturn: estimateReturns(amount, 1, s.plans).monthlyReturn,
          status: "pending",
        },
        ...s.investments,
      ],
      investmentRequests: [
        {
          id: reqId,
          user: s.investor.name,
          planId: plan.id,
          amount,
          date: start,
          status: "pending",
        },
        ...s.investmentRequests,
      ],
    }));
    return { id, reqId };
  },

  updateProfile(patch: Partial<typeof DEMO_INVESTOR>) {
    setState((s) => ({ ...s, investor: { ...s.investor, ...patch } }));
  },

  setInvestmentRequestStatus(id: string, status: "approved" | "rejected") {
    setState((s) => ({
      ...s,
      investmentRequests: s.investmentRequests.map((r) => (r.id === id ? { ...r, status } : r)),
    }));
  },

  setDepositStatus(id: string, status: "approved" | "rejected") {
    setState((s) => ({
      ...s,
      depositRequests: s.depositRequests.map((r) => (r.id === id ? { ...r, status } : r)),
    }));
  },

  setWithdrawalStatus(id: string, status: WithdrawalStatus) {
    setState((s) => ({
      ...s,
      adminWithdrawals: s.adminWithdrawals.map((w) => (w.id === id ? { ...w, status } : w)),
    }));
  },

  setUserStatus(id: string, status: UserStatus) {
    setState((s) => ({ ...s, users: s.users.map((u) => (u.id === id ? { ...u, status } : u)) }));
  },

  updatePlan(id: PlanId, patch: Partial<Pick<Plan, "name" | "monthlyRate" | "tagline">>) {
    setState((s) => ({ ...s, plans: s.plans.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  },
};
