import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-right bg-gradient-to-l from-primary to-primary-glow"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}

/** Large, very soft light that follows the cursor across the page background. */
export function CursorGlow() {
  return (
    <div
      className="cursor-glow pointer-events-none fixed inset-0 z-0 hidden md:block pointer-coarse:hidden"
      aria-hidden="true"
    />
  );
}
