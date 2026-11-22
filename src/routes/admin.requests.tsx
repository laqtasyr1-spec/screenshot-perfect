import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { getPlanById } from "@/lib/plans";
import { formatDate, formatUSD } from "@/lib/format";
import { requestStatus } from "@/lib/status";

export const Route = createFileRoute("/admin/requests")({
  head: () => ({
    meta: [
      { title: "طلبات الاستثمار والإيداع — إدارة ركيزة" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RequestsPage,
});

type S = "all" | "pending" | "approved" | "rejected";
const statusOptions: { value: S; label: string }[] = [
  { value: "all", label: "كل الحالات" },
  { value: "pending", label: "بانتظار المراجعة" },
  { value: "approved", label: "مقبول" },
  { value: "rejected", label: "مرفوض" },
];

function RequestsPage() {
  const invReq = useDemoStore((s) => s.investmentRequests);
  const depReq = useDemoStore((s) => s.depositRequests);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<S>("pending");

  const match = (user: string, id: string, st: string) =>
    (status === "all" || st === status) &&
    (q === "" || user.includes(q) || id.toLowerCase().includes(q.toLowerCase()));

  const inv = useMemo(
    () => invReq.filter((r) => match(r.user, r.id, r.status)),
    [invReq, q, status],
  ); // eslint-disable-line react-hooks/exhaustive-deps
  const dep = useMemo(
    () => depReq.filter((r) => match(r.user, r.id, r.status)),
    [depReq, q, status],
  ); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <PageHeader
        title="طلبات الاستثمار والإيداع"
        description="راجع الطلبات الجديدة، وتحقق من الإيداعات قبل بدء أي دورة استثمارية."
      />
      <Tabs defaultValue="investments">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <TabsList className="h-10">
            <TabsTrigger value="investments">
              طلبات الاستثمار ({invReq.filter((r) => r.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="deposits">
              طلبات الإيداع ({depReq.filter((r) => r.status === "pending").length})
            </TabsTrigger>
          </TabsList>
          <div className="flex flex-col gap-3 sm:flex-row">
            <SearchInput value={q} onChange={setQ} placeholder="ابحث بالاسم أو رقم الطلب" />
            <FilterSelect
              label="الحالة"
              value={status}
              onChange={setStatus}
              options={statusOptions}
            />
          </div>
        </div>

        <TabsContent value="investments">
          <Panel>
            <div className={tableCls.wrap}>
              <table className={tableCls.table}>
                <thead>
                  <tr>
                    {[
                      "رقم الطلب",
                      "المستثمر",
                      "الخطة",
                      "المبلغ",
                      "التاريخ",
                      "الحالة",
                      "الإجراء",
                    ].map((h) => (
                      <th key={h} className={tableCls.th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inv.length === 0 && <EmptyRow colSpan={7} />}
                  {inv.map((r) => (
                    <tr key={r.id} className={tableCls.tr}>
                      <td data-label="رقم الطلب" className={tableCls.td}>
                        <span className="num text-muted-foreground">{r.id}</span>
                      </td>
                      <td data-label="المستثمر" className={tableCls.td}>
                        {r.user}
                      </td>
                      <td data-label="الخطة" className={tableCls.td}>
                        {getPlanById(r.planId).name}
                      </td>
                      <td data-label="المبلغ" className={tableCls.td}>
                        <span className="num font-semibold">{formatUSD(r.amount)}</span>
                      </td>
                      <td data-label="التاريخ" className={tableCls.td}>
                        {formatDate(r.date)}
                      </td>
                      <td data-label="الحالة" className={tableCls.td}>
                        <StatusBadge tone={requestStatus[r.status].tone}>
                          {requestStatus[r.status].label}
                        </StatusBadge>
                      </td>
                      <td data-label="الإجراء" className={tableCls.td}>
                        {r.status === "pending" ? (
                          <ReviewActions
                            onApprove={() => {
                              demoActions.setInvestmentRequestStatus(r.id, "approved");
                              toast.success(`تم قبول ${r.id}`);
                            }}
                            onReject={() => {
                              demoActions.setInvestmentRequestStatus(r.id, "rejected");
                              toast(`تم رفض ${r.id}`);
                            }}
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">تمت المراجعة</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="deposits">
          <Panel>
            <div className={tableCls.wrap}>
              <table className={tableCls.table}>
                <thead>
                  <tr>
                    {[
                      "رقم الطلب",
                      "المستثمر",
                      "المبلغ",
                      "الطريقة",
                      "مرجع التحويل",
                      "التاريخ",
                      "الحالة",
                      "الإجراء",
                    ].map((h) => (
                      <th key={h} className={tableCls.th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dep.length === 0 && <EmptyRow colSpan={8} />}
                  {dep.map((r) => (
                    <tr key={r.id} className={tableCls.tr}>
                      <td data-label="رقم الطلب" className={tableCls.td}>
                        <span className="num text-muted-foreground">{r.id}</span>
                      </td>
                      <td data-label="المستثمر" className={tableCls.td}>
                        {r.user}
                      </td>
                      <td data-label="المبلغ" className={tableCls.td}>
                        <span className="num font-semibold">{formatUSD(r.amount)}</span>
                      </td>
                      <td data-label="الطريقة" className={tableCls.td}>
                        {r.method}
                      </td>
                      <td data-label="مرجع التحويل" className={tableCls.td}>
                        <span className="num">{r.reference}</span>
                      </td>
                      <td data-label="التاريخ" className={tableCls.td}>
                        {formatDate(r.date)}
                      </td>
                      <td data-label="الحالة" className={tableCls.td}>
                        <StatusBadge tone={requestStatus[r.status].tone}>
                          {requestStatus[r.status].label}
                        </StatusBadge>
                      </td>
                      <td data-label="الإجراء" className={tableCls.td}>
                        {r.status === "pending" ? (
                          <ReviewActions
                            approveLabel="تأكيد الاستلام"
                            onApprove={() => {
                              demoActions.setDepositStatus(r.id, "approved");
                              toast.success(`تم تأكيد الإيداع ${r.id}`);
                            }}
                            onReject={() => {
                              demoActions.setDepositStatus(r.id, "rejected");
                              toast(`تم رفض الإيداع ${r.id}`);
                            }}
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">تمت المراجعة</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </TabsContent>
      </Tabs>
    </>
  );
}
