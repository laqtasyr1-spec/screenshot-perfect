import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import type { TxStatus, TxType } from "@/lib/demo-data";
import { formatDate, formatUSDFixed } from "@/lib/format";
import { txStatus, txType } from "@/lib/status";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/transactions")({
  head: () => ({
    meta: [{ title: "سجل العمليات — ركيزة" }, { name: "robots", content: "noindex" }],
  }),
  component: TransactionsPage,
});

function TransactionsPage() {
  const transactions = useDemoStore((s) => s.transactions);
  const [type, setType] = useState<"all" | TxType>("all");
  const [status, setStatus] = useState<"all" | TxStatus>("all");
  const [q, setQ] = useState("");

  const rows = useMemo(
    () =>
      transactions.filter(
        (t) =>
          (type === "all" || t.type === type) &&
          (status === "all" || t.status === status) &&
          (q === "" || t.id.toLowerCase().includes(q.toLowerCase()) || t.note.includes(q)),
      ),
    [transactions, type, status, q],
  );

  const sum = (k: TxType) =>
    transactions
      .filter((t) => t.type === k && t.status === "completed")
      .reduce((a, t) => a + t.amount, 0);

  return (
    <>
      <PageHeader
        title="سجل العمليات"
        description="الإيداعات والأرباح المسجلة والسحوبات وحالة كل عملية."
        actions={
          <Button
            variant="outline"
            onClick={() => toast.info("سيتوفر تصدير كشف الحساب بعد ربط النظام الخلفي.")}
          >
            <Download />
            تصدير كشف
          </Button>
        }
      />
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 [&>*:first-child]:col-span-2 sm:[&>*:first-child]:col-span-1">
        {(
          [
            ["deposit", "إجمالي الإيداعات المكتملة", "text-foreground"],
            ["profit", "إجمالي الأرباح المسجلة", "text-primary"],
            ["withdrawal", "إجمالي السحوبات المكتملة", "text-gold"],
          ] as const
        ).map(([k, label, color]) => (
          <div key={k} className="min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-5">
            <p className="text-xs leading-5 text-muted-foreground sm:text-sm">{label}</p>
            <p
              className={cn(
                "num mt-2 truncate text-start font-display text-xl font-semibold sm:text-2xl",
                color,
              )}
            >
              {formatUSDFixed(sum(k))}
            </p>
          </div>
        ))}
      </div>
      <Panel>
        <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
          <Tabs value={type} onValueChange={(v) => setType(v as typeof type)}>
            <TabsList className="h-10">
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="deposit">الإيداعات</TabsTrigger>
              <TabsTrigger value="profit">الأرباح</TabsTrigger>
              <TabsTrigger value="withdrawal">السحوبات</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex flex-col gap-3 sm:flex-row">
            <SearchInput value={q} onChange={setQ} placeholder="ابحث برقم العملية أو الوصف" />
            <FilterSelect
              label="الحالة"
              value={status}
              onChange={setStatus}
              options={[
                { value: "all", label: "كل الحالات" },
                { value: "completed", label: "مكتملة" },
                { value: "pending", label: "قيد المعالجة" },
                { value: "rejected", label: "مرفوضة" },
              ]}
            />
          </div>
        </div>
        <div className={tableCls.wrap}>
          <table className={tableCls.table}>
            <thead>
              <tr>
                {["رقم العملية", "النوع", "الوصف", "التاريخ", "المبلغ", "الحالة"].map((h) => (
                  <th key={h} className={tableCls.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <EmptyRow colSpan={6} />}
              {rows.map((t) => (
                <tr key={t.id} className={tableCls.tr}>
                  <td data-label="رقم العملية" className={tableCls.td}>
                    <span className="num text-muted-foreground">{t.id}</span>
                  </td>
                  <td data-label="النوع" className={tableCls.td}>
                    {txType[t.type]}
                  </td>
                  <td data-label="الوصف" className={tableCls.td}>
                    {t.note}
                  </td>
                  <td data-label="التاريخ" className={tableCls.td}>
                    {formatDate(t.date)}
                  </td>
                  <td data-label="المبلغ" className={tableCls.td}>
                    <span
                      className={cn(
                        "num font-semibold",
                        t.type === "withdrawal" ? "" : "text-primary",
                      )}
                    >
                      {t.type === "withdrawal" ? "−" : "+"}
                      {formatUSDFixed(t.amount)}
                    </span>
                  </td>
                  <td data-label="الحالة" className={tableCls.td}>
                    <StatusBadge tone={txStatus[t.status].tone}>
                      {txStatus[t.status].label}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
