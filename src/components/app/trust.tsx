import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, Copy } from "lucide-react";
import { DrawCheck } from "@/components/fx/DrawCheck";
import { EASE } from "@/components/fx/motion";
import { cycleProgress } from "@/lib/cycle";
import { cn } from "@/lib/utils";

/** Current date, only after hydration (avoids server/client mismatch). */
export function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);
  return now;
}

/* ───────── Lifecycle stepper ───────── */

export const INVESTMENT_STEPS = ["تم الإرسال", "قيد المراجعة", "نشط", "مستحق"] as const;
export const WITHDRAWAL_STEPS = ["تم الطلب", "موافق عليه", "تم التحويل"] as const;

export function investmentStep(status: "pending" | "active" | "completed" | "rejected") {
  return status === "pending" ? 1 : status === "active" ? 2 : status === "completed" ? 3 : 1;
}
export function withdrawalStep(status: "pending" | "approved" | "paid" | "rejected") {
  return status === "pending" ? 0 : status === "approved" ? 1 : status === "paid" ? 2 : 0;
}

/** Steps with an animated connecting line; the current step pulses gently. */
export function LifecycleStepper({
  steps,
  current,
  rejected = false,
  compact = false,
  className,
}: {
  steps: readonly string[];
  current: number;
  rejected?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const last = steps.length - 1;
  const done = current >= last && !rejected;
  return (
    <ol
      className={cn("relative flex items-start justify-between", className)}
      aria-label="مراحل الطلب"
    >
      <span
        className={cn(
          "absolute inset-x-3 h-0.5 rounded-full bg-border-strong",
          compact ? "top-[5px]" : "top-3",
        )}
        aria-hidden="true"
      >
        <motion.span
          className={cn(
            "absolute inset-y-0 start-0 rounded-full",
            rejected ? "bg-destructive/70" : "bg-primary",
          )}
          initial={{ width: 0 }}
          animate={{ width: `${(Math.min(current, last) / last) * 100}%` }}
          transition={{ duration: 0.9, ease: EASE }}
        />
      </span>
      {steps.map((label, i) => {
        const passed = i < current || (done && i === last);
        const isCurrent = i === current && !done;
        return (
          <li
            key={label}
            className="relative z-10 flex flex-1 flex-col items-center gap-1.5 text-center first:items-start last:items-end"
            aria-current={isCurrent ? "step" : undefined}
          >
            <span
              className={cn(
                "grid place-items-center rounded-full border bg-background transition-colors duration-500",
                compact ? "h-3 w-3" : "h-6 w-6",
                passed
                  ? "border-success"
                  : isCurrent
                    ? rejected
                      ? "border-destructive"
                      : "border-primary"
                    : "border-border-strong",
                isCurrent && !rejected && "animate-pulse-dot",
              )}
            >
              {!compact && passed && <DrawCheck show bare className="h-4 w-4" />}
              {!compact && isCurrent && (
                <span
                  className={cn("h-2 w-2 rounded-full", rejected ? "bg-destructive" : "bg-primary")}
                />
              )}
              {compact && (passed || isCurrent) && (
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    passed ? "bg-success" : rejected ? "bg-destructive" : "bg-primary",
                  )}
                />
              )}
            </span>
            {!compact && (
              <span
                className={cn(
                  "text-[11px] leading-4",
                  passed || isCurrent ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {isCurrent && rejected ? "مرفوض" : label}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ───────── Cycle progress ───────── */

export function CycleBar({
  start,
  maturity,
  active,
}: {
  start: string;
  maturity: string;
  active: boolean;
}) {
  const now = useNow();
  const p = now && active ? cycleProgress(start, maturity, now) : null;
  return (
    <div className="min-w-28">
      <div className="h-1.5 overflow-hidden rounded-full bg-border-strong">
        <motion.div
          className="h-full origin-right rounded-full bg-primary"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: p ? p.ratio : 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        />
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">
        {p ? (
          <>
            اليوم <span className="num">{p.elapsedDays}</span> من{" "}
            <span className="num">{p.totalDays}</span>
          </>
        ) : (
          "—"
        )}
      </p>
    </div>
  );
}

/** Ring that fills toward the next maturity date. */
export function CountdownRing({
  start,
  maturity,
  size = 112,
}: {
  start: string;
  maturity: string;
  size?: number;
}) {
  const now = useNow();
  const p = now ? cycleProgress(start, maturity, now) : null;
  const r = 44;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          className="stroke-border-strong"
          strokeWidth="6"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          className="stroke-gold"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - (p?.ratio ?? 0)) }}
          transition={{ duration: 1.1, ease: EASE }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="num font-display text-2xl font-semibold leading-none">
            {p ? p.remainingDays : "—"}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">يوماً متبقياً</p>
        </div>
      </div>
    </div>
  );
}

/* ───────── Copy reference ───────── */

export function CopyButton({
  value,
  label = "نسخ الرقم المرجعي",
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        void navigator.clipboard?.writeText(value).then(
          () => setCopied(true),
          () => setCopied(true),
        );
      }}
      className="no-print relative grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={copied ? "تم النسخ" : label}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="ok"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <Check className="h-4 w-4 text-success" />
          </motion.span>
        ) : (
          <motion.span
            key="cp"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Copy className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {copied ? "تم النسخ" : ""}
      </span>
    </button>
  );
}

/* ───────── Inline form validation ───────── */

/** Smooth error / success line under a field. */
export function FieldMessage({
  error,
  ok,
  okText,
  id,
}: {
  error?: string | null | undefined;
  ok?: boolean;
  okText?: ReactNode;
  id?: string;
}) {
  return (
    <AnimatePresence initial={false} mode="wait">
      {error ? (
        <motion.p
          key="err"
          id={id}
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="flex items-center gap-1.5 text-xs text-destructive"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </motion.p>
      ) : ok ? (
        <motion.p
          key="ok"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="flex items-center gap-1.5 text-xs text-success"
        >
          <DrawCheck show bare className="h-4 w-4" />
          {okText ?? "صحيح"}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

/** Confirmation success panel with a drawn check. */
export function SuccessState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="flex flex-col items-center py-4 text-center"
    >
      <DrawCheck show className="h-16 w-16" />
      <p className="mt-4 font-display text-xl font-semibold">{title}</p>
      {children && <div className="mt-2 text-sm leading-7 text-muted-foreground">{children}</div>}
    </motion.div>
  );
}
