import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  ArrowDownToLine,
  LayoutDashboard,
  PlusCircle,
  ReceiptText,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { AppShell, type NavItem } from "@/components/app/AppShell";
import { useDemoStore } from "@/lib/demo-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "لوحة المستثمر — ركيزة" },
      { name: "description", content: "تابع استثماراتك وعملياتك وطلبات السحب في لوحة تحكم ركيزة." },
      { property: "og:title", content: "لوحة المستثمر — ركيزة" },
      { property: "og:description", content: "متابعة الاستثمارات والعمليات والسحوبات." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardLayout,
});

const NAV: NavItem[] = [
  { to: "/dashboard", label: "نظرة عامة", icon: LayoutDashboard, exact: true, tab: "الرئيسية" },
  { to: "/dashboard/investments", label: "استثماراتي", icon: Wallet, tab: "استثماراتي" },
  { to: "/dashboard/invest", label: "طلب استثمار جديد", icon: PlusCircle, tab: "استثمار" },
  { to: "/dashboard/transactions", label: "سجل العمليات", icon: ReceiptText },
  { to: "/dashboard/withdrawals", label: "السحوبات", icon: ArrowDownToLine, tab: "السحوبات" },
  { to: "/dashboard/profile", label: "الملف الشخصي والأمان", icon: ShieldCheck },
];

function DashboardLayout() {
  const name = useDemoStore((s) => s.investor.name);
  return (
    <AppShell area="investor" nav={NAV} userName={name} userRole="حساب مستثمر">
      <Outlet />
    </AppShell>
  );
}
