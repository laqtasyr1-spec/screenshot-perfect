import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Lock } from "lucide-react";
import { Logo } from "./Logo";
import { PlanGlyph } from "@/components/landing/PlanGlyph";
import { PLANS } from "@/lib/plans";
import { formatPercent } from "@/lib/format";
import { Aurora } from "@/components/fx/Aurora";
import { motion } from "framer-motion";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 md:px-12">
        <div className="flex items-center justify-between">
          <Logo />
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowRight className="h-4 w-4" />
            العودة للرئيسية
          </Link>
        </div>
        <div className="mx-auto my-auto w-full max-w-md py-10">
          <h1 className="text-3xl font-semibold md:text-4xl">{title}</h1>
          <p className="mt-3 leading-7 text-muted-foreground">{subtitle}</p>
          <div className="mt-10">{children}</div>
        </div>
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          نموذج أولي للواجهة: لا تُحفظ البيانات ولا تتم عمليات مالية حقيقية.
        </p>
      </div>

      <aside className="relative hidden overflow-hidden border-s border-border bg-hero lg:block">
        <Aurora />
        <div className="bg-grid absolute inset-0" />
        <div className="relative flex h-full flex-col justify-center p-16">
          <p className="text-xs text-gold">ركيزة</p>
          <h2 className="mt-4 max-w-md text-4xl font-semibold leading-tight">
            ثلاث خطط، وقاعدة واحدة: الوضوح قبل كل شيء.
          </h2>
          <div className="mt-12 space-y-3">
            {PLANS.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="glass spotlight flex items-center justify-between rounded-2xl p-5"
              >
                <div className="flex items-center gap-4">
                  <PlanGlyph level={(i + 1) as 1 | 2 | 3} />
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.rangeLabel}</p>
                  </div>
                </div>
                <div className="text-end">
                  <p className="num font-display text-2xl font-semibold text-primary">
                    {formatPercent(p.monthlyRate)}
                  </p>
                  <p className="text-[11px] text-gold">مستهدف شهرياً</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
