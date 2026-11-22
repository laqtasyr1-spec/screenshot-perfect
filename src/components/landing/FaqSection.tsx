import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";

export const FAQS = [
  {
    q: "هل العائد الشهري مضمون؟",
    a: "لا. النسب المعروضة (7% و5% و4%) عوائد مستهدفة وتقديرية، وقد يكون العائد الفعلي أقل أو صفراً، وقد يتعرض رأس المال للخسارة.",
  },
  {
    q: "ما أقل مبلغ يمكنني استثماره؟",
    a: "الحد الأدنى 10 دولارات. المبالغ من 10$ إلى أقل من 100$ تدخل في خطة البداية، ومن 100$ حتى 1,000$ في خطة النمو، وما يزيد على 1,000$ في خطة الرسوخ.",
  },
  {
    q: "كم تستمر الدورة الاستثمارية؟",
    a: "مدة كل دورة شهر واحد. في نهايتها يمكنك تجديدها بالمبلغ نفسه أو طلب سحب أصل المبلغ والأرباح المتاحة.",
  },
  {
    q: "كيف يُحسب العائد؟",
    a: "يُحسب على أصل المبلغ فقط: المبلغ × النسبة الشهرية المستهدفة. لا تُعاد استثمار الأرباح تلقائياً، فمثلاً 500$ بخطة النمو تعطي عائداً تقديرياً قدره 25$ لكل دورة.",
  },
  {
    q: "هل يمكنني اختيار الخطة بنفسي؟",
    a: "تُحدد الخطة تلقائياً بحسب المبلغ، حتى تكون القواعد واحدة وواضحة للجميع. إذا أردت خطة أخرى فعدّل المبلغ ضمن حدودها.",
  },
  {
    q: "كيف أسحب أموالي؟",
    a: "من صفحة السحوبات في لوحة التحكم تختار المبلغ وطريقة الاستلام، ويُراجع الطلب ويُتحقق من الهوية قبل التنفيذ. تظهر حالة الطلب لحظة بلحظة.",
  },
  {
    q: "هل توجد رسوم؟",
    a: "لا توجد رسوم غير معلنة. أي رسوم إدارية أو رسوم تحويل تُذكر بوضوح في العقد وفي نموذج السحب قبل التأكيد.",
  },
  {
    q: "هل المنصة مرخّصة؟",
    a: "تُنشر المعلومات القانونية والترخيصية في صفحة «عن المنصة» فور توفرها. لا نعرض أي ترخيص غير موثق، وننصحك بالتحقق قبل الاستثمار في أي منصة.",
  },
];

export function FaqSection({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_1.6fr]">
        {showHeading ? (
          <SectionHeading
            eyebrow="الأسئلة الشائعة"
            title="إجابات مباشرة على ما يهمك."
            description="إن لم تجد إجابتك هنا، ستجد التفاصيل الكاملة في الشروط وعقد الاستثمار."
          />
        ) : (
          <div />
        )}
        <Reveal>
          <Accordion type="single" collapsible defaultValue="item-0" className="space-y-3">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="spotlight rounded-2xl border border-border bg-panel px-6 transition-colors data-[state=open]:border-primary/30 data-[state=open]:shadow-glow"
              >
                <AccordionTrigger className="py-5 text-start font-sans text-base font-medium hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-[15px] leading-8 text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
