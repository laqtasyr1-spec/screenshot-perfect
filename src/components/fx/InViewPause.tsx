import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Pauses every CSS animation inside while the block is off-screen
 * (sets data-fx-paused, handled in styles.css).
 */
export function InViewPause({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string | undefined;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => {
      el.dataset["fxPaused"] = e && e.isIntersecting ? "false" : "true";
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}
