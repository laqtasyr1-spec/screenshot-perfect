import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownToLine, Clock, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  EmptyRow,
  FilterSelect,
  PageHeader,
  Panel,
  StatCard,
  StatusBadge,
  tableCls,
} from "@/components/app/ui";
import { demoActions, useDemoStore } from "@/lib/demo-store";
import { WITHDRAWAL_METHODS } from "@/lib/demo-data";
import { formatDate, formatUSDFixed } from "@/lib/format";
import { withdrawalStatus } from "@/lib/status";

export const Route = createFileRoute("/dashboard/withdrawals")({
  head: () => ({ meta: [{ title: "السحوبات — ركيزة" }, { name: "robots", content: "noindex" }] }),
  component: WithdrawalsPage,
});

function WithdrawalsPage() {
  const available = useDemoStore((s) => s.availableBalance);
  const withdrawals = useDemoStore((s) => s.withdrawals);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(WITHDRAWAL_METHODS[0] ?? "");
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);

  const value = Number(amount);
  const open = withdrawals.filter((w) => w.status === "pending" || w.status === "approved");

  const review = (e: React.FormEvent) => {
    e.preventDefault();
    if (!Number.isFinite(value) || value <= 0) return setError("أدخل مبلغاً صحيحاً.");
    if (value > available)
      return setError(`المبلغ أكبر من الرصيد المتاح (${formatUSDFixed(available)}).`);
    if (recipient.trim().length < 4)
      return setError("أدخل بيانات الاستلام (رقم الحساب أو الهاتف).");
    setError(null);
    setConfirm(true);
  };

  const submit = () => {
    demoActions.requestWithdrawal(Math.round(value * 100) / 100, method);
    setConfirm(false);
    setAmount("");
    setRecipient("");
    toast.success("تم تسجيل طلب السحب", {
      description: "حالة الطلب: قيد المراجعة. لا يتم أي تحويل حقيقي في هذا النموذج.",
    });
  };

  return (
    <>
      <PageHeader title="السحوبات" description="اطلب سحب رصيدك المتاح وتابع حالة طلباتك." />
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 [&>*:first-child]:col-span-2 sm:[&>*:first-child]:col-span-1">
        <StatCard
          tone="primary"
          label="المبلغ المتاح للسحب"
          icon={Wallet}
          value={<span className="num">{formatUSDFixed(available)}</span>}
          hint="أرباح مسجلة وأصول دورات مستحقة"
        />
        <StatCard
          index={1}
          label="طلبات مفتوحة"
          icon={Clock}
          value={<span className="num">{open.length}</span>}
          hint={`بقيمة ${formatUSDFixed(open.reduce((a, w) => a + w.amount, 0))}`}
        />
        <StatCard
          index={2}
          tone="gold"
          label="إجمالي ما تم تحويله"
          icon={ArrowDownToLine}
          value={
            <span className="num">
              {formatUSDFixed(
                withdrawals.filter((w) => w.status === "paid").reduce((a, w) => a + w.amount, 0),
              )}
            </span>
          }
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <Panel title="طلب سحب جديد">
          <form onSubmit={review} className="space-y-5 p-5" noValidate>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="wd-amount">المبلغ المطلوب (دولار)</Label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() => setAmount(String(available))}
                >
                  سحب كامل الرصيد
                </button>
              </div>
              <Input
                id="wd-amount"
                inputMode="decimal"
                dir="ltr"
                className="text-start"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>طريقة السحب</Label>
              <FilterSelect
                label="طريقة السحب"
                value={method}
                onChange={setMethod}
                options={WITHDRAWAL_METHODS.map((m) => ({ value: m, label: m }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wd-recipient">بيانات الاستلام</Label>
              <Input
                id="wd-recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="رقم الحساب أو رقم الهاتف المسجل"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <p className="rounded-xl bg-surface-raised p-3.5 text-xs leading-6 text-muted-foreground">
              يُراجع كل طلب ويُتحقق من هوية صاحب الحساب قبل التنفيذ. تظهر أي رسوم تحويل قبل التأكيد
              النهائي.
            </p>
            <Button type="submit" variant="hero" className="w-full">
              مراجعة الطلب
            </Button>
          </form>
        </Panel>

        <Panel title="طلبات السحب">
          <div className={tableCls.wrap}>
            <table className={tableCls.table}>
              <thead>
                <tr>
                  {["رقم الطلب", "المبلغ", "الطريقة", "التاريخ", "الحالة"].map((h) => (
                    <th key={h} className={tableCls.th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {withdrawals.length === 0 && <EmptyRow colSpan={5} text="لا توجد طلبات سحب بعد." />}
                {withdrawals.map((w) => (
                  <tr key={w.id} className={tableCls.tr}>
                    <td data-label="رقم الطلب" className={tableCls.td}>
                      <span className="num text-muted-foreground">{w.id}</span>
                    </td>
                    <td data-label="المبلغ" className={tableCls.td}>
                      <span className="num font-semibold">{formatUSDFixed(w.amount)}</span>
                    </td>
                    <td data-label="الطريقة" className={tableCls.td}>
                      {w.method}
                    </td>
                    <td data-label="التاريخ" className={tableCls.td}>
                      {formatDate(w.date)}
                    </td>
                    <td data-label="الحالة" className={tableCls.td}>
                      <StatusBadge tone={withdrawalStatus[w.status].tone}>
                        {withdrawalStatus[w.status].label}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent className="border-border-strong bg-popover sm:rounded-2xl">
          <AlertDialogHeader className="text-start sm:text-start">
            <AlertDialogTitle>تأكيد طلب السحب</AlertDialogTitle>
            <AlertDialogDescription className="leading-7">
              ستطلب سحب{" "}
              <span className="num font-semibold text-foreground">
                {formatUSDFixed(value || 0)}
              </span>{" "}
              عبر «{method}». سيُراجع الطلب قبل التنفيذ. هذا نموذج تجريبي ولا يتم أي تحويل حقيقي.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>تراجع</AlertDialogCancel>
            <AlertDialogAction onClick={submit}>تأكيد الطلب</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
