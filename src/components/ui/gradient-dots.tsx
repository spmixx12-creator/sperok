'use client';

// gradient-dots.tsx
// Fond décoratif : grille de points dont la couleur ondule via un dégradé animé
// (charte ambre). `duration` = durée d'un cycle (s). Motion (framer-motion).
import { motion } from 'motion/react';

const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ');

interface GradientDotsProps {
  /** Durée d'un cycle d'animation, en secondes. */
  duration?: number;
  /** Espacement de la grille de points, en px. */
  dotSize?: number;
  className?: string;
}

export function GradientDots({ duration = 20, dotSize = 16, className }: GradientDotsProps) {
  const dotMask = `radial-gradient(circle, #000 1.4px, transparent 1.6px)`;

  return (
    <div
      aria-hidden
      className={cx('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {/* Points colorés par un dégradé qui ondule */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(60deg, #F5B419, #ff8a00, #ffd27a, #F5B419, #b7791f)',
          backgroundSize: '300% 300%',
          WebkitMaskImage: dotMask,
          maskImage: dotMask,
          WebkitMaskSize: `${dotSize}px ${dotSize}px`,
          maskSize: `${dotSize}px ${dotSize}px`,
          opacity: 0.55,
        }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      />
      {/* Vignette : les points se fondent dans le fond sombre sur les bords */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, transparent 0%, transparent 38%, #0a0a0a 100%)',
        }}
      />
    </div>
  );
}

export default GradientDots;
