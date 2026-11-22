import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/site/PublicShell";
import { Hero } from "@/components/landing/Hero";
import { PlansSection } from "@/components/landing/PlansSection";
import { Calculator } from "@/components/landing/Calculator";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TrustSection } from "@/components/landing/TrustSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { CtaBand } from "@/components/landing/CtaBand";
import { TransparencyStrip } from "@/components/landing/TransparencyStrip";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ركيزة — خطط استثمار شهرية بالدولار للمستثمرين في سوريا" },
      {
        name: "description",
        content:
          "استثمر من 10$ بخطط شهرية واضحة بعوائد مستهدفة 7% و5% و4%، مع حاسبة تفاعلية وشروط ومخاطر معلنة.",
      },
      { property: "og:title", content: "ركيزة — خطط استثمار شهرية بالدولار" },
      {
        property: "og:description",
        content: "خطط استثمار من 10$ بعوائد مستهدفة معلنة، وشفافية كاملة في الشروط والمخاطر.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <PublicShell>
      <Hero />
      <TransparencyStrip />
      <PlansSection />
      <Calculator />
      <HowItWorks />
      <TrustSection />
      <FaqSection />
      <CtaBand />
    </PublicShell>
  );
}
