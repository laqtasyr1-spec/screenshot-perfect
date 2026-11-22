import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  ArrowDownToLine,
  BarChart3,
  ClipboardCheck,
  Gauge,
  ReceiptText,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { AppShell, type NavItem } from "@/components/app/AppShell";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة — ركيزة" },
      { name: "description", content: "إدارة المستخدمين والخطط والطلبات والتقارير في منصة ركيزة." },
      { property: "og:title", content: "لوحة الإدارة — ركيزة" },
      { property: "og:description", content: "إدارة المنصة والطلبات والتقارير." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const NAV: NavItem[] = [
  { to: "/admin", label: "لوحة القيادة", icon: Gauge, exact: true },
  { to: "/admin/users", label: "المستخدمون", icon: Users },
  { to: "/admin/plans", label: "الخطط ونسب العوائد", icon: SlidersHorizontal },
  { to: "/admin/requests", label: "طلبات الاستثمار والإيداع", icon: ClipboardCheck },
  { to: "/admin/withdrawals", label: "طلبات السحب", icon: ArrowDownToLine },
  { to: "/admin/transactions", label: "سجل العمليات", icon: ReceiptText },
  { to: "/admin/reports", label: "التقارير المالية", icon: BarChart3 },
];

function AdminLayout() {
  return (
    <AppShell area="admin" nav={NAV} userName="مدير المنصة" userRole="صلاحيات كاملة">
      <Outlet />
    </AppShell>
  );
}
