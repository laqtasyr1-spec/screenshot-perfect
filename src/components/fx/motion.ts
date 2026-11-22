import { useEffect, useState } from "react";

/** The site's single easing curve: calm deceleration, no bounce. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** True on touch devices and small screens, where heavy effects are switched off. Hydration-safe. */
export function useLowPower() {
  const [low, setLow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse), (max-width: 767px)");
    const update = () => setLow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return low;
}

/** False on the server and first render, true after hydration. */
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
