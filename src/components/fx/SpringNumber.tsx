import { useEffect } from "react";
import { motion, useReducedMotion, useSpring, useTransform } from "framer-motion";

/** Springs smoothly to a new value whenever it changes. Formatting is supplied by the caller. */
export function SpringNumber({
  value,
  format,
  className,
}: {
  value: number;
  format: (n: number) => string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const spring = useSpring(value, { stiffness: 110, damping: 24, mass: 0.7 });
  const text = useTransform(spring, (v) => format(Math.max(0, v)));
  useEffect(() => {
    if (reduce) spring.jump(value);
    else spring.set(value);
  }, [spring, value, reduce]);
  return <motion.span className={className}>{text}</motion.span>;
}
