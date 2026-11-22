import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader, Panel } from "@/components/app/ui";
import { PlanGlyph } from "@/components/landing/PlanGlyph";
import { demoActions, useDemoStore } from "@/lib/demo-store";
import { estimateReturns, type Plan } from "@/lib/plans";
import { formatPercent, formatUSDFixed } from "@/lib/format";

export const Route = createFileRoute("/admin/plans")({
  head: () => ({
    meta: [{ title: "الخطط ونسب العوائد — إدارة ركيزة" }, { name: "robots", content: "noindex" }],
  }),
  component: PlansAdmin,
});

function PlansAdmin() {
  const plans = useDemoStore((s) => s.plans);
  const investmentRequests = useDemoStore((s) => s.investmentRequests);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [form, setForm] = useState({ name: "", rate: "", tagline: "" });
  const [error, setError] = useState<string | null>(null);

  const open = (p: Plan) => {
    setEditing(p);
    setForm({ name: p.name, rate: String(+(p.monthlyRate * 100).toFixed(2)), tagline: p.tagline });
    setError(null);
  };

  const save = () => {
    if (!editing) return;
    const rate = Number(form.rate);
    if (!Number.isFinite(rate) || rate < 0 || rate > 20) return setError("أدخل نسبة بين 0% و20%.");
    if (form.name.trim().length < 3) return setError("أدخل اسماً للخطة.");
    demoActions.updatePlan(editing.id, {
      name: form.name.trim(),
      monthlyRate: rate / 100,
      tagline: form.tagline.trim(),
    });
    toast.success(`تم تحديث ${form.name}`, {
      description: "التعديل محفوظ في هذه الجلسة التجريبية فقط.",
    });
    setEditing(null);
  };

  return (
    <>
      <PageHeader
        title="الخطط ونسب العوائد"
        description="عدّل أسماء الخطط ونسب العائد الشهري المستهدفة. الحدود المالية ثابتة وفق سياسة المنصة."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((p, i) => {
          const count = investmentRequests.filter(
            (r) => r.planId === p.id && r.status === "approved",
          ).length;
          return (
            <Panel key={p.id} className="p-6">
              <div className="flex items-start justify-between">
                <PlanGlyph level={(i + 1) as 1 | 2 | 3} />
                <Button variant="outline" size="sm" onClick={() => open(p)}>
                  <Pencil />
                  تعديل
                </Button>
              </div>
              <h2 className="mt-5 text-xl font-semibold">{p.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{p.rangeLabel}</p>
              <p className="num mt-5 text-end font-display text-5xl font-semibold text-primary">
                {formatPercent(p.monthlyRate)}
              </p>
              <p className="mt-1 text-xs text-gold">عائد شهري مستهدف</p>
              <dl className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">استثمارات مقبولة</dt>
                  <dd className="num">{count}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">مثال ({p.exampleAmount}$ / دورة)</dt>
                  <dd className="num text-primary">
                    {formatUSDFixed(estimateReturns(p.exampleAmount, 1, plans).monthlyReturn)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">مدة الدورة</dt>
                  <dd>شهر واحد</dd>
                </div>
              </dl>
            </Panel>
          );
        })}
      </div>
      <p className="mt-6 text-xs leading-6 text-muted-foreground">
        ملاحظة: في هذا النموذج تُحفظ التعديلات مؤقتاً داخل الجلسة ولا تؤثر على الصفحات العامة. تتطلب
        أي تغييرات فعلية على النسب ربط نظام خلفي آمن وإشعار المستثمرين مسبقاً.
      </p>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="border-border-strong bg-popover sm:rounded-2xl">
          <DialogHeader className="text-start sm:text-start">
            <DialogTitle>تعديل الخطة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pl-name">اسم الخطة</Label>
              <Input
                id="pl-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pl-rate">النسبة الشهرية المستهدفة (%)</Label>
              <Input
                id="pl-rate"
                dir="ltr"
                inputMode="decimal"
                className="text-start"
                value={form.rate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, rate: e.target.value.replace(/[^\d.]/g, "") }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pl-tag">الوصف المختصر</Label>
              <Textarea
                id="pl-tag"
                value={form.tagline}
                onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              إلغاء
            </Button>
            <Button variant="hero" onClick={save}>
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
