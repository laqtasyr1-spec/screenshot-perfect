import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Panel, axisTick, chartTooltipStyle } from "@/components/app/ui";
import { useDemoStore } from "@/lib/demo-store";
import { ADMIN_MONTHLY } from "@/lib/demo-data";
import { formatUSD } from "@/lib/format";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [{ title: "التقارير المالية — إدارة ركيزة" }, { name: "robots", content: "noindex" }],
  }),
  component: Reports,
});

const COLORS = ["var(--chart-2)", "var(--chart-1)", "var(--chart-3)"];

function Reports() {
  const [range, setRange] = useState<"3" | "6">("6");
  const users = useDemoStore((s) => s.users);
  const plans = useDemoStore((s) => s.plans);
  const requests = useDemoStore((s) => s.investmentRequests);
  const data = ADMIN_MONTHLY.slice(-Number(range)).map((m) => ({
    ...m,
    net: m.deposits - m.withdrawals,
  }));

  const byPlan = plans.map((p) => ({
    name: p.name,
    value: requests
      .filter((r) => r.planId === p.id && r.status === "approved")
      .reduce((a, r) => a + r.amount, 0),
  }));
  const byCity = Object.entries(
    users.reduce<Record<string, number>>(
      (a, u) => ({ ...a, [u.city]: (a[u.city] ?? 0) + u.invested }),
      {},
    ),
  )
    .map(([city, value]) => ({ city, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const totals = data.reduce(
    (a, m) => ({ d: a.d + m.deposits, w: a.w + m.withdrawals, p: a.p + m.profits }),
    { d: 0, w: 0, p: 0 },
  );

  return (
    <>
      <PageHeader
        title="التقارير المالية"
        description="ملخصات ورسوم بيانية لنشاط المنصة · بيانات تجريبية"
        actions={
          <>
            <Tabs value={range} onValueChange={(v) => setRange(v as "3" | "6")}>
              <TabsList className="h-10">
                <TabsTrigger value="3">آخر 3 أشهر</TabsTrigger>
                <TabsTrigger value="6">آخر 6 أشهر</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              variant="outline"
              onClick={() => toast.info("سيتوفر تصدير التقارير PDF بعد ربط النظام الخلفي.")}
            >
              <Download />
              تصدير
            </Button>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          ["إجمالي الإيداعات", totals.d, "text-foreground"],
          ["إجمالي السحوبات", totals.w, "text-gold"],
          ["الأرباح المسجلة", totals.p, "text-primary"],
          ["صافي التدفق", totals.d - totals.w, "text-foreground"],
        ].map(([l, v, c]) => (
          <div key={l as string} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{l}</p>
            <p className={`num mt-2 text-start font-display text-2xl font-semibold ${c}`}>
              {formatUSD(v as number)}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="صافي التدفق الشهري">
          <div className="h-72 p-4" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -6, bottom: 0 }}>
                <defs>
                  <linearGradient id="net" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} reversed />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} orientation="right" />
                <Tooltip
                  {...chartTooltipStyle}
                  formatter={(v: number) => [formatUSD(v), "صافي التدفق"]}
                />
                <Area
                  dataKey="net"
                  type="monotone"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  fill="url(#net)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="الأرباح المسجلة شهرياً">
          <div className="h-72 p-4" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -6, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} reversed />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} orientation="right" />
                <Tooltip
                  {...chartTooltipStyle}
                  cursor={{ fill: "var(--accent)", opacity: 0.4 }}
                  formatter={(v: number) => [formatUSD(v), "الأرباح"]}
                />
                <Bar dataKey="profits" fill="var(--gold)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="الاستثمارات المقبولة حسب الخطة">
          <div className="grid items-center gap-4 p-4 sm:grid-cols-2">
            <div className="h-56" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byPlan}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {byPlan.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...chartTooltipStyle} formatter={(v: number) => formatUSD(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-3">
              {byPlan.map((p, i) => (
                <li key={p.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                    {p.name}
                  </span>
                  <span className="num">{formatUSD(p.value)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <Panel title="الأموال المسجلة حسب المدينة">
          <ul className="space-y-4 p-5">
            {byCity.map((c) => {
              const max = byCity[0]?.value || 1;
              return (
                <li key={c.city}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span>{c.city}</span>
                    <span className="num text-muted-foreground">{formatUSD(c.value)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-border-strong">
                    <div
                      className="h-full rounded-full bg-brand-gradient"
                      style={{ width: `${(c.value / max) * 100}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
    </>
  );
}
