'use client';

// interactive-hover-links.tsx
// Liste de liens « éditoriaux » (inspirée de 21st.dev), adaptée à la charte :
//   - grand titre qui se décale lettre par lettre au survol,
//   - image de la catégorie qui suit la souris (desktop),
//   - flèche qui glisse au survol (desktop) / toujours visible (mobile).
// Chaque ligne déclenche une action (onClick) plutôt qu'un lien.
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useRef, type MouseEvent } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export interface HoverLinkItem {
  heading: string;
  subheading: string;
  /** Image révélée au survol (desktop). Vide = pas d'image. */
  imgSrc?: string;
  onClick: () => void;
}

interface InteractiveHoverLinksProps {
  links: HoverLinkItem[];
  className?: string;
}

export function InteractiveHoverLinks({ links, className = '' }: InteractiveHoverLinksProps) {
  return (
    <div className={`w-full text-left ${className}`}>
      {links.map((link) => (
        <HoverLink key={link.heading} {...link} />
      ))}
    </div>
  );
}

function HoverLink({ heading, subheading, imgSrc, onClick }: HoverLinkItem) {
  const ref = useRef<HTMLButtonElement | null>(null);

  // Position de la souris (−0,5 → 0,5) lissée par un ressort → l'image « suit ».
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xs = useSpring(x);
  const ys = useSpring(y);
  const top = useTransform(ys, [0.5, -0.5], ['40%', '60%']);
  const left = useTransform(xs, [0.5, -0.5], ['60%', '40%']);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.button
      type="button"
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      initial="initial"
      whileHover="whileHover"
      className="group relative flex w-full cursor-pointer items-center justify-between border-b border-white/15 py-3 text-left transition-colors duration-500 hover:border-amber-400 md:py-5"
    >
      <div className="min-w-0">
        <motion.span
          variants={{ initial: { x: 0 }, whileHover: { x: -12 } }}
          transition={{ type: 'spring', staggerChildren: 0.05, delayChildren: 0.15 }}
          className="relative z-10 block font-display text-2xl font-black uppercase tracking-tight text-white/65 transition-colors duration-500 group-hover:text-white sm:text-3xl md:text-4xl lg:text-5xl"
        >
          {heading.split('').map((l, i) => (
            <motion.span
              key={i}
              variants={{ initial: { x: 0 }, whileHover: { x: 12 } }}
              transition={{ type: 'spring' }}
              className="inline-block"
            >
              {l === ' ' ? ' ' : l}
            </motion.span>
          ))}
        </motion.span>
        <span className="relative z-10 mt-1.5 block font-mono text-[9px] uppercase tracking-widest text-white/45 transition-colors duration-500 group-hover:text-amber-400 md:text-[10px]">
          {subheading}
        </span>
      </div>

      {imgSrc && (
        <motion.img
          style={{ top, left, translateX: '-10%', translateY: '-50%' }}
          variants={{
            initial: { scale: 0, rotate: '-12.5deg' },
            whileHover: { scale: 1, rotate: '12.5deg' },
          }}
          transition={{ type: 'spring' }}
          src={imgSrc}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute z-0 hidden h-24 w-32 rounded-lg object-cover shadow-lg shadow-black/50 md:block md:h-40 md:w-56"
        />
      )}

      {/* Mobile : pas de survol → flèche toujours visible pour signaler le clic. */}
      <ArrowUpRight className="h-5 w-5 shrink-0 text-amber-400 md:hidden" />
      {/* Desktop : flèche qui glisse au survol. */}
      <div className="hidden overflow-hidden md:block">
        <motion.div
          variants={{
            initial: { x: '100%', opacity: 0 },
            whileHover: { x: '0%', opacity: 1 },
          }}
          transition={{ type: 'spring' }}
          className="relative z-10 p-3"
        >
          <ArrowRight className="h-8 w-8 text-amber-400 md:h-10 md:w-10" />
        </motion.div>
      </div>
    </motion.button>
  );
}

export default InteractiveHoverLinks;
