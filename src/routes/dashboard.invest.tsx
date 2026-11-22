import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { FilterSelect, PageHeader, Panel } from "@/components/app/ui";
import { RiskNotice } from "@/components/site/RiskNotice";
import { PlanGlyph } from "@/components/landing/PlanGlyph";
import { demoActions, useDemoStore } from "@/lib/demo-store";
import { MIN_INVESTMENT, estimateReturns } from "@/lib/plans";
import { WITHDRAWAL_METHODS } from "@/lib/demo-data";
import { addMonthsISO, formatDate, formatPercent, formatUSD, formatUSDFixed } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/invest")({
  head: () => ({
    meta: [{ title: "طلب استثمار جديد — ركيزة" }, { name: "robots", content: "noindex" }],
  }),
  component: InvestPage,
});

function InvestPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState("250");
  const [method, setMethod] = useState(WITHDRAWAL_METHODS[0] ?? "");
  const [agree, setAgree] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const amount = Number(input);
  const plans = useDemoStore((s) => s.plans);
  const est = estimateReturns(amount, 1, plans);
  const valid = !!est.plan;
  const today = new Date().toISOString().slice(0, 10);

  const submit = () => {
    const id = demoActions.requestInvestment(amount);
    setConfirm(false);
    if (id) {
      toast.success("تم تسجيل طلب الاستثمار", {
        description: "حالته الآن «قيد المراجعة». لم يُخصم أي مبلغ فعلي.",
      });
      navigate({ to: "/dashboard/investments" });
    }
  };

  return (
    <>
      <PageHeader
        title="طلب استثمار جديد"
        description="أدخل المبلغ لتُحدَّد الخطة تلقائياً، ثم راجع التفاصيل قبل الإرسال."
      />
      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Panel className="p-6 md:p-8">
          <div className="space-y-2">
            <Label htmlFor="inv-amount">مبلغ الاستثمار (دولار)</Label>
            <Input
              id="inv-amount"
              inputMode="decimal"
              dir="ltr"
              className="h-14 text-start font-display text-2xl font-semibold"
              value={input}
              onChange={(e) => setInput(e.target.value.replace(/[^\d.]/g, ""))}
            />
            {!valid && (
              <p className="text-xs text-destructive">الحد الأدنى للاستثمار {MIN_INVESTMENT}$.</p>
            )}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {plans.map((p, i) => (
              <div
                key={p.id}
                className={cn(
                  "rounded-2xl border p-4 transition-all duration-500",
                  est.plan?.id === p.id
                    ? "border-primary/50 bg-primary/10"
                    : "border-border opacity-55",
                )}
              >
                <div className="flex items-center justify-between">
                  <PlanGlyph level={(i + 1) as 1 | 2 | 3} className="h-6 w-8" />
                  {est.plan?.id === p.id && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </div>
                <p className="mt-3 text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.rangeLabel}</p>
                <p className="num mt-2 text-end text-lg font-semibold text-primary">
                  {formatPercent(p.monthlyRate)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-2">
            <Label>طريقة الإيداع المفضلة</Label>
            <FilterSelect
              label="طريقة الإيداع"
              value={method}
              onChange={setMethod}
              options={WITHDRAWAL_METHODS.map((m) => ({ value: m, label: m }))}
            />
            <p className="text-xs leading-6 text-muted-foreground">
              ستصلك تعليمات الإيداع بعد قبول الطلب. لا تحوّل أي مبلغ قبل ذلك.
            </p>
          </div>

          <div className="mt-8 flex items-start gap-3">
            <Checkbox
              id="inv-agree"
              checked={agree}
              onCheckedChange={(v) => setAgree(v === true)}
              className="mt-1"
            />
            <Label
              htmlFor="inv-agree"
              className="text-sm font-normal leading-6 text-muted-foreground"
            >
              قرأت شروط الخطة والإفصاح عن المخاطر، وأفهم أن العائد مستهدف وغير مضمون وأن رأس المال
              قد يتعرض للخسارة.{" "}
              <Link to="/about" className="text-primary hover:underline">
                الشروط
              </Link>
            </Label>
          </div>

          <Button
            variant="hero"
            size="lg"
            className="mt-8 w-full sm:w-auto"
            disabled={!valid || !agree}
            onClick={() => setConfirm(true)}
          >
            مراجعة وإرسال الطلب
          </Button>
        </Panel>

        <div className="space-y-6">
          <Panel title="ملخص الطلب">
            <dl className="divide-y divide-border text-sm">
              {[
                ["الخطة", est.plan?.name ?? "—"],
                ["المبلغ", valid ? formatUSD(amount) : "—"],
                ["النسبة الشهرية المستهدفة", est.plan ? formatPercent(est.plan.monthlyRate) : "—"],
                ["مدة الدورة", "شهر واحد"],
                [
                  "الاستحقاق المتوقع",
                  valid ? `${formatDate(addMonthsISO(today, 1))} تقريباً` : "—",
                ],
                ["العائد التقديري للدورة", valid ? formatUSDFixed(est.monthlyReturn) : "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between px-5 py-3.5">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Panel>
          <RiskNotice />
        </div>
      </div>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent className="border-border-strong bg-popover sm:rounded-2xl">
          <AlertDialogHeader className="text-start sm:text-start">
            <AlertDialogTitle>تأكيد طلب الاستثمار</AlertDialogTitle>
            <AlertDialogDescription className="leading-7">
              ستقدّم طلباً بمبلغ{" "}
              <span className="num font-semibold text-foreground">{formatUSD(amount)}</span> ضمن{" "}
              {est.plan?.name}. سيُراجع الطلب قبل قبوله، وهذا نموذج تجريبي لا يُنفذ أي عملية مالية
              حقيقية.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>تراجع</AlertDialogCancel>
            <AlertDialogAction onClick={submit}>تأكيد الإرسال</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
