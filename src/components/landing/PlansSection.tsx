import { useState } from "react";
import { ArrowUpLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { RiskNotice } from "@/components/site/RiskNotice";
import { PLANS, estimateReturns, type Plan } from "@/lib/plans";
import { formatUSD, formatUSDFixed } from "@/lib/format";
import { cn } from "@/lib/utils";
import { PlanDetailsDialog } from "./PlanDetailsDialog";
import { PlanGlyph } from "./PlanGlyph";
import { TIER_RULE_NOTE } from "./tier-note";
import { Tilt } from "@/components/fx/Tilt";
import { CountUp } from "@/components/fx/CountUp";

function PlanCard({
  plan,
  index,
  onDetails,
}: {
  plan: Plan;
  index: number;
  onDetails: () => void;
}) {
  const featured = plan.id === "growth";
  const example = estimateReturns(plan.exampleAmount, 1);
  return (
    <Reveal delay={index * 0.12} className={cn("relative h-full", featured && "lg:-mt-6")}>
      <Tilt className="h-full" max={5}>
        <article
          className={cn(
            "spotlight lift group relative flex h-full flex-col rounded-3xl border p-7 transition-[border-color,box-shadow] duration-500 md:p-8",
            featured
              ? "border-primary/40 bg-featured shadow-glow"
              : "border-border bg-panel hover:border-border-strong",
          )}
        >
          {featured && (
            <span className="absolute left-6 top-6 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] text-primary">
              خيار متوازن
            </span>
          )}
          <div className="flex items-center gap-3">
            <PlanGlyph level={(index + 1) as 1 | 2 | 3} />
            <span className="num text-xs text-muted-foreground">0{index + 1}</span>
          </div>

          <h3 className="mt-6 text-2xl font-semibold">{plan.name}</h3>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{plan.tagline}</p>

          <div className="mt-7 flex items-end gap-3">
            <CountUp
              to={Math.round(plan.monthlyRate * 100)}
              suffix="%"
              duration={1.4}
              className="num font-display text-6xl font-semibold leading-none text-foreground"
            />
            <span className="pb-1 text-sm leading-5 text-muted-foreground">
              عائد شهري
              <br />
              <span className="text-gold">مستهدف</span>
            </span>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-background/40 p-4">
            <p className="text-xs text-muted-foreground">الحد المالي</p>
            <p className="mt-1 font-semibold">{plan.rangeLabel}</p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">{TIER_RULE_NOTE}</p>
            <div className="hairline-gold my-3 opacity-50" />
            <p className="text-xs text-muted-foreground">مثال توضيحي</p>
            <p className="mt-1 text-sm leading-7">
              استثمار <span className="num font-semibold">{formatUSD(plan.exampleAmount)}</span>{" "}
              لدورة واحدة ← عائد تقديري{" "}
              <span className="num font-semibold text-success">
                {formatUSDFixed(example.monthlyReturn)}
              </span>
            </p>
          </div>

          <ul className="mt-6 space-y-2.5 text-sm text-foreground/80">
            {[
              "دورة مدتها شهر قابلة للتجديد",
              "حساب على أصل المبلغ فقط",
              "عائد تقديري غير مضمون",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <Check className="h-4 w-4 shrink-0 text-success" />
                {t}
              </li>
            ))}
          </ul>

          <Button
            variant={featured ? "hero" : "outline"}
            size="lg"
            className="mt-8 w-full"
            onClick={onDetails}
          >
            عرض التفاصيل والشروط
            <ArrowUpLeft />
          </Button>
        </article>
      </Tilt>
    </Reveal>
  );
}

export function PlansSection({ showHeading = true }: { showHeading?: boolean }) {
  const [selected, setSelected] = useState<Plan | null>(null);
  return (
    <section id="plans" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {showHeading && (
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="الخطط الاستثمارية"
              title="ثلاثة مستويات، ونسبة معلنة لكل منها."
              description="تُحدَّد الخطة تلقائياً حسب المبلغ الذي تستثمره. كل خطة لها حد مالي ونسبة عائد شهري مستهدفة وشروط مكتوبة."
            />
          </div>
        )}
        <div className={cn("grid gap-6 lg:grid-cols-3 lg:items-stretch", showHeading && "mt-16")}>
          {PLANS.map((p, i) => (
            <PlanCard key={p.id} plan={p} index={i} onDetails={() => setSelected(p)} />
          ))}
        </div>
        <Reveal className="mt-10">
          <RiskNotice />
        </Reveal>
      </div>
      <PlanDetailsDialog plan={selected} onOpenChange={(o) => !o && setSelected(null)} />
    </section>
  );
}
