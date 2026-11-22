import { Suspense, lazy, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Odometer } from "@/components/fx/Odometer";
import { GrowingPillar } from "@/components/fx/Pillar";
import { useMounted } from "@/components/fx/motion";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import {
  GROWTH_CEILING,
  MIN_INVESTMENT,
  PLANS,
  STARTER_CEILING,
  compareRenewal,
  estimateReturns,
} from "@/lib/plans";
import { formatPercent, formatUSDFixed } from "@/lib/format";
import { cn } from "@/lib/utils";
import { TIER_RULE_NOTE } from "./tier-note";

const CalcChart = lazy(() => import("./CalcChart"));

const MAX_SLIDER = 20000;
const DURATIONS = [1, 3, 6, 12, 24];
const QUICK = [50, 250, 1000, 5000];

// Log-scale slider so small amounts stay easy to pick.
const toAmount = (p: number) => {
  const raw = MIN_INVESTMENT * Math.pow(MAX_SLIDER / MIN_INVESTMENT, p / 100);
  if (raw < 100) return Math.round(raw);
  if (raw < 1000) return Math.round(raw / 10) * 10;
  return Math.round(raw / 50) * 50;
};
const toPosition = (amount: number) => {
  const a = Math.min(Math.max(amount, MIN_INVESTMENT), MAX_SLIDER);
  return (Math.log(a / MIN_INVESTMENT) / Math.log(MAX_SLIDER / MIN_INVESTMENT)) * 100;
};

export function Calculator() {
  const [input, setInput] = useState("500");
  const [months, setMonths] = useState(6);
  const amount = Number(input.replace(/,/g, ""));
  const valid = Number.isFinite(amount) && amount >= MIN_INVESTMENT;
  const result = estimateReturns(valid ? amount : 0, months);

  const mounted = useMounted();
  const chartData = useMemo(() => (valid ? compareRenewal(amount, 12) : []), [amount, valid]);
  const single = estimateReturns(valid ? amount : 0, 1);
  const markers = [
    { at: toPosition(STARTER_CEILING), label: `$${STARTER_CEILING}` },
    { at: toPosition(GROWTH_CEILING), label: `$${GROWTH_CEILING.toLocaleString("en-US")}` },
  ];
  const segments = [0, markers[0]!.at, markers[1]!.at, 100];

  return (
    <section id="calculator" className="relative py-16 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-1/3 h-96 bg-primary/5 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="حاسبة الاستثمار"
          title="احسب عائدك التقديري قبل أن تقرر."
          description="أدخل المبلغ واختر عدد الدورات الشهرية. تتحدد الخطة المناسبة تلقائياً، ويُحسب العائد على أصل المبلغ فقط دون إعادة استثمار الأرباح."
        />

        <Reveal className="mt-8 md:mt-14">
          <div className="spotlight relative grid rounded-3xl border border-border-strong bg-panel shadow-panel lg:grid-cols-[1fr_1.15fr]">
            {/* Inputs */}
            <div className="border-b border-border p-5 md:p-10 lg:border-b-0 lg:border-e">
              <label htmlFor="calc-amount" className="text-sm font-medium">
                مبلغ الاستثمار
              </label>
              <div className="relative mt-3" dir="ltr">
                <span className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 font-display text-2xl text-muted-foreground">
                  $
                </span>
                <Input
                  id="calc-amount"
                  inputMode="decimal"
                  dir="ltr"
                  value={input}
                  onChange={(e) => setInput(e.target.value.replace(/[^\d.]/g, ""))}
                  className="h-14 ps-10 text-start font-display text-2xl font-semibold sm:h-16 md:text-3xl"
                  aria-describedby="calc-amount-hint"
                />
              </div>
              <p
                id="calc-amount-hint"
                className={cn("mt-2 text-xs", valid ? "text-muted-foreground" : "text-destructive")}
              >
                {valid
                  ? `الحد الأدنى ${MIN_INVESTMENT}$ — لا يوجد حد أعلى`
                  : `الحد الأدنى للاستثمار هو ${MIN_INVESTMENT}$`}
              </p>

              {/* Phones: the answer right under the amount, before scrolling */}
              {valid && result.plan && (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-3.5 py-2.5 sm:hidden">
                  <span className="min-w-0 text-xs text-muted-foreground">
                    {result.plan.name} ·{" "}
                    <span className="num text-primary">
                      {formatPercent(result.plan.monthlyRate)}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    شهرياً{" "}
                    <span className="num text-sm font-semibold text-success">
                      {formatUSDFixed(result.monthlyReturn)}
                    </span>
                  </span>
                </div>
              )}

              <div className="relative mt-8 pb-12">
                {/* tier bands behind the track */}
                <div className="absolute inset-x-0 top-1.5 flex h-2 gap-0.5" aria-hidden="true">
                  {PLANS.map((p, i) => (
                    <div
                      key={p.id}
                      className={cn(
                        "h-full rounded-full transition-colors duration-500",
                        result.plan?.id === p.id ? "bg-primary/45" : "bg-border-strong",
                      )}
                      style={{ width: `${segments[i + 1]! - segments[i]!}%` }}
                    />
                  ))}
                </div>
                <Slider
                  className="relative [&_[data-orientation=horizontal]]:bg-transparent"
                  min={0}
                  max={100}
                  step={0.1}
                  value={[toPosition(valid ? amount : MIN_INVESTMENT)]}
                  onValueChange={([p]) => setInput(String(toAmount(p ?? 0)))}
                  aria-label="اختيار المبلغ"
                  aria-valuetext={valid ? `${amount} دولار، ${result.plan?.name ?? ""}` : undefined}
                />
                {markers.map((m) => (
                  <span
                    key={m.label}
                    className="absolute top-0 h-5 w-px -translate-x-1/2 bg-gold/70"
                    style={{ insetInlineStart: `${m.at}%` }}
                    aria-hidden="true"
                  >
                    <span className="num absolute top-6 -translate-x-1/2 whitespace-nowrap text-[10px] text-gold">
                      {m.label}
                    </span>
                  </span>
                ))}
                <div className="absolute inset-x-0 top-11 flex text-[11px]" aria-hidden="true">
                  {PLANS.map((p, i) => (
                    <span
                      key={p.id}
                      className={cn(
                        "truncate text-center transition-colors duration-500",
                        result.plan?.id === p.id ? "text-primary" : "text-muted-foreground",
                      )}
                      style={{ width: `${segments[i + 1]! - segments[i]!}%` }}
                    >
                      <span className="num">{formatPercent(p.monthlyRate)}</span>
                    </span>
                  ))}
                </div>
              </div>

              <p className="mb-4 mt-5 text-xs leading-6 text-muted-foreground">{TIER_RULE_NOTE}</p>

              <div className="mt-2 grid grid-cols-4 gap-2 sm:flex sm:flex-wrap">
                {QUICK.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setInput(String(q))}
                    className={cn(
                      "num min-h-10 rounded-full border px-2 py-1.5 text-xs transition-colors sm:min-h-9 sm:px-3.5",
                      amount === q
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border-strong text-muted-foreground hover:text-foreground",
                    )}
                  >
                    ${q.toLocaleString("en-US")}
                  </button>
                ))}
              </div>

              <div className="mt-8 md:mt-10">
                <p className="text-sm font-medium">المدة الافتراضية (عدد الدورات الشهرية)</p>
                <div
                  className="mt-3 grid grid-cols-5 gap-1.5 rounded-xl border border-border bg-background/40 p-1.5"
                  role="radiogroup"
                  aria-label="المدة"
                >
                  {DURATIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      role="radio"
                      aria-checked={months === d}
                      onClick={() => setMonths(d)}
                      className={cn(
                        "relative min-h-12 rounded-lg py-1.5 text-sm transition-colors",
                        months === d
                          ? "text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {months === d && (
                        <motion.span
                          layoutId="duration-pill"
                          className="absolute inset-0 rounded-lg bg-primary"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative block">
                        <span className="num block text-base font-semibold leading-5">{d}</span>
                        <span className="block text-[11px] leading-4">
                          {d === 1 ? "شهر" : d <= 10 ? "أشهر" : "شهراً"}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tier track (phones get the summary under the amount instead) */}
              <div className="mt-10 hidden sm:block">
                <p className="mb-3 text-sm font-medium">الخطة المطابقة للمبلغ</p>
                <div className="relative">
                  <div className="grid grid-cols-3 gap-1">
                    {PLANS.map((p) => (
                      <div
                        key={p.id}
                        className={cn(
                          "rounded-lg border px-2 py-2.5 text-center transition-all duration-500",
                          result.plan?.id === p.id
                            ? "border-primary/60 bg-primary/10"
                            : "border-border bg-background/30 opacity-60",
                        )}
                      >
                        <p className="text-xs font-semibold">{p.name}</p>
                        <p className="num mt-0.5 text-[11px] text-muted-foreground">
                          {formatPercent(p.monthlyRate)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex flex-col p-5 md:p-10">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="relative col-span-2 grid grid-cols-[minmax(0,1fr)_3.5rem] items-end gap-3 sm:grid-cols-[minmax(0,1fr)_5rem] sm:gap-4 overflow-hidden rounded-2xl border border-primary/30 bg-primary/5 p-5">
                  <div className="min-w-0">
                    <span className="mb-3 inline-flex rounded-full border border-gold/30 bg-gold-soft px-2.5 py-0.5 text-[11px] text-gold">
                      تقديري وغير مضمون
                    </span>
                    <p className="text-xs text-muted-foreground">
                      إجمالي القيمة الافتراضية بعد {months}{" "}
                      {months === 1 ? "شهر" : months <= 10 ? "أشهر" : "شهراً"}
                    </p>
                    <p className="mt-2 text-start font-display text-3xl font-semibold sm:text-4xl md:text-5xl">
                      <Odometer text={formatUSDFixed(result.finalValue)} />
                    </p>
                  </div>
                  <GrowingPillar
                    value={toPosition(valid ? amount : MIN_INVESTMENT) / 100}
                    className="w-14 sm:w-20"
                  />
                </div>
                <div className="min-w-0 rounded-2xl border border-border bg-background/30 p-4 sm:p-5">
                  <p className="text-xs text-muted-foreground">العائد الشهري التقديري</p>
                  <p className="mt-2 text-xl font-semibold text-success sm:text-2xl">
                    <Odometer text={formatUSDFixed(result.monthlyReturn)} />
                  </p>
                </div>
                <div className="min-w-0 rounded-2xl border border-border bg-background/30 p-4 sm:p-5">
                  <p className="text-xs text-muted-foreground">إجمالي العائد التقديري</p>
                  <p className="mt-2 text-xl font-semibold text-gold sm:text-2xl">
                    <Odometer text={formatUSDFixed(result.totalReturn)} />
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 text-xs">
                <p className="font-medium">عرض 12 شهراً</p>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="h-0.5 w-4 rounded bg-primary" />
                    مع التجديد
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-0.5 w-4 rounded border-t border-dashed border-chart-4" />
                    دون تجديد
                  </span>
                </div>
              </div>
              <div className="mt-3 h-44 flex-1 sm:h-52" dir="ltr">
                {chartData.length === 0 ? (
                  <div
                    className="grid h-full place-items-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground"
                    dir="rtl"
                  >
                    أدخل مبلغاً لا يقل عن {MIN_INVESTMENT}$ لعرض الرسم البياني
                  </div>
                ) : mounted ? (
                  <Suspense fallback={<Skeleton className="h-full w-full rounded-2xl" />}>
                    <CalcChart data={chartData} months={months} />
                  </Suspense>
                ) : (
                  <Skeleton className="h-full w-full rounded-2xl" />
                )}
              </div>
              {valid && (
                <p className="mt-3 text-xs leading-6 text-muted-foreground">
                  بعد 12 شهراً مع التجديد:{" "}
                  <span className="num font-semibold text-foreground">
                    {formatUSDFixed(chartData[12]?.withRenewal ?? 0)}
                  </span>{" "}
                  · دون تجديد (دورة واحدة):{" "}
                  <span className="num font-semibold text-foreground">
                    {formatUSDFixed(single.finalValue)}
                  </span>
                </p>
              )}

              <p className="mt-4 flex gap-2 text-xs leading-6 text-muted-foreground">
                <Info className="mt-1 h-3.5 w-3.5 shrink-0 text-gold" />
                نتائج تقديرية لأغراض التوضيح فقط، بافتراض تحقق النسبة المستهدفة في كل دورة وتجديد
                أصل المبلغ. العائد الفعلي قد يكون أقل وغير مضمون.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
