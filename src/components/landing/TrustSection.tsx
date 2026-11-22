import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowDownToLine, Landmark, Receipt, Workflow } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { cn } from "@/lib/utils";
import { Aurora } from "@/components/fx/Aurora";

export const TRUST_TOPICS = [
  {
    id: "mechanism",
    icon: Workflow,
    title: "آلية عمل الاستثمارات",
    points: [
      "يقدّم المستثمر طلباً ضمن الخطة التي تطابق مبلغه، وتُراجع الإدارة الطلب قبل قبوله.",
      "بعد تأكيد الإيداع تبدأ دورة استثمارية مدتها شهر واحد.",
      "في نهاية الدورة يُسجَّل العائد المحقق فعلياً، وقد يختلف عن النسبة المستهدفة.",
      "يختار المستثمر بعدها تجديد الدورة أو سحب أصل المبلغ والأرباح.",
      "تُوضَّح أوجه توظيف الأموال وتفاصيلها في عقد الاستثمار قبل الموافقة.",
    ],
  },
  {
    id: "risks",
    icon: AlertTriangle,
    title: "المخاطر المحتملة",
    points: [
      "العوائد المعروضة مستهدفة وتقديرية، ولا يوجد عائد مضمون.",
      "قد يتعرض رأس المال لخسارة جزئية أو كلية بسبب ظروف السوق.",
      "قد تتأخر عمليات التحويل بسبب ظروف خارجة عن إرادة المنصة.",
      "تغيّر الظروف الاقتصادية أو التنظيمية قد يؤثر على الخطط ونسبها.",
      "لا تستثمر إلا مبلغاً تستطيع تحمّل خسارته.",
    ],
  },
  {
    id: "withdrawals",
    icon: ArrowDownToLine,
    title: "شروط السحب",
    points: [
      "يُقدَّم طلب السحب من لوحة التحكم، ويشمل الرصيد المتاح فقط.",
      "يتاح سحب أصل المبلغ عند نهاية الدورة الشهرية وفق شروط العقد.",
      "يخضع كل طلب للمراجعة والتحقق من هوية صاحب الحساب قبل التنفيذ.",
      "تُعرض مدة التنفيذ المتوقعة لكل طريقة سحب عند تقديم الطلب.",
    ],
  },
  {
    id: "fees",
    icon: Receipt,
    title: "الرسوم والاقتطاعات",
    points: [
      "لا تُفرض أي رسوم غير معلنة.",
      "تُذكر أي رسوم إدارية أو رسوم تحويل بوضوح في عقد الاستثمار.",
      "يظهر صافي المبلغ بعد أي اقتطاع في نموذج طلب السحب قبل تأكيده.",
    ],
  },
  {
    id: "legal",
    icon: Landmark,
    title: "المعلومات القانونية والترخيصية",
    points: [
      "تُنشر هنا بيانات الكيان القانوني والتراخيص والجهات الرقابية فور توفرها.",
      "لا تعرض ركيزة أي ترخيص أو شهادة أو شراكة غير موثقة.",
      "ننصح كل مستثمر بالتحقق من الوضع القانوني لأي منصة قبل الاستثمار فيها.",
    ],
  },
];

export function TrustSection() {
  const [active, setActive] = useState(TRUST_TOPICS[0]!.id);
  const topic = TRUST_TOPICS.find((t) => t.id === active) ?? TRUST_TOPICS[0]!;

  return (
    <section id="trust" className="relative py-16 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-sidebar p-5 md:rounded-[2rem] md:p-12">
          <Aurora intensity="soft" />
          <div className="relative">
            <SectionHeading
              eyebrow="الشفافية والثقة"
              title="نكتب الشروط والمخاطر قبل الأرباح."
              description="الثقة لا تُبنى بالوعود. هذه المعلومات متاحة لكل زائر قبل التسجيل، وتُعاد في العقد بالتفصيل."
            />

            <div className="mt-8 grid gap-4 md:mt-12 lg:grid-cols-[320px_1fr] lg:gap-8">
              <div
                className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
                role="tablist"
                aria-label="مواضيع الشفافية"
              >
                {TRUST_TOPICS.map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={active === t.id}
                    onClick={() => setActive(t.id)}
                    className={cn(
                      "relative flex min-h-11 shrink-0 items-center gap-2.5 rounded-xl border border-border px-3.5 py-2.5 text-start text-sm transition-colors lg:gap-3 lg:border-transparent lg:px-4 lg:py-3.5",
                      active === t.id
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {active === t.id && (
                      <motion.span
                        layoutId="trust-active"
                        className="absolute inset-0 rounded-xl border border-border-strong bg-surface-raised"
                      />
                    )}
                    <t.icon
                      className={cn("relative h-4 w-4", active === t.id ? "text-gold" : "")}
                    />
                    <span className="relative whitespace-nowrap">{t.title}</span>
                  </button>
                ))}
              </div>

              <div
                className="spotlight rounded-2xl border border-border bg-background/50 p-5 backdrop-blur md:min-h-72 md:p-10"
                role="tabpanel"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.35 }}
                  >
                    <topic.icon className="h-7 w-7 text-gold md:h-8 md:w-8" strokeWidth={1.4} />
                    <h3 className="mt-4 text-xl font-semibold md:mt-5 md:text-2xl">
                      {topic.title}
                    </h3>
                    <ul className="mt-5 space-y-3 md:mt-6 md:space-y-4">
                      {topic.points.map((p, i) => (
                        <li
                          key={p}
                          className="flex gap-3 text-[15px] leading-7 text-foreground/85 md:gap-4 md:text-base md:leading-8"
                        >
                          <span className="num mt-1 text-xs text-gold">0{i + 1}</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
