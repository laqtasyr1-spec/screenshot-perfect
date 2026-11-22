import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RiskNotice } from "@/components/site/RiskNotice";
import { estimateReturns, type Plan } from "@/lib/plans";
import { formatPercent, formatUSD, formatUSDFixed } from "@/lib/format";

interface Props {
  plan: Plan | null;
  onOpenChange: (open: boolean) => void;
}

export function PlanDetailsDialog({ plan, onOpenChange }: Props) {
  return (
    <Dialog open={!!plan} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border-strong bg-popover sm:max-w-2xl sm:rounded-2xl">
        {plan && (
          <>
            <DialogHeader className="text-start sm:text-start">
              <p className="text-xs text-gold">{plan.rangeLabel}</p>
              <DialogTitle className="font-display text-3xl font-semibold">{plan.name}</DialogTitle>
              <DialogDescription className="leading-7">{plan.tagline}</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-surface-raised p-4">
                <p className="text-xs text-muted-foreground">العائد الشهري المستهدف</p>
                <p className="num mt-1 text-end text-2xl font-semibold text-primary">
                  {formatPercent(plan.monthlyRate)}
                </p>
              </div>
              <div className="rounded-xl bg-surface-raised p-4">
                <p className="text-xs text-muted-foreground">مدة الدورة</p>
                <p className="mt-1 text-2xl font-semibold">شهر واحد</p>
              </div>
              <div className="col-span-2 rounded-xl bg-surface-raised p-4 sm:col-span-1">
                <p className="text-xs text-muted-foreground">الحد المالي</p>
                <p className="mt-1 text-base font-semibold">{plan.rangeLabel}</p>
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold">
                مثال حسابي على {formatUSD(plan.exampleAmount)}
              </h4>
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-surface-raised text-xs text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2.5 text-start font-medium">عدد الدورات</th>
                      <th className="px-4 py-2.5 text-start font-medium">إجمالي العائد التقديري</th>
                      <th className="px-4 py-2.5 text-start font-medium">القيمة الافتراضية</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 3, 6, 12].map((m) => {
                      const r = estimateReturns(plan.exampleAmount, m);
                      return (
                        <tr key={m} className="border-t border-border">
                          <td className="px-4 py-2.5">{m === 1 ? "دورة واحدة" : `${m} دورات`}</td>
                          <td className="px-4 py-2.5">
                            <span className="num text-success">
                              {formatUSDFixed(r.totalReturn)}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="num">{formatUSDFixed(r.finalValue)}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                الحساب بسيط على أصل المبلغ، بافتراض تجديد الدورة شهرياً وسحب الأرباح دون إعادة
                استثمارها.
              </p>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold">الشروط والأحكام</h4>
              <ul className="space-y-2.5">
                {plan.terms.map((t) => (
                  <li key={t} className="flex gap-2.5 text-sm leading-7 text-foreground/85">
                    <Check className="mt-1.5 h-4 w-4 shrink-0 text-success" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <RiskNotice compact />

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="hero" size="lg" className="flex-1" asChild>
                <Link to="/register">إنشاء حساب وتقديم طلب</Link>
              </Button>
              <Button variant="outline" size="lg" onClick={() => onOpenChange(false)}>
                إغلاق
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
