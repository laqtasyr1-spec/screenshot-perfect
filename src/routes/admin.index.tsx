import { createFileRoute, Link } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  ArrowDownToLine,
  ArrowUpLeft,
  Banknote,
  ClipboardCheck,
  Layers,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  PageHeader,
  Panel,
  StatCard,
  StatusBadge,
  axisTick,
  chartTooltipStyle,
} from "@/components/app/ui";
import { ReviewActions } from "@/components/app/ReviewActions";
import { demoActions, useDemoStore } from "@/lib/demo-store";
import { ADMIN_MONTHLY } from "@/lib/demo-data";
import { getPlanById } from "@/lib/plans";
import { formatShortDate, formatUSD, formatUSDFixed } from "@/lib/format";
import { withdrawalStatus } from "@/lib/status";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "لوحة القيادة — إدارة ركيزة" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminOverview,
});

function AdminOverview() {
  const users = useDemoStore((s) => s.users);
  const invReq = useDemoStore((s) => s.investmentRequests);
  const depReq = useDemoStore((s) => s.depositRequests);
  const wds = useDemoStore((s) => s.adminWithdrawals);

  const totalFunds = users.reduce((a, u) => a + u.invested, 0);
  const activeInvestments = invReq.filter((r) => r.status === "approved").length;
  const pendingDeposits = depReq.filter((r) => r.status === "pending");
  const pendingWds = wds.filter((w) => w.status === "pending");
  const pendingInv = invReq.filter((r) => r.status === "pending");

  return (
    <>
      <PageHeader
        title="لوحة القيادة"
        description="نظرة شاملة على نشاط المنصة والطلبات التي تحتاج إلى مراجعة."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          index={0}
          label="إجمالي المستخدمين"
          icon={Users}
          value={<span className="num">{users.length}</span>}
          hint={`${users.filter((u) => u.status === "pending").length} بانتظار التحقق`}
        />
        <StatCard
          index={1}
          tone="primary"
          label="إجمالي الأموال المسجلة"
          icon={Banknote}
          value={<span className="num">{formatUSD(totalFunds)}</span>}
        />
        <StatCard
          index={2}
          label="الاستثمارات النشطة"
          icon={Layers}
          value={<span className="num">{activeInvestments}</span>}
        />
        <StatCard
          index={3}
          tone="gold"
          label="طلبات الإيداع المعلقة"
          icon={ClipboardCheck}
          value={<span className="num">{pendingDeposits.length}</span>}
          hint={formatUSD(pendingDeposits.reduce((a, d) => a + d.amount, 0))}
        />
        <StatCard
          index={4}
          tone="gold"
          label="طلبات السحب المعلقة"
          icon={ArrowDownToLine}
          value={<span className="num">{pendingWds.length}</span>}
          hint={formatUSDFixed(pendingWds.reduce((a, d) => a + d.amount, 0))}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel
          title="التدفقات الشهرية"
          className="xl:col-span-2"
          action={
            <Link
              to="/admin/reports"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              التقارير
              <ArrowUpLeft className="h-3.5 w-3.5" />
            </Link>
          }
        >
          <div className="h-72 p-4" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ADMIN_MONTHLY}
                margin={{ top: 10, right: 10, left: -6, bottom: 0 }}
                barGap={4}
              >
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} reversed />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} orientation="right" />
                <Tooltip
                  {...chartTooltipStyle}
                  cursor={{ fill: "var(--accent)", opacity: 0.4 }}
                  formatter={(v: number, n) => [
                    formatUSD(v),
                    n === "deposits"
                      ? "الإيداعات"
                      : n === "withdrawals"
                        ? "السحوبات"
                        : "الأرباح المسجلة",
                  ]}
                />
                <Bar dataKey="deposits" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="profits" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="withdrawals" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-5 px-5 pb-4 text-xs text-muted-foreground">
            {[
              ["الإيداعات", "var(--chart-1)"],
              ["الأرباح المسجلة", "var(--chart-2)"],
              ["السحوبات", "var(--chart-3)"],
            ].map(([l, c]) => (
              <span key={l} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: c }} />
                {l}
              </span>
            ))}
          </div>
        </Panel>

        <Panel
          title="بانتظار المراجعة"
          action={
            <Link to="/admin/requests" className="text-xs text-primary hover:underline">
              الكل
            </Link>
          }
        >
          <ul>
            {pendingInv.length === 0 && (
              <li className="p-5 text-sm text-muted-foreground">لا توجد طلبات استثمار معلقة.</li>
            )}
            {pendingInv.map((r) => (
              <li key={r.id} className="border-t border-border px-5 py-4 first:border-t-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{r.user}</p>
                  <span className="num text-sm font-semibold">{formatUSD(r.amount)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {getPlanById(r.planId).name} · {formatShortDate(r.date)}
                </p>
                <div className="mt-3">
                  <ReviewActions
                    onApprove={() => {
                      demoActions.setInvestmentRequestStatus(r.id, "approved");
                      toast.success(`تم قبول الطلب ${r.id}`);
                    }}
                    onReject={() => {
                      demoActions.setInvestmentRequestStatus(r.id, "rejected");
                      toast(`تم رفض الطلب ${r.id}`);
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel
        title="أحدث طلبات السحب"
        className="mt-6"
        action={
          <Link to="/admin/withdrawals" className="text-xs text-primary hover:underline">
            إدارة السحوبات
          </Link>
        }
      >
        <ul>
          {wds.slice(0, 4).map((w) => (
            <li
              key={w.id}
              className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3.5 first:border-t-0"
            >
              <div>
                <p className="text-sm font-medium">{w.user}</p>
                <p className="text-xs text-muted-foreground">
                  {w.method} · {formatShortDate(w.date)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="num font-semibold">{formatUSDFixed(w.amount)}</span>
                <StatusBadge tone={withdrawalStatus[w.status].tone}>
                  {withdrawalStatus[w.status].label}
                </StatusBadge>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
      <p className="mt-6 text-xs text-muted-foreground">
        جميع الأرقام في لوحة الإدارة بيانات تجريبية.
      </p>
    </>
  );
}
