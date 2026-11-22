import { Layers } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, PublicShell } from "@/components/site/PublicShell";
import { PlansSection } from "@/components/landing/PlansSection";
import { Calculator } from "@/components/landing/Calculator";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { PLANS, estimateReturns } from "@/lib/plans";
import { formatPercent, formatUSDFixed } from "@/lib/format";

export const Route = createFileRoute("/plans")({
  head: () => ({
    meta: [
      { title: "فرص الاستثمار — خطط ركيزة الشهرية" },
      {
        name: "description",
        content:
          "قارن خطط ركيزة الثلاث: البداية 7% والنمو 5% والرسوخ 4% شهرياً كعوائد مستهدفة، مع الشروط وحاسبة العائد.",
      },
      { property: "og:title", content: "فرص الاستثمار في ركيزة" },
      {
        property: "og:description",
        content: "ثلاث خطط شهرية بحدود مالية ونسب مستهدفة معلنة، وحاسبة تفاعلية.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlansPage,
});

const rows: { label: string; render: (i: number) => string }[] = [
  { label: "الحد المالي", render: (i) => PLANS[i]!.rangeLabel },
  { label: "العائد الشهري المستهدف", render: (i) => formatPercent(PLANS[i]!.monthlyRate) },
  { label: "مدة الدورة", render: () => "شهر واحد قابل للتجديد" },
  { label: "طريقة الحساب", render: () => "على أصل المبلغ فقط" },
  {
    label: "مثال: عائد دورة واحدة",
    render: (i) =>
      `${formatUSDFixed(estimateReturns(PLANS[i]!.exampleAmount, 1).monthlyReturn)} على ${PLANS[i]!.exampleAmount}$`,
  },
  { label: "ضمان العائد", render: () => "غير مضمون" },
];

function PlansPage() {
  return (
    <PublicShell>
      <PageIntro
        icon={Layers}
        eyebrow="فرص الاستثمار"
        title="اختر المبلغ، وتتحدد الخطة تلقائياً."
        description="ثلاث خطط بحدود مالية واضحة ونسب عائد شهري مستهدفة معلنة مسبقاً. اقرأ الشروط، وجرّب الحاسبة، ثم قرّر."
      />
      <PlansSection showHeading={false} />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="مقارنة" title="الخطط جنباً إلى جنب." />
          <Reveal className="mt-10 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-surface-raised">
                <tr>
                  <th className="px-5 py-4 text-start font-medium text-muted-foreground">البند</th>
                  {PLANS.map((p) => (
                    <th
                      key={p.id}
                      className="px-5 py-4 text-start font-display text-base font-semibold"
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-t border-border">
                    <td className="px-5 py-4 text-muted-foreground">{r.label}</td>
                    {PLANS.map((p, i) => (
                      <td key={p.id} className="px-5 py-4">
                        {r.render(i)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      <Calculator />
    </PublicShell>
  );
}
