import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { Aurora } from "@/components/fx/Aurora";
import { SplitText } from "@/components/fx/SplitText";
import { PillarEmblem } from "@/components/fx/Pillar";
import { CursorGlow, ScrollProgress } from "@/components/fx/ScrollProgress";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <ScrollProgress />
      <CursorGlow />
      <SiteHeader />
      <main className="relative z-[1]">{children}</main>
      <SiteFooter />
    </div>
  );
}

/** Animated top band for inner public pages. */
export function PageIntro({
  eyebrow,
  title,
  description,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-40">
      <Aurora />
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-[1.4fr_1fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold-soft px-3.5 py-1.5 text-xs text-gold"
          >
            <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
            {eyebrow}
          </motion.div>
          <SplitText
            text={title}
            className="max-w-3xl text-[2rem] font-semibold leading-tight sm:text-4xl md:text-5xl lg:text-6xl lg:leading-[1.15]"
            delay={0.1}
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground"
          >
            {description}
          </motion.p>
        </div>
        <div className="relative hidden justify-center md:flex">
          <PillarEmblem compact className="max-w-[16rem]" delay={0.2} />
          <span className="glass absolute -bottom-2 start-6 grid h-14 w-14 place-items-center rounded-2xl shadow-panel">
            <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
          </span>
        </div>
      </div>
    </section>
  );
}
