import { MessagesSquare } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, PublicShell } from "@/components/site/PublicShell";
import { FaqSection, FAQS } from "@/components/landing/FaqSection";
import { CtaBand } from "@/components/landing/CtaBand";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "الأسئلة الشائعة — ركيزة" },
      {
        name: "description",
        content:
          "إجابات عن العوائد المستهدفة، والحد الأدنى للاستثمار، ومدة الدورة، وطريقة الحساب، والسحب والرسوم في ركيزة.",
      },
      { property: "og:title", content: "الأسئلة الشائعة حول ركيزة" },
      {
        property: "og:description",
        content: "كل ما تحتاج معرفته عن خطط ركيزة الشهرية قبل التسجيل.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <PublicShell>
      <PageIntro
        icon={MessagesSquare}
        eyebrow="الأسئلة الشائعة"
        title="أسئلة واضحة، وإجابات بلا مبالغة."
        description="جمعنا أكثر ما يسأل عنه المستثمرون قبل التسجيل: العوائد، والحدود، والمدة، والسحب، والرسوم."
      />
      <FaqSection showHeading={false} />
      <CtaBand />
    </PublicShell>
  );
}
