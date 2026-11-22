import { createFileRoute } from "@tanstack/react-router";
import { Eye, Scale, ShieldCheck, Landmark } from "lucide-react";
import { PageIntro, PublicShell } from "@/components/site/PublicShell";
import { TrustSection } from "@/components/landing/TrustSection";
import { Reveal } from "@/components/site/Reveal";
import { RiskNotice } from "@/components/site/RiskNotice";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "عن ركيزة — الشفافية والشروط والمخاطر" },
      {
        name: "description",
        content:
          "تعرّف على مبادئ ركيزة، وآلية عمل الاستثمارات، والمخاطر، وشروط السحب، والرسوم، والمعلومات القانونية.",
      },
      { property: "og:title", content: "عن منصة ركيزة" },
      {
        property: "og:description",
        content: "مبادئ واضحة ومعلومات مفصلة عن المخاطر والشروط والرسوم قبل التسجيل.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const values = [
  {
    icon: Eye,
    title: "الوضوح أولاً",
    text: "النسب والحدود والشروط معلنة قبل التسجيل، ومكتوبة بلغة يفهمها الجميع.",
  },
  {
    icon: Scale,
    title: "الحذر في الوعود",
    text: "نتحدث عن عوائد مستهدفة لا مضمونة، ونضع المخاطر بجانب الأرباح دائماً.",
  },
  {
    icon: ShieldCheck,
    title: "حماية الحساب",
    text: "التحقق من الهوية ومراجعة كل طلب إيداع وسحب قبل تنفيذه.",
  },
];

function AboutPage() {
  return (
    <PublicShell>
      <PageIntro
        icon={Landmark}
        eyebrow="عن المنصة"
        title="منصة استثمار سورية الوجهة، عالمية المعايير في الوضوح."
        description="ركيزة منصة رقمية تقدم خطط استثمار شهرية بالدولار للمستثمرين في سوريا، وتضع الشفافية في المعلومات والشروط في صميم التجربة."
      />

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal
              key={v.title}
              delay={i * 0.1}
              className="spotlight rounded-3xl border border-border bg-panel p-8 transition-transform duration-500 hover:-translate-y-1"
            >
              <v.icon className="h-7 w-7 text-gold" strokeWidth={1.5} />
              <h2 className="mt-6 text-xl font-semibold">{v.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{v.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <TrustSection />

      <section className="pb-8">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="rounded-3xl border border-dashed border-border-strong p-8 md:p-10">
            <h2 className="text-2xl font-semibold">المعلومات القانونية والترخيصية</h2>
            <p className="mt-4 max-w-3xl leading-8 text-muted-foreground">
              هذا القسم مخصص لنشر اسم الكيان القانوني، ورقم السجل، والتراخيص، والجهات الرقابية
              المختصة. ستُضاف هذه البيانات هنا فور توفرها وتوثيقها، ولن تُعرض أي معلومات غير موثقة.
            </p>
            <RiskNotice className="mt-8" />
          </Reveal>
        </div>
      </section>
    </PublicShell>
  );
}
