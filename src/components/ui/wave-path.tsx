'use client';

// wave-path.tsx
// Ligne interactive en forme de vague (sshahaider / 21st.dev), recréée pour ce
// projet : `motion/react` (pas framer-motion). Au survol, la ligne se déforme et
// suit le curseur, puis revient à plat avec un ressort (spring).
import { useRef, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface WavePathProps {
  className?: string;
  /** Couleur du trait (par défaut : couleur de texte courante). */
  color?: string;
  /** Épaisseur du trait en px. */
  strokeWidth?: number;
  /** Amplitude de la vague : plus c'est grand, plus elle s'étend. */
  amplify?: number;
  /** Demi-hauteur (en unités viewBox 0..20) de la zone sensible autour du trait. */
  activationBand?: number;
  /** Étirement maximal autorisé (en unités viewBox) : limite la portée. */
  maxStretch?: number;
  /** Classe de hauteur du SVG (réserve l'espace vertical de la vague). */
  heightClassName?: string;
  style?: CSSProperties;
}

export function WavePath({
  className,
  color = 'currentColor',
  strokeWidth = 1.5,
  amplify = 3.5,
  activationBand = 5,
  maxStretch = 7,
  heightClassName = 'h-32',
  style,
}: WavePathProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Point de contrôle de la courbe (viewBox 0..100 × 0..20).
  const cx = useMotionValue(50);
  const cy = useMotionValue(10);

  const springCx = useSpring(cx, { stiffness: 240, damping: 24 });
  const springCy = useSpring(cy, { stiffness: 120, damping: 9, mass: 0.6 });

  const d = useTransform(
    [springCx, springCy],
    ([x, y]: number[]) => `M 0 10 Q ${x} ${y} 100 10`,
  );

  const flatten = () => {
    cx.set(50);
    cy.set(10);
  };

  const handleMove = (e: ReactMouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const py = ((e.clientY - rect.top) / rect.height) * 20;

    // Ne réagir QUE si le curseur passe réellement sur le trait (proche de y=10).
    // Le trait suit alors le curseur, mais revient à plat dès qu'on s'en éloigne.
    if (Math.abs(py - 10) > activationBand) {
      flatten();
      return;
    }

    const px = ((e.clientX - rect.left) / rect.width) * 100;
    cx.set(px);

    // La quadratique n'atteint que la moitié de l'amplitude du point de contrôle :
    // on exagère pour que le sommet suive le curseur, puis on limite la portée.
    const target = 10 + (py - 10) * amplify;
    const clamped = Math.max(10 - maxStretch, Math.min(10 + maxStretch, target));
    cy.set(clamped);
  };

  const handleLeave = flatten;

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={style}
    >
      <svg
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        className={`w-full overflow-visible ${heightClassName}`}
      >
        <motion.path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

export default WavePath;
