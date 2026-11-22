import { cn } from "@/lib/utils";

/** 1, 2 or 3 rising pillars — the plan's level in the brand language. */
export function PlanGlyph({ level, className }: { level: 1 | 2 | 3; className?: string }) {
  const bars = [14, 20, 26];
  return (
    <svg viewBox="0 0 44 32" className={cn("h-8 w-11", className)} aria-hidden="true">
      {bars.map((h, i) => (
        <rect
          key={h}
          x={4 + i * 13}
          y={30 - h}
          width="8"
          height={h}
          rx="2"
          className={i < level ? "fill-primary" : "fill-border-strong"}
        />
      ))}
      <rect x="2" y="1" width="40" height="2" rx="1" className="fill-gold/70" />
    </svg>
  );
}
