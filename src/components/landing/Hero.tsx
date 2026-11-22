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
      className="relative overflow-hidden bg-hero pb-24 pt-32 md:min-h-[100svh] md:pb-32 md:pt-40"
    >
      <Aurora intensity="normal" />
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
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
            className="mt-7 text-[2.5rem] font-semibold leading-[1.2] text-foreground sm:text-5xl md:text-6xl md:leading-[1.15] xl:text-7xl xl:leading-[1.1]"
            delay={0.15}
          />

          <motion.p
            {...fade(0.7)}
            className="mt-7 max-w-xl text-lg leading-9 text-muted-foreground"
          >
            خطط استثمار شهرية بالدولار تبدأ من <span className="num">{MIN_INVESTMENT}$</span>،
            بعوائد مستهدفة معلنة مسبقاً، وشروط مكتوبة بلغة واضحة، ولوحة متابعة ترى فيها كل دورة وكل
            عملية.
          </motion.p>

          <motion.div {...fade(0.85)} className="mt-10 flex flex-wrap gap-3">
            <Button variant="hero" size="lg" className="shine" asChild>
              <Link to="/plans">
                اكتشف الخطط الاستثمارية
                <ArrowUpLeft />
              </Link>
            </Button>
            <Button variant="glass" size="lg" asChild>
              <Link to="/how-it-works">
                <PlayCircle />
                تعرّف على آلية العمل
              </Link>
            </Button>
          </motion.div>

          <motion.dl
            {...fade(1)}
            className="mt-14 grid max-w-lg grid-cols-3 divide-x divide-x-reverse divide-border border-t border-border pt-6"
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
        </motion.div>

        <motion.div style={{ y: visualY }} className="relative mx-auto w-full max-w-md">
          <div className="pointer-events-none absolute inset-x-[10%] bottom-[18%] top-[20%] rounded-full bg-primary/15 blur-3xl" />
          <PillarEmblem className="relative mx-auto max-w-[22rem] sm:max-w-none" delay={0.35} />
          <motion.ul
            initial="off"
            animate="on"
            variants={{ on: { transition: { staggerChildren: 0.1, delayChildren: 1.9 } } }}
            className="relative mt-8 grid grid-cols-3 gap-2 text-center"
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
                <p className="text-[10px] text-gold">مستهدف شهرياً · غير مضمون</p>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
