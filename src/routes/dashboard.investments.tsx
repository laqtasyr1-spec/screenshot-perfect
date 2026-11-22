import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  EmptyRow,
  FilterSelect,
  PageHeader,
  Panel,
  SearchInput,
  StatusBadge,
  tableCls,
} from "@/components/app/ui";
import { useDemoStore } from "@/lib/demo-store";
import type { Investment, InvestmentStatus } from "@/lib/demo-data";
import { getPlanById, type PlanId } from "@/lib/plans";
import { formatDate, formatPercent, formatUSD, formatUSDFixed } from "@/lib/format";
import { investmentStatus } from "@/lib/status";

export const Route = createFileRoute("/dashboard/investments")({
  head: () => ({ meta: [{ title: "استثماراتي — ركيزة" }, { name: "robots", content: "noindex" }] }),
  component: InvestmentsPage,
});

function InvestmentsPage() {
  const investments = useDemoStore((s) => s.investments);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | InvestmentStatus>("all");
  const [plan, setPlan] = useState<"all" | PlanId>("all");
  const [selected, setSelected] = useState<Investment | null>(null);

  const rows = useMemo(
    () =>
      investments.filter(
        (i) =>
          (status === "all" || i.status === status) &&
          (plan === "all" || i.planId === plan) &&
          (q === "" ||
            i.id.toLowerCase().includes(q.toLowerCase()) ||
            getPlanById(i.planId).name.includes(q)),
      ),
    [investments, q, status, plan],
  );

  return (
    <>
      <PageHeader
        title="استثماراتي"
        description="كل دورة استثمارية مدتها شهر واحد. يظهر تاريخ الاستحقاق والعائد التقديري لكل منها."
        actions={
          <Button variant="hero" asChild>
            <Link to="/dashboard/invest">
              <PlusCircle />
              طلب استثمار جديد
            </Link>
          </Button>
        }
      />
      <Panel>
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
          <SearchInput value={q} onChange={setQ} placeholder="ابحث برقم الاستثمار أو الخطة" />
          <div className="flex gap-3">
            <FilterSelect
              label="الحالة"
              value={status}
              onChange={setStatus}
              options={[
                { value: "all", label: "كل الحالات" },
                { value: "active", label: "نشط" },
                { value: "pending", label: "قيد المراجعة" },
                { value: "completed", label: "مكتمل" },
                { value: "rejected", label: "مرفوض" },
              ]}
            />
            <FilterSelect
              label="الخطة"
              value={plan}
              onChange={setPlan}
              options={[
                { value: "all", label: "كل الخطط" },
                { value: "starter", label: "خطة البداية" },
                { value: "growth", label: "خطة النمو" },
                { value: "capital", label: "خطة الرسوخ" },
              ]}
            />
          </div>
        </div>
        <div className={tableCls.wrap}>
          <table className={tableCls.table}>
            <thead>
              <tr>
                {[
                  "الخطة",
                  "المبلغ المستثمر",
                  "تاريخ البداية",
                  "تاريخ الاستحقاق",
                  "العائد التقديري",
                  "الحالة",
                  "",
                ].map((h) => (
                  <th key={h} className={tableCls.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <EmptyRow colSpan={7} />}
              {rows.map((i) => {
                const p = getPlanById(i.planId);
                return (
                  <tr key={i.id} className={tableCls.tr}>
                    <td className={tableCls.td}>
                      <p className="font-medium">{p.name}</p>
                      <p className="num text-end text-xs text-muted-foreground">{i.id}</p>
                    </td>
                    <td className={tableCls.td}>
                      <span className="num font-semibold">{formatUSD(i.amount)}</span>
                    </td>
                    <td className={tableCls.td}>{formatDate(i.startDate)}</td>
                    <td className={tableCls.td}>{formatDate(i.maturityDate)}</td>
                    <td className={tableCls.td}>
                      <span className="num text-primary">{formatUSDFixed(i.estimatedReturn)}</span>
                    </td>
                    <td className={tableCls.td}>
                      <StatusBadge tone={investmentStatus[i.status].tone}>
                        {investmentStatus[i.status].label}
                      </StatusBadge>
                    </td>
                    <td className={tableCls.td}>
                      <Button variant="ghost" size="sm" onClick={() => setSelected(i)}>
                        <Eye />
                        تفاصيل
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="border-border-strong bg-popover sm:rounded-2xl">
          {selected && (
            <>
              <DialogHeader className="text-start sm:text-start">
                <DialogTitle className="font-display text-2xl">
                  {getPlanById(selected.planId).name}
                </DialogTitle>
                <DialogDescription>
                  <span className="num">{selected.id}</span>
                </DialogDescription>
              </DialogHeader>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                {[
                  [
                    "المبلغ",
                    <span key="a" className="num">
                      {formatUSD(selected.amount)}
                    </span>,
                  ],
                  [
                    "النسبة المستهدفة",
                    <span key="r" className="num">
                      {formatPercent(getPlanById(selected.planId).monthlyRate)}
                    </span>,
                  ],
                  ["تاريخ البداية", formatDate(selected.startDate)],
                  ["تاريخ الاستحقاق", formatDate(selected.maturityDate)],
                  [
                    "العائد التقديري",
                    <span key="e" className="num text-primary">
                      {formatUSDFixed(selected.estimatedReturn)}
                    </span>,
                  ],
                  [
                    "الحالة",
                    <StatusBadge key="s" tone={investmentStatus[selected.status].tone}>
                      {investmentStatus[selected.status].label}
                    </StatusBadge>,
                  ],
                ].map(([k, v]) => (
                  <div key={String(k)} className="rounded-xl bg-surface-raised p-3.5">
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="mt-1 font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-xs leading-6 text-muted-foreground">
                العائد التقديري محسوب على أصل المبلغ بالنسبة المستهدفة، والعائد الفعلي يُسجَّل عند
                الاستحقاق وقد يختلف.
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
