import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  EmptyRow,
  FilterSelect,
  PageHeader,
  Panel,
  SearchInput,
  StatusBadge,
  tableCls,
} from "@/components/app/ui";
import { ADMIN_TRANSACTIONS, type TxStatus, type TxType } from "@/lib/demo-data";
import { formatDate, formatUSDFixed } from "@/lib/format";
import { txStatus, txType } from "@/lib/status";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/transactions")({
  head: () => ({
    meta: [{ title: "سجل العمليات — إدارة ركيزة" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminTransactions,
});

function AdminTransactions() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | TxType>("all");
  const [status, setStatus] = useState<"all" | TxStatus>("all");

  const rows = useMemo(
    () =>
      ADMIN_TRANSACTIONS.filter(
        (t) =>
          (type === "all" || t.type === type) &&
          (status === "all" || t.status === status) &&
          (q === "" ||
            (t.user ?? "").includes(q) ||
            t.id.toLowerCase().includes(q.toLowerCase()) ||
            t.note.includes(q)),
      ),
    [q, type, status],
  );

  return (
    <>
      <PageHeader
        title="سجل العمليات"
        description="جميع الحركات المالية المسجلة على المنصة."
        actions={
          <Button
            variant="outline"
            onClick={() => toast.info("سيتوفر التصدير بعد ربط النظام الخلفي.")}
          >
            <Download />
            تصدير CSV
          </Button>
        }
      />
      <Panel>
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row">
          <SearchInput value={q} onChange={setQ} placeholder="ابحث بالاسم أو الرقم أو الوصف" />
          <FilterSelect
            label="النوع"
            value={type}
            onChange={setType}
            options={[
              { value: "all", label: "كل الأنواع" },
              { value: "deposit", label: "إيداع" },
              { value: "profit", label: "عائد مسجل" },
              { value: "withdrawal", label: "سحب" },
            ]}
          />
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
        <div className={tableCls.wrap}>
          <table className={tableCls.table}>
            <thead>
              <tr>
                {["رقم العملية", "المستخدم", "النوع", "الوصف", "التاريخ", "المبلغ", "الحالة"].map(
                  (h) => (
                    <th key={h} className={tableCls.th}>
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <EmptyRow colSpan={7} />}
              {rows.map((t) => (
                <tr key={t.id} className={tableCls.tr}>
                  <td className={tableCls.td}>
                    <span className="num text-muted-foreground">{t.id}</span>
                  </td>
                  <td className={tableCls.td}>{t.user}</td>
                  <td className={tableCls.td}>{txType[t.type]}</td>
                  <td className={tableCls.td}>{t.note}</td>
                  <td className={tableCls.td}>{formatDate(t.date)}</td>
                  <td className={tableCls.td}>
                    <span
                      className={cn("num font-semibold", t.type !== "withdrawal" && "text-primary")}
                    >
                      {t.type === "withdrawal" ? "−" : "+"}
                      {formatUSDFixed(t.amount)}
                    </span>
                  </td>
                  <td className={tableCls.td}>
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
