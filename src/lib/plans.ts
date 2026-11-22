/**
 * Plan rules for Rakiza. Single source of truth for tiers, rates and the calculator.
 * Returns are target (estimated) monthly returns on principal only — never guaranteed,
 * never compounded automatically.
 */

export type PlanId = "starter" | "growth" | "capital";

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  /** Lowest amount accepted by this plan, in USD (inclusive). */
  minAmount: number;
  /** Highest amount accepted, in USD. null = no upper limit. */
  maxAmount: number | null;
  /** Target monthly return as a fraction (0.07 = 7%). */
  monthlyRate: number;
  rangeLabel: string;
  exampleAmount: number;
  terms: string[];
}

export const MIN_INVESTMENT = 10;
/** Each investment cycle lasts one month and can be renewed. */
export const TERM_MONTHS = 1;
export const STARTER_CEILING = 100; // amounts below this → starter
export const GROWTH_CEILING = 1000; // amounts up to and including this → growth

const commonTerms = [
  "مدة كل دورة استثمار شهر واحد، ويمكن تجديدها بطلب من المستثمر.",
  "العائد المذكور مستهدف وتقديري وغير مضمون، وقد يكون أقل أو صفراً.",
  "يُحتسب العائد على أصل المبلغ فقط، دون إعادة استثمار الأرباح تلقائياً.",
  "قد يتعرض رأس المال لخسارة جزئية أو كلية وفق ظروف السوق.",
  "تُعرض أي رسوم أو اقتطاعات بوضوح في عقد الاستثمار قبل الموافقة عليه.",
];

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "خطة البداية",
    tagline: "مدخل هادئ لبناء عادة الادخار والاستثمار بمبالغ صغيرة.",
    minAmount: MIN_INVESTMENT,
    maxAmount: STARTER_CEILING,
    monthlyRate: 0.07,
    rangeLabel: "من 10$ إلى أقل من 100$",
    exampleAmount: 50,
    terms: [`الحد الأدنى للاستثمار ${MIN_INVESTMENT}$ والحد الأعلى أقل من 100$.`, ...commonTerms],
  },
  {
    id: "growth",
    name: "خطة النمو",
    tagline: "توازن بين حجم المبلغ والعائد المستهدف لمن يخطط بثبات.",
    minAmount: STARTER_CEILING,
    maxAmount: GROWTH_CEILING,
    monthlyRate: 0.05,
    rangeLabel: "من 100$ إلى 1,000$",
    exampleAmount: 500,
    terms: ["تشمل المبالغ من 100$ حتى 1,000$ ضمناً.", ...commonTerms],
  },
  {
    id: "capital",
    name: "خطة الرسوخ",
    tagline: "لرؤوس الأموال الأكبر مع متابعة دورية وتقارير مفصلة.",
    minAmount: GROWTH_CEILING,
    maxAmount: null,
    monthlyRate: 0.04,
    rangeLabel: "أكثر من 1,000$",
    exampleAmount: 5000,
    terms: ["تشمل المبالغ التي تزيد على 1,000$.", ...commonTerms],
  },
];

export function getPlanById(id: PlanId): Plan {
  const plan = PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`Unknown plan ${id}`);
  return plan;
}

/**
 * Returns the plan an amount falls into, or null when below the minimum or invalid.
 * `plans` lets callers pass an edited plan list (admin demo); tier boundaries never change.
 */
export function getPlanForAmount(amount: number, plans: Plan[] = PLANS): Plan | null {
  if (!Number.isFinite(amount) || amount < MIN_INVESTMENT) return null;
  const pick = (id: PlanId) => plans.find((p) => p.id === id) ?? getPlanById(id);
  if (amount < STARTER_CEILING) return pick("starter");
  if (amount <= GROWTH_CEILING) return pick("growth");
  return pick("capital");
}

const roundCents = (n: number) => Math.round(n * 100) / 100;

export interface ReturnEstimate {
  plan: Plan | null;
  monthlyReturn: number;
  totalReturn: number;
  finalValue: number;
}

/**
 * Simple (non-compounding) estimate: principal is renewed each month,
 * profits are paid out rather than reinvested.
 */
export function estimateReturns(
  amount: number,
  months: number,
  plans: Plan[] = PLANS,
): ReturnEstimate {
  const plan = getPlanForAmount(amount, plans);
  const safeMonths = Number.isFinite(months) && months > 0 ? Math.floor(months) : 0;
  if (!plan) return { plan: null, monthlyReturn: 0, totalReturn: 0, finalValue: 0 };
  const monthlyReturn = roundCents(amount * plan.monthlyRate);
  const totalReturn = roundCents(monthlyReturn * safeMonths);
  return { plan, monthlyReturn, totalReturn, finalValue: roundCents(amount + totalReturn) };
}

export interface RenewalPoint {
  month: number;
  /** Principal renewed every cycle: value after `month` cycles. */
  withRenewal: number;
  /** Single cycle, then the money sits idle: value stops growing after month 1. */
  withoutRenewal: number;
}

/** Month-by-month estimate comparing renewing every cycle vs. a single cycle. */
export function compareRenewal(
  amount: number,
  months: number,
  plans: Plan[] = PLANS,
): RenewalPoint[] {
  const safeMonths = Number.isFinite(months) && months > 0 ? Math.floor(months) : 0;
  if (!getPlanForAmount(amount, plans)) return [];
  return Array.from({ length: safeMonths + 1 }, (_, m) => ({
    month: m,
    withRenewal: m === 0 ? amount : estimateReturns(amount, m, plans).finalValue,
    withoutRenewal:
      m === 0 ? amount : estimateReturns(amount, Math.min(m, TERM_MONTHS), plans).finalValue,
  }));
}
