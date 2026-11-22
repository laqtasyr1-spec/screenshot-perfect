import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE } from "./motion";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * Rolling-digit display for a pre-formatted figure (e.g. "$1,234.56").
 * Columns are keyed from the right so digits roll in place as values change.
 */
export function Odometer({ text, className }: { text: string; className?: string }) {
  const chars = text.split("");
  return (
    <span
      className={cn("num inline-flex overflow-hidden leading-none", className)}
      aria-label={text}
      role="img"
    >
      {chars.map((c, i) => {
        const key = chars.length - i;
        if (!/\d/.test(c)) {
          return (
            <span key={`s${key}`} aria-hidden="true">
              {c}
            </span>
          );
        }
        const d = Number(c);
        return (
          <span
            key={`d${key}`}
            className="relative inline-block h-[1em] w-[0.62em] overflow-hidden"
            aria-hidden="true"
          >
            <motion.span
              className="absolute inset-x-0 top-0 flex flex-col"
              initial={false}
              animate={{ y: `${-d}em` }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              {DIGITS.map((n) => (
                <span key={n} className="block h-[1em] text-center">
                  {n}
                </span>
              ))}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
