import { useEffect, useId, type ReactNode } from "react";
import { motion, useReducedMotion, useSpring, useTransform, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE } from "./motion";

/*
 * Brand emblem material — sapphire stone columns under a gold architrave.
 * Near-front view with one light source from the upper left: bright left flank,
 * deep right flank with a faint bounce reflection, 1px rim light on lit edges,
 * soft contact shadow under every column and a faint cast shadow to the lower right.
 * Every colour comes from --pillar-*, --cap-*, --plinth-* tokens in src/styles.css.
 */

/** Unique, url()-safe id prefix so several emblems on one page never share gradients. */
function useSvgIds() {
  const raw = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return {
    shaft: `${raw}-shaft`,
    slab: `${raw}-slab`,
    capFront: `${raw}-capf`,
    capTop: `${raw}-capt`,
    specular: `${raw}-spec`,
    step: `${raw}-step`,
    blur: `${raw}-blur`,
    sheen: `${raw}-sheen`,
    clip: `${raw}-clip`,
  };
}

type Ids = ReturnType<typeof useSvgIds>;

function MaterialDefs({ ids }: { ids: Ids }) {
  return (
    <defs>
      {/* Cylinder: 5 stops — falloff, highlight, body, core shadow, bounce reflection */}
      <linearGradient id={ids.shaft} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" style={{ stopColor: "var(--pillar-mid)" }} />
        <stop offset="0.2" style={{ stopColor: "var(--pillar-highlight)" }} />
        <stop offset="0.48" style={{ stopColor: "var(--pillar-mid)" }} />
        <stop offset="0.84" style={{ stopColor: "var(--pillar-shadow)" }} />
        <stop offset="1" style={{ stopColor: "var(--pillar-reflect)" }} />
      </linearGradient>
      {/* Flat stone faces (abacus, plinth): gentle left-to-right falloff */}
      <linearGradient id={ids.slab} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" style={{ stopColor: "var(--pillar-highlight)" }} />
        <stop offset="0.55" style={{ stopColor: "var(--pillar-mid)" }} />
        <stop offset="1" style={{ stopColor: "var(--pillar-shadow)" }} />
      </linearGradient>
      {/* Gold architrave — 3-stop metallic, front and top */}
      <linearGradient id={ids.capFront} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" style={{ stopColor: "var(--cap-highlight)" }} />
        <stop offset="0.45" style={{ stopColor: "var(--cap-mid)" }} />
        <stop offset="1" style={{ stopColor: "var(--cap-shadow)" }} />
      </linearGradient>
      <linearGradient id={ids.capTop} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" style={{ stopColor: "var(--cap-top)" }} />
        <stop offset="0.5" style={{ stopColor: "var(--cap-highlight)" }} />
        <stop offset="1" style={{ stopColor: "var(--cap-mid)" }} />
      </linearGradient>
      <linearGradient id={ids.specular} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" style={{ stopColor: "var(--cap-specular)", stopOpacity: 0 }} />
        <stop offset="0.25" style={{ stopColor: "var(--cap-specular)", stopOpacity: 0.95 }} />
        <stop offset="0.7" style={{ stopColor: "var(--cap-specular)", stopOpacity: 0.5 }} />
        <stop offset="1" style={{ stopColor: "var(--cap-specular)", stopOpacity: 0 }} />
      </linearGradient>
      {/* Stylobate step fronts: slightly darker than the backdrop */}
      <linearGradient id={ids.step} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" style={{ stopColor: "var(--plinth)" }} />
        <stop offset="1" style={{ stopColor: "var(--plinth-shadow)" }} />
      </linearGradient>
      <linearGradient id={ids.sheen} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" style={{ stopColor: "var(--cap-specular)", stopOpacity: 0 }} />
        <stop offset="0.5" style={{ stopColor: "var(--cap-specular)", stopOpacity: 0.7 }} />
        <stop offset="1" style={{ stopColor: "var(--cap-specular)", stopOpacity: 0 }} />
      </linearGradient>
      <filter id={ids.blur} x="-30%" y="-200%" width="160%" height="500%">
        <feGaussianBlur stdDeviation="2.2" />
      </filter>
    </defs>
  );
}

/* ───────── Geometry (front view, y grows downward) ───────── */

/** Tapered shaft with a slight entasis bulge and elliptical top/bottom edges. */
function shaftPath(cx: number, top: number, bottom: number, hwTop: number, hwBottom: number) {
  const mid = top + (bottom - top) * 0.62;
  const bulge = hwBottom + 0.9;
  const ry = Math.max(hwBottom * 0.16, 1.6);
  return [
    `M ${cx - hwTop} ${top}`,
    `Q ${cx - bulge} ${mid} ${cx - hwBottom} ${bottom}`,
    `A ${hwBottom} ${ry} 0 0 0 ${cx + hwBottom} ${bottom}`,
    `Q ${cx + bulge} ${mid} ${cx + hwTop} ${top}`,
    `A ${hwTop} ${ry * 0.85} 0 0 1 ${cx - hwTop} ${top}`,
    "Z",
  ].join(" ");
}

/** Fluting: vertical channels spaced like a real cylinder (dense near the edges). */
function flutePath(
  cx: number,
  top: number,
  bottom: number,
  hwTop: number,
  hwBottom: number,
  count = 6,
) {
  return Array.from({ length: count }, (_, i) => {
    const t = Math.sin(((i + 0.5) / count - 0.5) * Math.PI * 0.78);
    return `M ${(cx + t * hwTop * 0.9).toFixed(2)} ${top + 2} L ${(cx + t * hwBottom * 0.9).toFixed(2)} ${bottom - 1}`;
  }).join(" ");
}

/** Lit (left) silhouette edge of the shaft, for the 1px rim light. */
function rimPath(cx: number, top: number, bottom: number, hwTop: number, hwBottom: number) {
  const mid = top + (bottom - top) * 0.62;
  return `M ${cx - hwTop + 0.6} ${top + 1} Q ${cx - hwBottom - 0.3} ${mid} ${cx - hwBottom + 0.6} ${bottom - 1}`;
}

interface ColumnGeo {
  cx: number;
  /** y of the abacus top (where the architrave rests) */
  top: number;
  /** y of the stylobate surface (where the plinth stands) */
  floor: number;
  scale?: number;
}

/** One column: plinth + torus base, fluted tapered shaft, echinus + abacus capital. */
function Column({
  cx,
  top,
  floor,
  scale = 1,
  ids,
  fluted = true,
}: ColumnGeo & { ids: Ids; fluted?: boolean }) {
  const s = scale;
  const abacusH = 8 * s;
  const echinusH = 9 * s;
  const plinthH = 8 * s;
  const torusH = 7 * s;
  const hwTop = 18.5 * s;
  const hwBottom = 22 * s;
  const shaftTop = top + abacusH + echinusH - 1.5 * s;
  const shaftBottom = floor - plinthH - torusH + 2 * s;
  return (
    <g>
      {/* base: plinth + torus */}
      <rect
        x={cx - 30 * s}
        y={floor - plinthH}
        width={60 * s}
        height={plinthH}
        rx={1 * s}
        fill={`url(#${ids.slab})`}
      />
      <rect
        x={cx - 26 * s}
        y={floor - plinthH - torusH}
        width={52 * s}
        height={torusH + 0.5}
        rx={torusH / 2}
        fill={`url(#${ids.shaft})`}
      />
      <path
        d={`M ${cx - 29 * s} ${floor - plinthH + 0.5} H ${cx + 12 * s}`}
        style={{ stroke: "var(--pillar-rim)" }}
        strokeWidth="1"
        opacity="0.55"
      />

      {/* shaft */}
      <path d={shaftPath(cx, shaftTop, shaftBottom, hwTop, hwBottom)} fill={`url(#${ids.shaft})`} />
      {fluted && (
        <path
          d={flutePath(cx, shaftTop, shaftBottom, hwTop, hwBottom)}
          style={{ stroke: "var(--pillar-flute)" }}
          strokeWidth={1.1 * s}
          strokeLinecap="round"
          fill="none"
        />
      )}
      <path
        d={rimPath(cx, shaftTop, shaftBottom, hwTop, hwBottom)}
        style={{ stroke: "var(--pillar-rim)" }}
        strokeWidth="1"
        fill="none"
        opacity="0.7"
      />

      {/* capital: echinus flares from the shaft into the abacus */}
      <path
        d={`M ${cx - hwTop} ${top + abacusH + echinusH} C ${cx - hwTop - 2 * s} ${top + abacusH + echinusH * 0.45} ${cx - 25 * s} ${top + abacusH + 1} ${cx - 27 * s} ${top + abacusH} L ${cx + 27 * s} ${top + abacusH} C ${cx + 25 * s} ${top + abacusH + 1} ${cx + hwTop + 2 * s} ${top + abacusH + echinusH * 0.45} ${cx + hwTop} ${top + abacusH + echinusH} Z`}
        fill={`url(#${ids.shaft})`}
      />
      <rect
        x={cx - 30 * s}
        y={top}
        width={60 * s}
        height={abacusH}
        rx={0.8 * s}
        fill={`url(#${ids.slab})`}
      />
      {/* the architrave shades the top of the abacus */}
      <rect
        x={cx - 30 * s}
        y={top}
        width={60 * s}
        height={2.6 * s}
        style={{ fill: "var(--shadow-ink)" }}
        opacity="0.45"
      />
      <path
        d={`M ${cx - 29.5 * s} ${top + abacusH - 0.5} V ${top + 3 * s}`}
        style={{ stroke: "var(--pillar-rim)" }}
        strokeWidth="1"
        opacity="0.5"
      />
    </g>
  );
}

/** Gold architrave resting on the capitals: front face, thin top face, specular line. */
function Architrave({
  x0,
  x1,
  y,
  h,
  depth,
  ids,
}: {
  x0: number;
  x1: number;
  y: number;
  h: number;
  depth: number;
  ids: Ids;
}) {
  const top = y - h;
  return (
    <g>
      <path
        d={`M ${x0} ${top} L ${x0 + depth} ${top - depth} L ${x1 - depth} ${top - depth} L ${x1} ${top} Z`}
        fill={`url(#${ids.capTop})`}
      />
      <rect x={x0} y={top} width={x1 - x0} height={h} fill={`url(#${ids.capFront})`} />
      {/* fascia line + underside */}
      <rect
        x={x0}
        y={top + h * 0.58}
        width={x1 - x0}
        height="0.8"
        style={{ fill: "var(--cap-shadow)" }}
        opacity="0.55"
      />
      <rect
        x={x0}
        y={y - 1.2}
        width={x1 - x0}
        height="1.2"
        style={{ fill: "var(--cap-underside)" }}
      />
      {/* specular highlight along the lit front edge + rim on the left end */}
      <rect
        x={x0 + 2}
        y={top + 0.4}
        width={x1 - x0 - 4}
        height="1"
        fill={`url(#${ids.specular})`}
      />
      <path
        d={`M ${x0 + 0.5} ${y - 1.5} V ${top + 0.5} L ${x0 + depth} ${top - depth + 0.5}`}
        style={{ stroke: "var(--cap-specular)" }}
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
    </g>
  );
}

/** Stepped stylobate: each step has a lit top strip and a darker front. */
function Stylobate({
  steps,
  ids,
}: {
  steps: { x0: number; x1: number; y: number; h: number }[];
  ids: Ids;
}) {
  return (
    <g>
      {steps.map((st, i) => (
        <g key={i}>
          <rect x={st.x0} y={st.y} width={st.x1 - st.x0} height={st.h} fill={`url(#${ids.step})`} />
          <rect
            x={st.x0}
            y={st.y}
            width={st.x1 - st.x0}
            height="2.2"
            style={{ fill: "var(--plinth-top)" }}
          />
          <path
            d={`M ${st.x0 + 0.5} ${st.y + st.h} V ${st.y + 0.5} H ${st.x1 - (st.x1 - st.x0) * 0.4}`}
            style={{ stroke: "var(--pillar-rim)" }}
            strokeWidth="1"
            fill="none"
            opacity="0.28"
          />
        </g>
      ))}
    </g>
  );
}

function Shadows({ children, ids }: { children: ReactNode; ids: Ids }) {
  return (
    <g filter={`url(#${ids.blur})`} style={{ fill: "var(--shadow-ink)" }}>
      {children}
    </g>
  );
}

/* ───────── Hero / page emblem ───────── */

const VB_W = 340;
const ARCH_Y = 86; // architrave underside = abacus top
const FLOOR = 254; // top surface of the upper step
const COLS = [100, 170, 240];
const ARCH_X0 = 56; // overhang ≈ 14px on a 228px architrave (~6%)
const ARCH_X1 = 284;

/**
 * Brand emblem — ركيزة means "pillar". Three equal columns rise one by one,
 * the gold architrave settles on top (no bounce), then a single sheen passes.
 * Runs once; with reduced motion the finished emblem is shown static.
 */
export function PillarEmblem({
  className,
  delay = 0.3,
  compact = false,
}: {
  className?: string;
  delay?: number;
  compact?: boolean;
}) {
  const ids = useSvgIds();
  // Initial states are identical on server and client (no hydration mismatch);
  // with reduced motion every transition is instant, so the finished emblem shows static.
  const reduce = useReducedMotion();
  const t = (tr: Transition): Transition => (reduce ? { duration: 0, delay: 0 } : tr);
  const step = compact ? 0.12 : 0.2;
  const rise = compact ? 0.7 : 0.95;
  const archDelay = delay + step * 2 + rise * 0.85;
  const sheenDelay = archDelay + 0.7;

  return (
    <svg
      viewBox={`0 0 ${VB_W} 300`}
      className={cn("block h-auto w-full", className)}
      role="img"
      aria-label="شعار ركيزة: ثلاث ركائز تعلوها عتبة ذهبية"
    >
      <MaterialDefs ids={ids} />
      <clipPath id={ids.clip}>
        <rect x={ARCH_X0} y={ARCH_Y - 30} width={ARCH_X1 - ARCH_X0} height="30" />
      </clipPath>

      {/* ground + stylobate */}
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t({ delay: Math.max(delay - 0.2, 0), duration: 0.7, ease: EASE })}
      >
        <Shadows ids={ids}>
          <ellipse cx={VB_W / 2 + 12} cy="291" rx="150" ry="5" opacity="0.7" />
        </Shadows>
        <Stylobate
          ids={ids}
          steps={[
            { x0: 24, x1: 316, y: 276, h: 12 },
            { x0: 36, x1: 304, y: 265, h: 11 },
            { x0: 48, x1: 292, y: FLOOR, h: 11 },
          ]}
        />
      </motion.g>

      {COLS.map((cx, i) => (
        <g key={cx}>
          {/* contact + cast shadow (light from the upper left) */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={t({ delay: delay + i * step + rise * 0.5, duration: 0.6 })}
          >
            <Shadows ids={ids}>
              <ellipse cx={cx + 22} cy={FLOOR + 3.5} rx="36" ry="3" opacity="0.35" />
              <ellipse cx={cx + 2} cy={FLOOR + 1} rx="32" ry="2.6" opacity="0.8" />
            </Shadows>
          </motion.g>
          <motion.g
            style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={t({ delay: delay + i * step, duration: rise, ease: EASE })}
          >
            <Column cx={cx} top={ARCH_Y} floor={FLOOR} ids={ids} />
          </motion.g>
        </g>
      ))}

      <motion.g
        initial={{ y: -14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={t({ delay: archDelay, duration: 0.6, ease: EASE })}
      >
        <Architrave x0={ARCH_X0} x1={ARCH_X1} y={ARCH_Y} h={18} depth={5} ids={ids} />
      </motion.g>

      {/* one sheen across the gold, once */}
      <g clipPath={`url(#${ids.clip})`} aria-hidden="true">
        <motion.rect
          y={ARCH_Y - 30}
          width="70"
          height="30"
          fill={`url(#${ids.sheen})`}
          initial={{ x: ARCH_X0 - 80, opacity: 0 }}
          animate={reduce ? { opacity: 0 } : { x: ARCH_X1 + 10, opacity: [0, 1, 1, 0] }}
          transition={t({ delay: sheenDelay, duration: 1.1, ease: "easeInOut" })}
        />
      </g>
    </svg>
  );
}

/* ───────── Calculator column ───────── */

/** Single column whose height follows a 0–1 value (calculator). Same material as the emblem. */
export function GrowingPillar({ value, className }: { value: number; className?: string }) {
  const ids = useSvgIds();
  const v = Math.min(Math.max(value, 0), 1);
  const h = useSpring(30 + v * 170, { stiffness: 90, damping: 22 });
  useEffect(() => {
    h.set(30 + v * 170);
  }, [h, v]);

  const S = 0.62;
  const floor = 0;
  const plinthH = 8 * S;
  const torusH = 7 * S;
  const hwTop = 18.5 * S;
  const hwBottom = 22 * S;
  const shaftBottom = floor - plinthH - torusH + 2 * S;
  const shaft = useTransform(h, (hh) =>
    shaftPath(0, shaftBottom - hh, shaftBottom, hwTop, hwBottom),
  );
  const flutes = useTransform(h, (hh) =>
    flutePath(0, shaftBottom - hh, shaftBottom, hwTop, hwBottom, 5),
  );
  const rim = useTransform(h, (hh) => rimPath(0, shaftBottom - hh, shaftBottom, hwTop, hwBottom));
  const lift = useTransform(h, (hh) => -hh);

  const abacusH = 8 * S;
  const echinusH = 9 * S;
  // capital is drawn relative to the shaft top at y = shaftBottom, then lifted by -h
  const capBase = shaftBottom + 1.5 * S;
  const abTop = capBase - echinusH - abacusH;

  return (
    <svg
      viewBox="-50 -250 100 270"
      className={cn("block h-auto w-full", className)}
      aria-hidden="true"
    >
      <MaterialDefs ids={ids} />
      <Shadows ids={ids}>
        <ellipse cx="6" cy="16" rx="46" ry="3" opacity="0.6" />
      </Shadows>
      <Stylobate
        ids={ids}
        steps={[
          { x0: -40, x1: 40, y: 6, h: 7 },
          { x0: -32, x1: 32, y: floor, h: 6 },
        ]}
      />
      <Shadows ids={ids}>
        <ellipse cx="10" cy={floor + 2.5} rx="24" ry="2" opacity="0.35" />
        <ellipse cx="1" cy={floor + 0.8} rx="20" ry="1.8" opacity="0.8" />
      </Shadows>
      <rect
        x={-30 * S}
        y={floor - plinthH}
        width={60 * S}
        height={plinthH}
        rx="0.6"
        fill={`url(#${ids.slab})`}
      />
      <rect
        x={-26 * S}
        y={floor - plinthH - torusH}
        width={52 * S}
        height={torusH + 0.5}
        rx={torusH / 2}
        fill={`url(#${ids.shaft})`}
      />
      <motion.path d={shaft} fill={`url(#${ids.shaft})`} />
      <motion.path
        d={flutes}
        style={{ stroke: "var(--pillar-flute)" }}
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
      />
      <motion.path
        d={rim}
        style={{ stroke: "var(--pillar-rim)" }}
        strokeWidth="1"
        fill="none"
        opacity="0.7"
      />
      <motion.g style={{ y: lift }}>
        <path
          d={`M ${-hwTop} ${capBase} C ${-hwTop - 1.2} ${capBase - echinusH * 0.55} ${-25 * S} ${abTop + abacusH + 0.6} ${-27 * S} ${abTop + abacusH} L ${27 * S} ${abTop + abacusH} C ${25 * S} ${abTop + abacusH + 0.6} ${hwTop + 1.2} ${capBase - echinusH * 0.55} ${hwTop} ${capBase} Z`}
          fill={`url(#${ids.shaft})`}
        />
        <rect
          x={-30 * S}
          y={abTop}
          width={60 * S}
          height={abacusH}
          rx="0.5"
          fill={`url(#${ids.slab})`}
        />
        <rect
          x={-30 * S}
          y={abTop}
          width={60 * S}
          height="1.6"
          style={{ fill: "var(--shadow-ink)" }}
          opacity="0.45"
        />
        <Architrave x0={-25} x1={25} y={abTop} h={9} depth={3} ids={ids} />
      </motion.g>
    </svg>
  );
}
