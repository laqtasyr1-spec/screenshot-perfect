import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpLeft, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Aurora } from "@/components/fx/Aurora";
import { SplitText } from "@/components/fx/SplitText";
import { CountUp } from "@/components/fx/CountUp";
import { PillarEmblem } from "@/components/fx/Pillar";
import { EASE } from "@/components/fx/motion";
import { MIN_INVESTMENT, PLANS } from "@/lib/plans";
import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.8, ease: EASE },
});

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-hero pb-14 pt-24 md:min-h-[100svh] md:pb-32 md:pt-40"
    >
      <Aurora intensity="normal" />
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-6 sm:gap-12 lg:grid-cols-[1.1fr_1fr]">
        <motion.div style={{ y: textY, opacity: fadeOut }}>
          <motion.div
            {...fade(0)}
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold-soft px-3.5 py-1.5 text-xs text-gold"
          >
            <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
            منصة استثمار رقمية للمستثمرين في سوريا
          </motion.div>

          <SplitText
            text="ابنِ مستقبلك المالي | على *ركيزة* واضحة."
            className="mt-5 text-[2.15rem] font-semibold leading-[1.25] text-foreground sm:mt-7 sm:text-5xl md:text-6xl md:leading-[1.15] xl:text-7xl xl:leading-[1.1]"
            delay={0.15}
          />

          <motion.p
            {...fade(0.7)}
            className="mt-4 max-w-xl text-base leading-8 text-muted-foreground sm:mt-7 sm:text-lg sm:leading-9"
          >
            <span className="sm:hidden">
              خطط شهرية بالدولار من <span className="num">{MIN_INVESTMENT}$</span>، بنسب معلنة وشروط
              واضحة.
            </span>
            <span className="hidden sm:inline">
              خطط استثمار شهرية بالدولار تبدأ من <span className="num">{MIN_INVESTMENT}$</span>،
              بعوائد مستهدفة معلنة مسبقاً، وشروط مكتوبة بلغة واضحة، ولوحة متابعة ترى فيها كل دورة
              وكل عملية.
            </span>
          </motion.p>

          <motion.div
            {...fade(0.85)}
            className="mt-7 grid gap-2.5 sm:mt-10 sm:flex sm:flex-wrap sm:gap-3"
          >
            <Button variant="hero" size="lg" className="shine w-full sm:w-auto" asChild>
              <Link to="/plans">
                اكتشف الخطط الاستثمارية
                <ArrowUpLeft />
              </Link>
            </Button>
            <Button variant="glass" size="lg" className="w-full sm:w-auto" asChild>
              <Link to="/how-it-works">
                <PlayCircle />
                تعرّف على آلية العمل
              </Link>
            </Button>
          </motion.div>

          <motion.dl
            {...fade(1)}
            className="mt-14 hidden max-w-lg grid-cols-3 sm:grid divide-x divide-x-reverse divide-border border-t border-border pt-6"
          >
            <div className="px-4 first:ps-0">
              <dt className="sr-only">الحد الأدنى للاستثمار</dt>
              <dd className="font-display text-3xl font-semibold text-foreground">
                <CountUp to={MIN_INVESTMENT} suffix="$" className="num" duration={1.2} />
              </dd>
              <dd className="mt-1 text-xs leading-5 text-muted-foreground">
                الحد الأدنى للاستثمار
              </dd>
            </div>
            <div className="px-4">
              <dt className="sr-only">مدة الدورة</dt>
              <dd className="font-display text-3xl font-semibold text-foreground">شهر</dd>
              <dd className="mt-1 text-xs leading-5 text-muted-foreground">مدة الدورة الواحدة</dd>
            </div>
            <div className="px-4">
              <dt className="sr-only">عدد الخطط</dt>
              <dd className="font-display text-3xl font-semibold text-foreground">
                <CountUp to={PLANS.length} className="num" duration={1.2} />
              </dd>
              <dd className="mt-1 text-xs leading-5 text-muted-foreground">
                خطط بنسب معلنة مسبقاً
              </dd>
            </div>
          </motion.dl>

          <PlanChips className="mt-7 lg:hidden" delay={1} />
        </motion.div>

        <motion.div
          style={{ y: visualY }}
          className="relative mx-auto w-full max-w-md -order-1 lg:order-none"
        >
          <div className="pointer-events-none absolute inset-x-[10%] bottom-[18%] top-[20%] rounded-full bg-primary/15 blur-3xl" />
          <PillarEmblem
            className="relative mx-auto max-w-[12.5rem] sm:max-w-[20rem] lg:max-w-none"
            delay={0.35}
          />
          <PlanChips className="mt-8 hidden lg:grid" delay={1.9} />
        </motion.div>
      </div>
    </section>
  );
}

/** The three plan rates — beside the emblem on desktop, under the buttons on phones. */
function PlanChips({ className, delay }: { className?: string; delay: number }) {
  return (
    <motion.ul
      initial="off"
      animate="on"
      variants={{ on: { transition: { staggerChildren: 0.1, delayChildren: delay } } }}
      className={cn("relative grid grid-cols-3 gap-2 text-center", className)}
    >
      {PLANS.map((p) => (
        <motion.li
          key={p.id}
          variants={{
            off: { opacity: 0, y: 8 },
            on: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
          }}
          className="rounded-xl border border-border bg-surface/70 px-2 py-3"
        >
          <p className="text-xs text-muted-foreground">{p.name}</p>
          <p className="num mt-1 font-display text-xl font-semibold">
            {formatPercent(p.monthlyRate)}
          </p>
          <p className="text-[10px] leading-4 text-gold">مستهدف شهرياً · غير مضمون</p>
        </motion.li>
      ))}
    </motion.ul>
  );
}
