import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE } from "./motion";

interface Props {
  /** Draw now (controlled). When omitted, draws once on scroll into view. */
  show?: boolean;
  delay?: number;
  className?: string;
  /** Hide the surrounding ring. */
  bare?: boolean;
}

/** A check mark that draws itself — used for confirmations and verified terms. */
export function DrawCheck({ show, delay = 0, className, bare = false }: Props) {
  const controlled = show !== undefined;
  const target = show ? "on" : "off";
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={cn("h-5 w-5 shrink-0 text-success", className)}
      initial="off"
      {...(controlled
        ? { animate: target }
        : { whileInView: "on", viewport: { once: true, margin: "-30px" } })}
      aria-hidden="true"
    >
      {!bare && (
        <motion.circle
          cx="12"
          cy="12"
          r="10.5"
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={1.5}
          variants={{
            off: { pathLength: 0, opacity: 0 },
            on: { pathLength: 1, opacity: 1, transition: { delay, duration: 0.6, ease: EASE } },
          }}
        />
      )}
      <motion.path
        d="M7 12.5l3.2 3.2L17 9"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          off: { pathLength: 0, opacity: 0 },
          on: {
            pathLength: 1,
            opacity: 1,
            transition: { delay: delay + 0.25, duration: 0.5, ease: EASE },
          },
        }}
      />
    </motion.svg>
  );
}
