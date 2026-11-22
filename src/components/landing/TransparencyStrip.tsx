import { motion } from "framer-motion";
import { DrawCheck } from "@/components/fx/DrawCheck";
import { EASE } from "@/components/fx/motion";
import { MIN_INVESTMENT, PLANS, TERM_MONTHS } from "@/lib/plans";

const TERMS = [
  {
    key: "min",
    title: (
      <>
        الحد الأدنى <span className="num">{MIN_INVESTMENT}$</span>
      </>
    ),
    text: "ابدأ بمبلغ صغير وافهم المنصة أولاً.",
  },
  {
    key: "term",
    title:
      TERM_MONTHS === 1 ? (
        "دورة مدتها شهر"
      ) : (
        <>
          دورة مدتها <span className="num">{TERM_MONTHS}</span> أشهر
        </>
      ),
    text: "قابلة للتجديد أو السحب عند الاستحقاق.",
  },
  {
    key: "plans",
    title: (
      <>
        <span className="num">{PLANS.length}</span> خطط معلنة
      </>
    ),
    text: "نسبة مستهدفة لكل خطة، مكتوبة مسبقاً.",
  },
  {
    key: "risk",
    title: "المخاطر مُفصح عنها",
    text: "العائد تقديري وغير مضمون، وقد يُخسر رأس المال.",
  },
];

/** Key terms that check themselves off as they scroll into view. */
export function TransparencyStrip() {
  return (
    <section aria-label="الشروط الأساسية" className="border-y border-border bg-sidebar/60">
      <motion.ul
        initial="off"
        whileInView="on"
        viewport={{ once: true, margin: "-60px" }}
        variants={{ on: { transition: { staggerChildren: 0.12 } } }}
        className="mx-auto grid max-w-7xl gap-px px-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {TERMS.map((t, i) => (
          <motion.li
            key={t.key}
            variants={{
              off: { opacity: 0, y: 10 },
              on: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
            }}
            className="flex items-start gap-3 py-6 lg:px-5 lg:first:ps-0"
          >
            <DrawCheck delay={0.15 + i * 0.12} className="mt-0.5 h-6 w-6" />
            <div>
              <p className="font-semibold">{t.title}</p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">{t.text}</p>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
