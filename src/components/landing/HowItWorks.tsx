import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowLeftRight, CalendarCheck, FileSearch, Power, Wallet } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { DrawCheck } from "@/components/fx/DrawCheck";
import { EASE, useMounted } from "@/components/fx/motion";
import { cn } from "@/lib/utils";

/** One monthly cycle, start to finish. */
export const CYCLE = [
  {
    icon: Wallet,
    day: "اليوم 0",
    title: "الإيداع",
    text: "تقدّم طلب الاستثمار بالمبلغ الذي تختاره، وتصلك تعليمات الإيداع بعد قبول الطلب.",
  },
  {
    icon: FileSearch,
    day: "اليوم 0–2",
    title: "المراجعة",
    text: "يُراجع الفريق الطلب ويتحقق من الإيداع والهوية قبل أي تفعيل.",
  },
  {
    icon: Power,
    day: "اليوم 1",
    title: "التفعيل",
    text: "تبدأ الدورة رسمياً، ويظهر تاريخ الاستحقاق والعائد التقديري في لوحتك.",
  },
  {
    icon: CalendarCheck,
    day: "اليوم 30",
    title: "الاستحقاق",
    text: "تنتهي الدورة ويُسجَّل العائد الفعلي، وقد يختلف عن المستهدف أو يكون صفراً.",
  },
  {
    icon: ArrowLeftRight,
    day: "بعد الاستحقاق",
    title: "سحب أو تجديد",
    text: "تختار سحب الرصيد أو تجديد دورة جديدة بطلب منك — لا شيء يتجدد تلقائياً.",
  },
];

function Heading() {
  return (
    <SectionHeading
      eyebrow="كيف تعمل المنصة؟"
      title="دورة واحدة، من الإيداع إلى القرار."
      description="هكذا تمر كل دورة استثمارية مدتها شهر. كل خطوة ظاهرة في لوحة التحكم، ولا تنتقل لما بعدها دون علمك."
      align="center"
    />
  );
}

/** Desktop: pinned section — a line draws along the cycle as you scroll, each step checks itself off. */
function PinnedTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const line = useTransform(progress, [0.05, 0.9], [0, 1]);
  const [active, setActive] = useState(-1);
  useMotionValueEvent(line, "change", (v) => {
    const n =
      v <= 0.001 ? -1 : Math.min(CYCLE.length - 1, Math.floor(v * (CYCLE.length - 1) + 0.15));
    setActive((a) => (a === n ? a : n));
  });

  return (
    <div ref={ref} className="relative hidden h-[300vh] lg:block">
      <div className="sticky top-0 flex h-screen flex-col justify-center">
        <Heading />
        <div className="relative mt-20">
          {/* track + drawn line (RTL: flows right → left) */}
          <div
            className="absolute inset-x-[10%] top-7 h-[2px] rounded-full bg-border-strong"
            aria-hidden="true"
          >
            <motion.div
              className="h-full origin-right rounded-full bg-gradient-to-l from-primary to-primary-glow"
              style={{ scaleX: line }}
            />
          </div>
          <ol className="relative grid grid-cols-5 gap-6">
            {CYCLE.map((s, i) => {
              const on = i <= active;
              return (
                <li key={s.title} className="flex flex-col items-center text-center">
                  <div
                    className={cn(
                      "relative z-10 grid h-14 w-14 place-items-center rounded-2xl border bg-surface transition-[border-color,box-shadow] duration-700",
                      on ? "border-primary/60 shadow-glow" : "border-border-strong",
                    )}
                  >
                    <s.icon
                      className={cn(
                        "h-6 w-6 transition-colors duration-700",
                        on ? "text-primary" : "text-muted-foreground",
                      )}
                      strokeWidth={1.6}
                    />
                    <span className="absolute -bottom-2 -start-2 grid h-6 w-6 place-items-center rounded-full bg-background">
                      <DrawCheck show={on} className="h-6 w-6" />
                    </span>
                  </div>
                  <p
                    className={cn(
                      "mt-5 text-xs transition-colors duration-700",
                      on ? "text-gold" : "text-muted-foreground",
                    )}
                  >
                    {s.day}
                  </p>
                  <h3 className="mt-1 font-sans text-lg font-semibold">{s.title}</h3>
                  <motion.p
                    animate={{ opacity: on ? 1 : 0.45 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="mt-2 text-sm leading-7 text-muted-foreground"
                  >
                    {s.text}
                  </motion.p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

/** Mobile and reduced motion: a simple stacked reveal. */
function StackedTimeline({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Heading />
      <ol className="relative mt-14 space-y-8 border-s border-border-strong ps-8">
        {CYCLE.map((s, i) => (
          <li key={s.title} className="relative">
            <Reveal delay={i * 0.06} y={16}>
              <span className="absolute -start-[2.85rem] top-0 grid h-7 w-7 place-items-center rounded-full bg-background">
                <DrawCheck delay={0.1} className="h-7 w-7" />
              </span>
              <p className="text-xs text-gold">{s.day}</p>
              <h3 className="mt-1 flex items-center gap-2 font-sans text-lg font-semibold">
                <s.icon className="h-4 w-4 text-primary" />
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{s.text}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function HowItWorks() {
  // Decide after hydration so server and client render the same tree first.
  const mounted = useMounted();
  const reduce = useReducedMotion() && mounted;
  return (
    <section id="how" className="relative py-24 lg:py-0">
      <div className="mx-auto max-w-7xl px-6">
        {reduce ? (
          <StackedTimeline className="lg:py-32" />
        ) : (
          <>
            <PinnedTimeline />
            <StackedTimeline className="lg:hidden" />
          </>
        )}
      </div>
    </section>
  );
}
