import { useRef, useState } from "react";
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
    <div
      className={cn(
        "relative w-[84%] shrink-0 snap-center sm:w-[58%] lg:h-full lg:w-auto",
        featured && "lg:-mt-6",
      )}
    >
      <Tilt className="h-full" max={5}>
        <article
          className={cn(
            "spotlight lift group relative flex h-full flex-col rounded-3xl border p-5 transition-[border-color,box-shadow] duration-500 sm:p-7 md:p-8",
            featured
              ? "border-primary/40 bg-featured shadow-glow"
              : "border-border bg-panel hover:border-border-strong",
          )}
        >
          {featured && (
            <span className="absolute left-5 top-5 rounded-full sm:left-6 sm:top-6 border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] text-primary">
              خيار متوازن
            </span>
          )}
          <div className="flex items-center gap-3">
            <PlanGlyph level={(index + 1) as 1 | 2 | 3} />
            <span className="num text-xs text-muted-foreground">0{index + 1}</span>
          </div>

          <h3 className="mt-4 text-xl font-semibold sm:mt-6 sm:text-2xl">{plan.name}</h3>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground sm:mt-2 sm:leading-7">
            {plan.tagline}
          </p>

          <div className="mt-5 flex items-end gap-3 sm:mt-7">
            <CountUp
              to={Math.round(plan.monthlyRate * 100)}
              suffix="%"
              duration={1.4}
              className="num font-display text-5xl font-semibold leading-none text-foreground sm:text-6xl"
            />
            <span className="pb-1 text-sm leading-5 text-muted-foreground">
              عائد شهري
              <br />
              <span className="text-gold">مستهدف</span>
            </span>
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-background/40 p-4 sm:mt-6">
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

          <ul className="mt-5 space-y-2 text-sm text-foreground/80 sm:mt-6 sm:space-y-2.5">
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
            className="mt-6 w-full sm:mt-8"
            onClick={onDetails}
          >
            عرض التفاصيل والشروط
            <ArrowUpLeft />
          </Button>
        </article>
      </Tilt>
    </div>
  );
}

/** Phones: one card at a time with a swipe and dots. Desktop: three columns. */
function PlanStrip({ onDetails }: { onDetails: (p: Plan) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const cards = () => Array.from(ref.current?.children ?? []) as HTMLElement[];
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const mid = el.getBoundingClientRect().left + el.clientWidth / 2;
    let best = 0;
    let dist = Infinity;
    cards().forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - mid);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    setActive((a) => (a === best ? a : best));
  };
  const goTo = (i: number) =>
    cards()[i]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });

  return (
    <>
      <div
        ref={ref}
        onScroll={onScroll}
        className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-4 pt-1 lg:mx-0 lg:grid lg:grid-cols-3 lg:items-stretch lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0 lg:pt-0"
      >
        {PLANS.map((p, i) => (
          <PlanCard key={p.id} plan={p} index={i} onDetails={() => onDetails(p)} />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-center gap-2 lg:hidden">
        {PLANS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`عرض ${p.name}`}
            aria-current={active === i}
            className="grid h-8 w-8 place-items-center"
          >
            <span
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                active === i ? "w-6 bg-primary" : "w-2 bg-border-strong",
              )}
            />
          </button>
        ))}
      </div>
    </>
  );
}

export function PlansSection({ showHeading = true }: { showHeading?: boolean }) {
  const [selected, setSelected] = useState<Plan | null>(null);
  return (
    <section id="plans" className="relative py-16 md:py-32">
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
        <Reveal className={cn(showHeading && "mt-8 md:mt-16")}>
          <PlanStrip onDetails={setSelected} />
        </Reveal>
        <Reveal className="mt-6 md:mt-10">
          <RiskNotice />
        </Reveal>
      </div>
      <PlanDetailsDialog plan={selected} onOpenChange={(o) => !o && setSelected(null)} />
    </section>
  );
}
