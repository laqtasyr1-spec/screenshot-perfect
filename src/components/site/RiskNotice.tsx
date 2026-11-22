import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { EASE } from "@/components/fx/motion";
import { cn } from "@/lib/utils";

/** Always readable: fades from half to full opacity, never from hidden. */
export function RiskNotice({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0.55 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, ease: EASE }}
      role="note"
      className={cn(
        "relative overflow-hidden rounded-xl border border-gold/25 bg-gold-soft p-4 text-sm leading-7",
        className,
      )}
    >
      <motion.span
        className="hairline-gold absolute inset-x-0 top-0 origin-right"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
        aria-hidden="true"
      />
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-1 h-4 w-4 shrink-0 text-gold" />
        <p className="text-foreground/90">
          العوائد المعروضة{" "}
          <strong className="font-semibold text-gold">مستهدفة وتقديرية وغير مضمونة</strong>
          {compact
            ? "، وقد يتعرض رأس المال للخسارة."
            : "، ولا تمثل وعداً بتحقيق ربح. ينطوي كل استثمار على مخاطر قد تؤدي إلى خسارة جزء من رأس المال أو كله. اقرأ الشروط والمخاطر قبل تقديم أي طلب."}
        </p>
      </div>
    </motion.div>
  );
}
