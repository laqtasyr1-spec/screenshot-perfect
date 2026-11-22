/**
 * Demo data for the interface prototype. Every figure here is fictional and is shown
 * with a "بيانات تجريبية" label. Replace with real data once a secure backend exists.
 */
import type { PlanId } from "./plans";

export type InvestmentStatus = "active" | "pending" | "completed" | "rejected";
export type TxType = "deposit" | "profit" | "withdrawal";
export type TxStatus = "completed" | "pending" | "rejected";
export type WithdrawalStatus = "pending" | "approved" | "rejected" | "paid";
export type UserStatus = "active" | "pending" | "suspended";

export interface Investment {
  id: string;
  planId: PlanId;
  amount: number;
  startDate: string;
  maturityDate: string;
  estimatedReturn: number;
  status: InvestmentStatus;
}

export interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  date: string;
  status: TxStatus;
  note: string;
  user?: string;
}

export interface Withdrawal {
  id: string;
  amount: number;
  method: string;
  date: string;
  status: WithdrawalStatus;
  user?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  city: string;
  joined: string;
  invested: number;
  status: UserStatus;
}

export interface InvestmentRequest {
  id: string;
  user: string;
  planId: PlanId;
  amount: number;
  date: string;
  status: "pending" | "approved" | "rejected";
}

export interface DepositRequest {
  id: string;
  user: string;
  amount: number;
  method: string;
  reference: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

export const DEMO_INVESTOR = {
  name: "سامر الحلبي",
  email: "samer.demo@example.com",
  phone: "+963 9XX XXX XXX",
  city: "دمشق",
  memberSince: "2026-08-14",
};

export const WITHDRAWAL_METHODS = ["تحويل عبر شركة حوالات محلية", "تحويل مصرفي", "محفظة إلكترونية"];

export const DEMO_INVESTMENTS: Investment[] = [
  {
    id: "INV-1042",
    planId: "growth",
    amount: 500,
    startDate: "2026-11-05",
    maturityDate: "2026-12-05",
    estimatedReturn: 25,
    status: "active",
  },
  {
    id: "INV-1047",
    planId: "starter",
    amount: 80,
    startDate: "2026-11-12",
    maturityDate: "2026-12-12",
    estimatedReturn: 5.6,
    status: "active",
  },
  {
    id: "INV-1051",
    planId: "capital",
    amount: 1500,
    startDate: "2026-11-20",
    maturityDate: "2026-12-20",
    estimatedReturn: 60,
    status: "pending",
  },
  {
    id: "INV-1018",
    planId: "growth",
    amount: 300,
    startDate: "2026-10-03",
    maturityDate: "2026-11-03",
    estimatedReturn: 15,
    status: "completed",
  },
  {
    id: "INV-0996",
    planId: "growth",
    amount: 300,
    startDate: "2026-09-03",
    maturityDate: "2026-10-03",
    estimatedReturn: 15,
    status: "completed",
  },
  {
    id: "INV-0971",
    planId: "starter",
    amount: 60,
    startDate: "2026-08-20",
    maturityDate: "2026-09-20",
    estimatedReturn: 4.2,
    status: "completed",
  },
];

export const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: "TX-5521",
    type: "deposit",
    amount: 1500,
    date: "2026-11-19",
    status: "pending",
    note: "إيداع لخطة الرسوخ",
  },
  {
    id: "TX-5498",
    type: "deposit",
    amount: 80,
    date: "2026-11-11",
    status: "completed",
    note: "إيداع لخطة البداية",
  },
  {
    id: "TX-5476",
    type: "deposit",
    amount: 500,
    date: "2026-11-04",
    status: "completed",
    note: "إيداع لخطة النمو",
  },
  {
    id: "TX-5460",
    type: "profit",
    amount: 15,
    date: "2026-11-03",
    status: "completed",
    note: "عائد دورة INV-1018",
  },
  {
    id: "TX-5433",
    type: "withdrawal",
    amount: 40,
    date: "2026-10-21",
    status: "completed",
    note: "سحب أرباح",
  },
  {
    id: "TX-5402",
    type: "profit",
    amount: 15,
    date: "2026-10-03",
    status: "completed",
    note: "عائد دورة INV-0996",
  },
  {
    id: "TX-5390",
    type: "deposit",
    amount: 300,
    date: "2026-10-02",
    status: "completed",
    note: "تجديد خطة النمو",
  },
  {
    id: "TX-5344",
    type: "profit",
    amount: 4.2,
    date: "2026-09-20",
    status: "completed",
    note: "عائد دورة INV-0971",
  },
  {
    id: "TX-5311",
    type: "withdrawal",
    amount: 25,
    date: "2026-09-25",
    status: "rejected",
    note: "بيانات الاستلام غير مكتملة",
  },
  {
    id: "TX-5298",
    type: "deposit",
    amount: 300,
    date: "2026-09-02",
    status: "completed",
    note: "إيداع لخطة النمو",
  },
  {
    id: "TX-5260",
    type: "deposit",
    amount: 60,
    date: "2026-08-19",
    status: "completed",
    note: "إيداع لخطة البداية",
  },
];

export const DEMO_WITHDRAWALS: Withdrawal[] = [
  {
    id: "WD-311",
    amount: 40,
    method: WITHDRAWAL_METHODS[0] ?? "",
    date: "2026-10-20",
    status: "paid",
  },
  {
    id: "WD-296",
    amount: 25,
    method: WITHDRAWAL_METHODS[2] ?? "",
    date: "2026-09-24",
    status: "rejected",
  },
];

/** Demo balance available for withdrawal (completed profits + matured principal not renewed). */
export const DEMO_AVAILABLE_BALANCE = 334.2;

export const DEMO_PORTFOLIO_HISTORY = [
  { month: "يونيو", value: 0, profit: 0 },
  { month: "يوليو", value: 0, profit: 0 },
  { month: "أغسطس", value: 60, profit: 0 },
  { month: "سبتمبر", value: 360, profit: 4.2 },
  { month: "أكتوبر", value: 300, profit: 15 },
  { month: "نوفمبر", value: 2080, profit: 15 },
];

export const ADMIN_USERS: AdminUser[] = [
  {
    id: "U-201",
    name: "سامر الحلبي",
    email: "samer.demo@example.com",
    city: "دمشق",
    joined: "2026-08-14",
    invested: 2080,
    status: "active",
  },
  {
    id: "U-202",
    name: "رنا الخطيب",
    email: "rana.demo@example.com",
    city: "حلب",
    joined: "2026-08-22",
    invested: 750,
    status: "active",
  },
  {
    id: "U-203",
    name: "محمد العلي",
    email: "mohammad.demo@example.com",
    city: "حمص",
    joined: "2026-09-01",
    invested: 3200,
    status: "active",
  },
  {
    id: "U-204",
    name: "لين الشامي",
    email: "leen.demo@example.com",
    city: "اللاذقية",
    joined: "2026-09-09",
    invested: 95,
    status: "active",
  },
  {
    id: "U-205",
    name: "عمر الحمصي",
    email: "omar.demo@example.com",
    city: "حماة",
    joined: "2026-09-17",
    invested: 0,
    status: "pending",
  },
  {
    id: "U-206",
    name: "هبة السيد",
    email: "heba.demo@example.com",
    city: "طرطوس",
    joined: "2026-09-28",
    invested: 1200,
    status: "active",
  },
  {
    id: "U-207",
    name: "خالد الزعبي",
    email: "khaled.demo@example.com",
    city: "درعا",
    joined: "2026-10-04",
    invested: 450,
    status: "suspended",
  },
  {
    id: "U-208",
    name: "نور الأتاسي",
    email: "nour.demo@example.com",
    city: "حمص",
    joined: "2026-10-11",
    invested: 60,
    status: "active",
  },
  {
    id: "U-209",
    name: "يزن العظمة",
    email: "yazan.demo@example.com",
    city: "دمشق",
    joined: "2026-10-19",
    invested: 5000,
    status: "active",
  },
  {
    id: "U-210",
    name: "مايا حداد",
    email: "maya.demo@example.com",
    city: "السويداء",
    joined: "2026-10-27",
    invested: 300,
    status: "active",
  },
  {
    id: "U-211",
    name: "أحمد الدروبي",
    email: "ahmad.demo@example.com",
    city: "حلب",
    joined: "2026-11-06",
    invested: 0,
    status: "pending",
  },
  {
    id: "U-212",
    name: "سلمى القباني",
    email: "salma.demo@example.com",
    city: "دمشق",
    joined: "2026-11-15",
    invested: 150,
    status: "active",
  },
];

export const ADMIN_INVESTMENT_REQUESTS: InvestmentRequest[] = [
  {
    id: "REQ-881",
    user: "سامر الحلبي",
    planId: "capital",
    amount: 1500,
    date: "2026-11-20",
    status: "pending",
  },
  {
    id: "REQ-879",
    user: "سلمى القباني",
    planId: "growth",
    amount: 150,
    date: "2026-11-18",
    status: "pending",
  },
  {
    id: "REQ-874",
    user: "يزن العظمة",
    planId: "capital",
    amount: 5000,
    date: "2026-11-14",
    status: "approved",
  },
  {
    id: "REQ-870",
    user: "نور الأتاسي",
    planId: "starter",
    amount: 60,
    date: "2026-11-10",
    status: "approved",
  },
  {
    id: "REQ-866",
    user: "خالد الزعبي",
    planId: "growth",
    amount: 450,
    date: "2026-11-07",
    status: "rejected",
  },
  {
    id: "REQ-861",
    user: "رنا الخطيب",
    planId: "growth",
    amount: 750,
    date: "2026-11-02",
    status: "approved",
  },
];

export const ADMIN_DEPOSIT_REQUESTS: DepositRequest[] = [
  {
    id: "DEP-412",
    user: "سامر الحلبي",
    amount: 1500,
    method: "تحويل عبر شركة حوالات محلية",
    reference: "HW-77412",
    date: "2026-11-19",
    status: "pending",
  },
  {
    id: "DEP-409",
    user: "سلمى القباني",
    amount: 150,
    method: "محفظة إلكترونية",
    reference: "EW-30981",
    date: "2026-11-18",
    status: "pending",
  },
  {
    id: "DEP-401",
    user: "يزن العظمة",
    amount: 5000,
    method: "تحويل مصرفي",
    reference: "BK-55120",
    date: "2026-11-13",
    status: "approved",
  },
  {
    id: "DEP-396",
    user: "خالد الزعبي",
    amount: 450,
    method: "تحويل عبر شركة حوالات محلية",
    reference: "HW-76990",
    date: "2026-11-06",
    status: "rejected",
  },
];

export const ADMIN_WITHDRAWALS: Withdrawal[] = [
  {
    id: "WD-338",
    user: "محمد العلي",
    amount: 128,
    method: "تحويل مصرفي",
    date: "2026-11-21",
    status: "pending",
  },
  {
    id: "WD-336",
    user: "هبة السيد",
    amount: 48,
    method: "محفظة إلكترونية",
    date: "2026-11-19",
    status: "pending",
  },
  {
    id: "WD-333",
    user: "رنا الخطيب",
    amount: 37.5,
    method: "تحويل عبر شركة حوالات محلية",
    date: "2026-11-15",
    status: "approved",
  },
  {
    id: "WD-327",
    user: "لين الشامي",
    amount: 6.65,
    method: "محفظة إلكترونية",
    date: "2026-11-09",
    status: "paid",
  },
  {
    id: "WD-311",
    user: "سامر الحلبي",
    amount: 40,
    method: "تحويل عبر شركة حوالات محلية",
    date: "2026-10-20",
    status: "paid",
  },
  {
    id: "WD-296",
    user: "سامر الحلبي",
    amount: 25,
    method: "محفظة إلكترونية",
    date: "2026-09-24",
    status: "rejected",
  },
];

export const ADMIN_TRANSACTIONS: Transaction[] = [
  {
    id: "TX-5530",
    user: "محمد العلي",
    type: "withdrawal",
    amount: 128,
    date: "2026-11-21",
    status: "pending",
    note: "طلب سحب أرباح",
  },
  {
    id: "TX-5521",
    user: "سامر الحلبي",
    type: "deposit",
    amount: 1500,
    date: "2026-11-19",
    status: "pending",
    note: "إيداع لخطة الرسوخ",
  },
  {
    id: "TX-5517",
    user: "سلمى القباني",
    type: "deposit",
    amount: 150,
    date: "2026-11-18",
    status: "pending",
    note: "إيداع لخطة النمو",
  },
  {
    id: "TX-5509",
    user: "يزن العظمة",
    type: "deposit",
    amount: 5000,
    date: "2026-11-13",
    status: "completed",
    note: "إيداع لخطة الرسوخ",
  },
  {
    id: "TX-5502",
    user: "رنا الخطيب",
    type: "profit",
    amount: 37.5,
    date: "2026-11-02",
    status: "completed",
    note: "عائد دورة شهرية",
  },
  {
    id: "TX-5498",
    user: "سامر الحلبي",
    type: "deposit",
    amount: 80,
    date: "2026-11-11",
    status: "completed",
    note: "إيداع لخطة البداية",
  },
  {
    id: "TX-5490",
    user: "لين الشامي",
    type: "withdrawal",
    amount: 6.65,
    date: "2026-11-09",
    status: "completed",
    note: "سحب أرباح",
  },
  {
    id: "TX-5482",
    user: "خالد الزعبي",
    type: "deposit",
    amount: 450,
    date: "2026-11-06",
    status: "rejected",
    note: "مرجع التحويل غير مطابق",
  },
  {
    id: "TX-5476",
    user: "سامر الحلبي",
    type: "deposit",
    amount: 500,
    date: "2026-11-04",
    status: "completed",
    note: "إيداع لخطة النمو",
  },
  {
    id: "TX-5465",
    user: "محمد العلي",
    type: "profit",
    amount: 128,
    date: "2026-11-01",
    status: "completed",
    note: "عائد دورة شهرية",
  },
  {
    id: "TX-5450",
    user: "هبة السيد",
    type: "profit",
    amount: 48,
    date: "2026-10-28",
    status: "completed",
    note: "عائد دورة شهرية",
  },
];

export const ADMIN_MONTHLY = [
  { month: "يونيو", deposits: 0, withdrawals: 0, profits: 0 },
  { month: "يوليو", deposits: 0, withdrawals: 0, profits: 0 },
  { month: "أغسطس", deposits: 1810, withdrawals: 0, profits: 0 },
  { month: "سبتمبر", deposits: 4250, withdrawals: 25, profits: 96 },
  { month: "أكتوبر", deposits: 6120, withdrawals: 140, profits: 241 },
  { month: "نوفمبر", deposits: 9480, withdrawals: 220, profits: 498 },
];
