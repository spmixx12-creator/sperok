"use client";

// count-up.tsx
// Compteur qui grimpe très vite jusqu'au chiffre final lorsqu'il entre à l'écran.
// Démarre rapide puis ralentit (ease-out) avant de se figer sur la valeur cible.
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

interface CountUpProps {
  to: number;
  duration?: number; // secondes
  className?: string;
}

export default function CountUp({ to, duration = 1.4, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // Marge VERTICALE uniquement (« -80px 0px ») : un « -80px » sur tous les côtés
  // rétrécit aussi la zone horizontale et, sur un téléphone étroit, le petit
  // nombre de la colonne de droite (ex. « +10 ») tombe hors zone → le compteur
  // restait bloqué à 0. En limitant au vertical, il se déclenche partout.
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let raf = 0;
    let start: number | null = null;
    // ease-out cubic : grimpe vite puis se stabilise.
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      if (start === null) start = now;
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.round(ease(progress) * to));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
