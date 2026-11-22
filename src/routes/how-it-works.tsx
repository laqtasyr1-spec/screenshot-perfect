import { useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  CalendarCheck,
  CircleDollarSign,
  FileCheck2,
  RefreshCcw,
  SearchCheck,
  Workflow,
} from "lucide-react";
import { PageIntro, PublicShell } from "@/components/site/PublicShell";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/landing/CtaBand";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "كيف تعمل ركيزة؟ — من التسجيل إلى المتابعة" },
      {
        name: "description",
        content:
          "تعرّف على خطوات الاستثمار في ركيزة: إنشاء الحساب، اختيار الخطة، تقديم الطلب، ومتابعة الدورة الشهرية والتقارير.",
      },
      { property: "og:title", content: "كيف تعمل منصة ركيزة؟" },
      {
        property: "og:description",
        content: "أربع خطوات واضحة ودورة استثمارية مدتها شهر واحد قابلة للتجديد.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowPage,
});

const cycle = [
  {
    icon: FileCheck2,
    day: "اليوم 0",
    title: "تقديم الطلب",
    text: "تحدد المبلغ وتقبل الشروط، فيُسجَّل طلبك بحالة «قيد المراجعة».",
  },
  {
    icon: SearchCheck,
    day: "خلال المراجعة",
    title: "المراجعة والتحقق",
    text: "تراجع الإدارة الطلب وتتحقق من بيانات الحساب والإيداع.",
  },
  {
    icon: CircleDollarSign,
    day: "بداية الدورة",
    title: "تأكيد الإيداع",
    text: "بعد تأكيد وصول المبلغ تبدأ الدورة ويظهر تاريخ الاستحقاق في لوحتك.",
  },
  {
    icon: CalendarCheck,
    day: "بعد شهر",
    title: "الاستحقاق",
    text: "يُسجَّل العائد المحقق فعلياً، وقد يختلف عن النسبة المستهدفة.",
  },
  {
    icon: RefreshCcw,
    day: "القرار",
    title: "التجديد أو السحب",
    text: "تختار تجديد الدورة بالمبلغ نفسه أو طلب سحب الأصل والأرباح.",
  },
];

function HowPage() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });
  return (
    <PublicShell>
      <PageIntro
        icon={Workflow}
        eyebrow="آلية العمل"
        title="خطوات مفهومة، ودورة شهرية تعرف بدايتها ونهايتها."
        description="صُممت ركيزة لتكون واضحة: تعرف متى يبدأ استثمارك، ومتى يستحق، وما الخيارات المتاحة لك بعدها."
      />
      <HowItWorks />

      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHeading eyebrow="الدورة الاستثمارية" title="ماذا يحدث خلال الشهر؟" />
          <ol ref={ref} className="relative mt-14 space-y-6 ps-10">
            <div
              className="absolute bottom-0 start-[0.7rem] top-0 w-[2px] rounded-full bg-border-strong"
              aria-hidden="true"
            >
              <motion.div
                className="h-full w-full origin-top rounded-full bg-gradient-to-b from-primary via-gold to-primary-glow"
                style={{ scaleY: fill }}
              />
            </div>
            {cycle.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08} y={30}>
                <li className="spotlight group relative rounded-2xl border border-border bg-panel p-6 transition-transform duration-500 hover:-translate-x-1">
                  <span className="absolute -start-[2.85rem] top-6 grid h-9 w-9 place-items-center rounded-full border border-border-strong bg-surface transition-all duration-500 group-hover:scale-110 group-hover:border-primary group-hover:shadow-glow">
                    <c.icon className="h-4 w-4 text-primary" />
                  </span>
                  <p className="text-xs text-gold">{c.day}</p>
                  <h3 className="mt-1 font-sans text-lg font-semibold">{c.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{c.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
      <CtaBand />
    </PublicShell>
  );
}
