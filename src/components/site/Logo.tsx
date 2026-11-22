import { useId } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export type LogoVariant = "color" | "mono" | "favicon";

/*
 * LogoMark — a geometric reduction of PillarEmblem: three columns with simple
 * capitals under a gold architrave, on a two-step base.
 *  - "color":   full colour, light gradients (24px and up)
 *  - "mono":    one colour via currentColor (footer, print)
 *  - "favicon": pixel-friendly, no capitals or gradients (16px)
 */
const COLS = [12, 20, 28];

function shaft(cx: number) {
  // gentle taper: 4.6 wide at the top, 5.4 at the bottom
  return `M ${cx - 2.3} 15.4 L ${cx - 2.7} 30.2 L ${cx + 2.7} 30.2 L ${cx + 2.3} 15.4 Z`;
}

function ColorMark({ uid }: { uid: string }) {
  const shaftId = `${uid}-s`;
  const goldId = `${uid}-g`;
  return (
    <>
      <defs>
        <linearGradient id={shaftId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" style={{ stopColor: "var(--pillar-highlight)" }} />
          <stop offset="0.55" style={{ stopColor: "var(--pillar-mid)" }} />
          <stop offset="1" style={{ stopColor: "var(--pillar-shadow)" }} />
        </linearGradient>
        <linearGradient id={goldId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--cap-highlight)" }} />
          <stop offset="1" style={{ stopColor: "var(--cap-shadow)" }} />
        </linearGradient>
      </defs>
      {/* architrave */}
      <path d="M5 9 L6.3 7.7 H33.7 L35 9 Z" style={{ fill: "var(--cap-top)" }} />
      <rect x="5" y="9" width="30" height="4.2" fill={`url(#${goldId})`} />
      <rect
        x="6"
        y="9.2"
        width="22"
        height="0.6"
        style={{ fill: "var(--cap-specular)" }}
        opacity="0.8"
      />
      {COLS.map((cx) => (
        <g key={cx}>
          <rect
            x={cx - 3.8}
            y="13.7"
            width="7.6"
            height="1.7"
            style={{ fill: "var(--pillar-mid)" }}
          />
          <path d={shaft(cx)} fill={`url(#${shaftId})`} />
          <rect
            x={cx - 3.4}
            y="30.2"
            width="6.8"
            height="1.6"
            style={{ fill: "var(--pillar-mid)" }}
          />
        </g>
      ))}
      {/* two-step base */}
      <rect x="4.5" y="32.3" width="31" height="1.8" style={{ fill: "var(--pillar-mid)" }} />
      <rect x="3" y="34.4" width="34" height="2.1" style={{ fill: "var(--pillar-shadow)" }} />
    </>
  );
}

function MonoMark() {
  return (
    <g fill="currentColor">
      <rect x="5" y="8" width="30" height="5.2" />
      {COLS.map((cx) => (
        <g key={cx}>
          <rect x={cx - 3.8} y="14" width="7.6" height="1.6" />
          <path d={shaft(cx)} />
          <rect x={cx - 3.4} y="30.2" width="6.8" height="1.6" />
        </g>
      ))}
      <rect x="4.5" y="32.6" width="31" height="1.6" />
      <rect x="3" y="35" width="34" height="1.6" />
    </g>
  );
}

function FaviconMark() {
  // 16-unit grid scaled into the 40 viewBox: whole shapes only, nothing below 1px at 16px.
  return (
    <g transform="scale(2.5)">
      <rect width="16" height="16" rx="3.5" style={{ fill: "var(--background)" }} />
      <rect x="2" y="2.5" width="12" height="2.5" rx="0.4" style={{ fill: "var(--gold)" }} />
      {[3.5, 7, 10.5].map((x) => (
        <rect key={x} x={x} y="6" width="2" height="6" style={{ fill: "var(--primary)" }} />
      ))}
      <rect
        x="2.5"
        y="12.5"
        width="11"
        height="1.5"
        style={{ fill: "var(--primary)" }}
        opacity="0.6"
      />
    </g>
  );
}

export function LogoMark({
  className,
  variant = "color",
}: {
  className?: string;
  variant?: LogoVariant;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg viewBox="0 0 40 40" className={cn("h-9 w-9 shrink-0", className)} aria-hidden="true">
      {variant === "color" ? (
        <ColorMark uid={uid} />
      ) : variant === "mono" ? (
        <MonoMark />
      ) : (
        <FaviconMark />
      )}
    </svg>
  );
}

export function Logo({
  to = "/",
  className,
  variant = "color",
}: {
  to?: "/" | "/dashboard" | "/admin";
  className?: string;
  variant?: Exclude<LogoVariant, "favicon">;
}) {
  return (
    <Link
      to={to}
      className={cn("group flex items-center gap-2.5", className)}
      aria-label="ركيزة — الصفحة الرئيسية"
    >
      <LogoMark
        variant={variant}
        className="transition-transform duration-500 group-hover:-translate-y-0.5"
      />
      {/* No letter-spacing: it breaks Arabic letter joins. Small top padding centres Reem Kufi's glyphs on the mark. */}
      <span className="font-display text-[1.65rem] font-semibold leading-none text-foreground pt-1">
        ركيزة
      </span>
    </Link>
  );
}
