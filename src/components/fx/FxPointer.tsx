import { useEffect } from "react";

/**
 * One document-level pointer listener that feeds cursor coordinates to CSS:
 * --mx/--my on every `.spotlight` element and --cx/--cy on <html> for the page glow.
 */
export function FxPointer() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const update = () => {
      frame = 0;
      document.documentElement.style.setProperty("--cx", `${x}px`);
      document.documentElement.style.setProperty("--cy", `${y}px`);
      document.querySelectorAll<HTMLElement>(".spotlight").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
        el.style.setProperty("--mx", `${x - r.left}px`);
        el.style.setProperty("--my", `${y - r.top}px`);
      });
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
