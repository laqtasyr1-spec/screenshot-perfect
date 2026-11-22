import type { Tone } from "@/components/app/ui";
import type { InvestmentStatus, TxStatus, TxType, UserStatus, WithdrawalStatus } from "./demo-data";

export const investmentStatus: Record<InvestmentStatus, { label: string; tone: Tone }> = {
  active: { label: "نشط", tone: "success" },
  pending: { label: "قيد المراجعة", tone: "warning" },
  completed: { label: "مستحق ومكتمل", tone: "info" },
  rejected: { label: "مرفوض", tone: "danger" },
};

export const txStatus: Record<TxStatus, { label: string; tone: Tone }> = {
  completed: { label: "مكتملة", tone: "success" },
  pending: { label: "قيد المعالجة", tone: "warning" },
  rejected: { label: "مرفوضة", tone: "danger" },
};

export const txType: Record<TxType, string> = {
  deposit: "إيداع",
  profit: "عائد مسجل",
  withdrawal: "سحب",
};

export const withdrawalStatus: Record<WithdrawalStatus, { label: string; tone: Tone }> = {
  pending: { label: "قيد المراجعة", tone: "warning" },
  approved: { label: "موافق عليه", tone: "info" },
  paid: { label: "تم التحويل", tone: "success" },
  rejected: { label: "مرفوض", tone: "danger" },
};

export const userStatus: Record<UserStatus, { label: string; tone: Tone }> = {
  active: { label: "نشط", tone: "success" },
  pending: { label: "بانتظار التحقق", tone: "warning" },
  suspended: { label: "موقوف", tone: "danger" },
};

export const requestStatus: Record<
  "pending" | "approved" | "rejected",
  { label: string; tone: Tone }
> = {
  pending: { label: "بانتظار المراجعة", tone: "warning" },
  approved: { label: "مقبول", tone: "success" },
  rejected: { label: "مرفوض", tone: "danger" },
};
