import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownToLine,
  ArrowUpLeft,
  CalendarClock,
  Coins,
  Layers,
  PlusCircle,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PageHeader,
  Panel,
  StatCard,
  StatusBadge,
  axisTick,
  chartTooltipStyle,
} from "@/components/app/ui";
import { RiskNotice } from "@/components/site/RiskNotice";
import { useDemoStore } from "@/lib/demo-store";
import { DEMO_PORTFOLIO_HISTORY } from "@/lib/demo-data";
import { getPlanById } from "@/lib/plans";
import { formatDate, formatShortDate, formatUSD, formatUSDFixed } from "@/lib/format";
import { txStatus, txType } from "@/lib/status";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [{ title: "نظرة عامة — لوحة المستثمر | ركيزة" }, { name: "robots", content: "noindex" }],
  }),
  component: Overview,
});

const PIE_COLORS = ["var(--chart-2)", "var(--chart-1)", "var(--chart-3)"];

function Overview() {
  const investor = useDemoStore((s) => s.investor);
  const investments = useDemoStore((s) => s.investments);
  const transactions = useDemoStore((s) => s.transactions);
  const withdrawals = useDemoStore((s) => s.withdrawals);

  const active = investments.filter((i) => i.status === "active");
  const pending = investments.filter((i) => i.status === "pending");
  const totalInvested = [...active, ...pending].reduce((a, i) => a + i.amount, 0);
  const monthlyEstimate = active.reduce((a, i) => a + i.estimatedReturn, 0);
  const pendingWithdrawals = withdrawals.filter(
    (w) => w.status === "pending" || w.status === "approved",
  );
  const nextMaturity = [...active].sort((a, b) => a.maturityDate.localeCompare(b.maturityDate))[0];

  const allocation = (["starter", "growth", "capital"] as const)
    .map((id) => ({
      name: getPlanById(id).name,
      value: [...active, ...pending]
        .filter((i) => i.planId === id)
        .reduce((a, i) => a + i.amount, 0),
    }))
    .filter((d) => d.value > 0);

  return (
    <>
      <PageHeader
        title={`أهلاً، ${investor.name.split(" ")[0]}`}
        description="ملخص استثماراتك وعملياتك الأخيرة."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/dashboard/withdrawals">
                <ArrowDownToLine />
                طلب سحب
              </Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/dashboard/invest">
                <PlusCircle />
                استثمار جديد
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          tone="primary"
          label="إجمالي المبلغ المستثمر"
          icon={Wallet}
          value={<span className="num">{formatUSD(totalInvested)}</span>}
          hint={`يشمل ${formatUSD(pending.reduce((a, i) => a + i.amount, 0))} قيد المراجعة`}
        />
        <StatCard
          index={1}
          label="الأرباح الشهرية المقدرة"
          icon={TrendingUp}
          value={<span className="num text-primary">{formatUSDFixed(monthlyEstimate)}</span>}
          hint="تقديرية وغير مضمونة"
        />
        <StatCard
          index={2}
          label="الاستثمارات النشطة"
          icon={Layers}
          value={<span className="num">{active.length}</span>}
          hint={`${pending.length} طلب قيد المراجعة`}
        />
        <StatCard
          index={3}
          tone="gold"
          label="طلبات السحب المفتوحة"
          icon={ArrowDownToLine}
          value={<span className="num">{pendingWithdrawals.length}</span>}
          hint={
            pendingWithdrawals.length
              ? `بقيمة ${formatUSDFixed(pendingWithdrawals.reduce((a, w) => a + w.amount, 0))}`
              : "لا توجد طلبات مفتوحة"
          }
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel
          title="تطور المحفظة"
          className="xl:col-span-2"
          action={<span className="text-xs text-muted-foreground">بيانات تجريبية</span>}
        >
          <div className="h-72 p-4" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={DEMO_PORTFOLIO_HISTORY}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="pf" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} reversed />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} orientation="right" />
                <Tooltip
                  {...chartTooltipStyle}
                  formatter={(v: number, n) => [
                    formatUSDFixed(v),
                    n === "value" ? "المبلغ المستثمر" : "العائد المسجل",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  fill="url(#pf)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="var(--gold)"
                  strokeWidth={2}
                  fill="none"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="توزيع المبالغ على الخطط">
          <div className="h-48" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocation}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                  stroke="none"
                >
                  {allocation.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip {...chartTooltipStyle} formatter={(v: number) => formatUSD(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-2.5 px-5 pb-5">
            {allocation.map((a, i) => (
              <li key={a.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  {a.name}
                </span>
                <span className="num">{formatUSD(a.value)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel
          title="آخر العمليات"
          className="xl:col-span-2"
          action={
            <Link
              to="/dashboard/transactions"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              عرض الكل
              <ArrowUpLeft className="h-3.5 w-3.5" />
            </Link>
          }
        >
          <ul>
            {transactions.slice(0, 6).map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between gap-4 border-t border-border px-5 py-3.5 first:border-t-0"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid h-9 w-9 place-items-center rounded-xl",
                      t.type === "withdrawal"
                        ? "bg-gold-soft text-gold"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    {t.type === "withdrawal" ? (
                      <ArrowDownToLine className="h-4 w-4" />
                    ) : t.type === "profit" ? (
                      <Coins className="h-4 w-4" />
                    ) : (
                      <Wallet className="h-4 w-4" />
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{txType[t.type]}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.note} · {formatShortDate(t.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge tone={txStatus[t.status].tone}>
                    {txStatus[t.status].label}
                  </StatusBadge>
                  <span
                    className={cn(
                      "num w-20 text-end text-sm font-semibold",
                      t.type === "withdrawal" ? "text-foreground" : "text-primary",
                    )}
                  >
                    {t.type === "withdrawal" ? "−" : "+"}
                    {formatUSDFixed(t.amount)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-6">
          <Panel title="الاستحقاق القادم">
            {nextMaturity ? (
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <CalendarClock className="h-5 w-5 text-gold" />
                  <p className="font-semibold">{formatDate(nextMaturity.maturityDate)}</p>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {getPlanById(nextMaturity.planId).name} ·{" "}
                  <span className="num">{formatUSD(nextMaturity.amount)}</span>
                </p>
                <p className="mt-1 text-sm">
                  العائد التقديري:{" "}
                  <span className="num font-semibold text-primary">
                    {formatUSDFixed(nextMaturity.estimatedReturn)}
                  </span>
                </p>
                <Button variant="outline" className="mt-5 w-full" asChild>
                  <Link to="/dashboard/investments">تفاصيل الاستثمار</Link>
                </Button>
              </div>
            ) : (
              <p className="p-5 text-sm text-muted-foreground">لا توجد استثمارات نشطة حالياً.</p>
            )}
          </Panel>
          <RiskNotice compact />
        </div>
      </div>
    </>
  );
}
