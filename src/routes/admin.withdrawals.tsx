import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck } from "lucide-react";
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
import { ReviewActions } from "@/components/app/ReviewActions";
import { demoActions, useDemoStore } from "@/lib/demo-store";
import type { WithdrawalStatus } from "@/lib/demo-data";
import { formatDate, formatUSDFixed } from "@/lib/format";
import { withdrawalStatus } from "@/lib/status";

export const Route = createFileRoute("/admin/withdrawals")({
  head: () => ({
    meta: [{ title: "طلبات السحب — إدارة ركيزة" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminWithdrawals,
});

function AdminWithdrawals() {
  const wds = useDemoStore((s) => s.adminWithdrawals);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | WithdrawalStatus>("all");

  const rows = useMemo(
    () =>
      wds.filter(
        (w) =>
          (status === "all" || w.status === status) &&
          (q === "" || (w.user ?? "").includes(q) || w.id.toLowerCase().includes(q.toLowerCase())),
      ),
    [wds, q, status],
  );

  const act = (id: string, s: WithdrawalStatus, msg: string) => {
    demoActions.setWithdrawalStatus(id, s);
    toast.success(msg);
  };

  return (
    <>
      <PageHeader
        title="طلبات السحب"
        description="راجع طلبات السحب وتحقق من الهوية قبل الموافقة، ثم علّم الطلب كمحوّل بعد التنفيذ."
      />
      <Panel>
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row">
          <SearchInput value={q} onChange={setQ} placeholder="ابحث بالاسم أو رقم الطلب" />
          <FilterSelect
            label="الحالة"
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: "كل الحالات" },
              { value: "pending", label: "قيد المراجعة" },
              { value: "approved", label: "موافق عليه" },
              { value: "paid", label: "تم التحويل" },
              { value: "rejected", label: "مرفوض" },
            ]}
          />
        </div>
        <div className={tableCls.wrap}>
          <table className={tableCls.table}>
            <thead>
              <tr>
                {["رقم الطلب", "المستثمر", "المبلغ", "الطريقة", "التاريخ", "الحالة", "الإجراء"].map(
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
              {rows.map((w) => (
                <tr key={w.id} className={tableCls.tr}>
                  <td className={tableCls.td}>
                    <span className="num text-muted-foreground">{w.id}</span>
                  </td>
                  <td className={tableCls.td}>{w.user}</td>
                  <td className={tableCls.td}>
                    <span className="num font-semibold">{formatUSDFixed(w.amount)}</span>
                  </td>
                  <td className={tableCls.td}>{w.method}</td>
                  <td className={tableCls.td}>{formatDate(w.date)}</td>
                  <td className={tableCls.td}>
                    <StatusBadge tone={withdrawalStatus[w.status].tone}>
                      {withdrawalStatus[w.status].label}
                    </StatusBadge>
                  </td>
                  <td className={tableCls.td}>
                    {w.status === "pending" && (
                      <ReviewActions
                        approveLabel="موافقة"
                        onApprove={() => act(w.id, "approved", `تمت الموافقة على ${w.id}`)}
                        onReject={() => act(w.id, "rejected", `تم رفض ${w.id}`)}
                      />
                    )}
                    {w.status === "approved" && (
                      <Button
                        size="sm"
                        variant="gold"
                        onClick={() => act(w.id, "paid", `تم تعليم ${w.id} كمحوّل`)}
                      >
                        <BadgeCheck />
                        تعليم كمحوّل
                      </Button>
                    )}
                    {(w.status === "paid" || w.status === "rejected") && (
                      <span className="text-xs text-muted-foreground">مغلق</span>
                    )}
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
