import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  /** Words separated by spaces. Wrap a word in *stars* to highlight it; use " | " for a line break. */
  text: string;
  className?: string;
  highlightClassName?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
  /** Animate when scrolled into view instead of on mount. */
  onView?: boolean;
}

const ease = [0.16, 1, 0.3, 1] as const;

/** Reveals a heading word by word (never letter by letter, to keep Arabic letters joined). */
export function SplitText({
  text,
  className,
  highlightClassName = "text-gold-gradient",
  as = "h1",
  delay = 0,
  onView = false,
}: Props) {
  const Tag = motion[as];
  const lines = text.split(" | ");
  let index = 0;
  return (
    <Tag
      className={className}
      initial="hidden"
      {...(onView
        ? { whileInView: "show", viewport: { once: true, margin: "-40px" } }
        : { animate: "show" })}
      variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: delay } } }}
    >
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(" ").map((word, wi, arr) => {
            const highlighted = word.startsWith("*") && word.includes("*", 1);
            const clean = word.replace(/\*/g, "");
            index++;
            return (
              <span key={`${li}-${wi}`}>
                <motion.span
                  className={cn(
                    "inline-block will-change-transform",
                    highlighted && highlightClassName,
                  )}
                  variants={{
                    hidden: { opacity: 0, y: "0.4em" },
                    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
                  }}
                  data-i={index}
                >
                  {clean}
                </motion.span>
                {wi < arr.length - 1 ? " " : ""}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
