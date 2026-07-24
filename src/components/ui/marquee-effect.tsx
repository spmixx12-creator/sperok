"use client";

// marquee-effect.tsx
// Bandeau défilant (marquee) inspiré de bundui / 21st.dev, adapté à ce projet :
// - `motion/react` au lieu de framer-motion,
// - `wrap` réimplémenté en local (plus besoin de @motionone/utils),
// - la vitesse réagit légèrement à la vélocité de scroll de la page.
import { useRef, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

// Repli d'une valeur dans l'intervalle [min, max[ (modulo signé).
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  const mod = (((v - min) % range) + range) % range;
  return mod + min;
};

interface MarqueeAnimationProps {
  children: ReactNode;
  className?: string;
  direction?: "left" | "right";
  baseVelocity?: number;
  /** Nombre de copies du contenu pour remplir la largeur. */
  repeat?: number;
}

export function MarqueeAnimation({
  children,
  className = "",
  direction = "left",
  baseVelocity = 5,
  repeat = 4,
}: MarqueeAnimationProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  // Boucle infinie : on enroule x entre -20% et -45%.
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef(1);
  useAnimationFrame((_t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (direction === "left") directionFactor.current = -1;
    else if (direction === "right") directionFactor.current = 1;

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="relative flex w-full flex-nowrap overflow-hidden whitespace-nowrap">
      <motion.div className="flex flex-nowrap whitespace-nowrap" style={{ x }}>
        {Array.from({ length: repeat }).map((_, i) => (
          <span key={i} className={`block ${className}`}>
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default MarqueeAnimation;
