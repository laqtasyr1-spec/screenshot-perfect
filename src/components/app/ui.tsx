import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="text-3xl font-semibold">{title}</h1>
        {description && (
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card", className)}>
      {title && (
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-sans text-base font-semibold">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
  index = 0,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon: LucideIcon;
  tone?: "default" | "primary" | "gold";
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      layout
      className={cn(
        "spotlight lift relative rounded-2xl border p-5",
        tone === "primary" ? "border-primary/30 bg-featured" : "border-border bg-card",
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span
          className={cn(
            "grid h-9 w-9 place-items-center rounded-xl",
            tone === "gold" ? "bg-gold-soft text-gold" : "bg-primary/10 text-primary",
          )}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
        </span>
      </div>
      <p className="mt-4 text-start font-display text-3xl font-semibold">{value}</p>
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </motion.div>
  );
}

const toneMap = {
  success: "bg-success/12 text-success border-success/25",
  warning: "bg-warning/12 text-warning border-warning/25",
  danger: "bg-destructive/12 text-destructive border-destructive/25",
  info: "bg-info/12 text-info border-info/25",
  neutral: "bg-muted text-muted-foreground border-border-strong",
} as const;

export type Tone = keyof typeof toneMap;

export function StatusBadge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs",
        toneMap[tone],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="ps-10"
        aria-label={placeholder}
      />
    </div>
  );
}

export function FilterSelect<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as T)}>
      <SelectTrigger className="h-11 w-full rounded-lg bg-background/50 sm:w-44" aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function EmptyRow({
  colSpan,
  text = "لا توجد نتائج مطابقة.",
}: {
  colSpan: number;
  text?: string;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-12 text-center text-sm text-muted-foreground">
        {text}
      </td>
    </tr>
  );
}

/** Shared table styling for dashboard lists. */
export const tableCls = {
  wrap: "overflow-x-auto",
  table: "w-full min-w-[720px] text-sm",
  th: "px-5 py-3 text-start text-xs font-medium text-muted-foreground",
  td: "px-5 py-3.5 align-middle",
  tr: "border-t border-border transition-colors hover:bg-accent/40",
};

export const chartTooltipStyle = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border-strong)",
    borderRadius: 12,
    direction: "rtl" as const,
    fontFamily: "var(--font-sans)",
  },
  labelStyle: { color: "var(--muted-foreground)" },
  itemStyle: { color: "var(--foreground)" },
};

export const axisTick = { fill: "var(--muted-foreground)", fontSize: 11 };
