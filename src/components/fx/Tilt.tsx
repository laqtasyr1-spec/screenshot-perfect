import type { ReactNode } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";

/** Gently tilts its content toward the mouse in 3D. Touch devices are left still. */
export function Tilt({
  children,
  className,
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const rx = useSpring(0, { stiffness: 140, damping: 26 });
  const ry = useSpring(0, { stiffness: 140, damping: 26 });
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={{
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 1100,
        transformStyle: "preserve-3d",
      }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
