"use client";

// domains-showcase.tsx
// Section « Mes domaines de création » inspirée de SmoothScrollHero
// (uniquesonu/modern-hero, 21st.dev), réécrite pour ce projet :
// - `motion/react` (pas framer-motion), `lucide-react` (pas react-icons),
// - pas de Lenis global (on s'appuie sur le scroll par section) pour ne pas
//   entrer en conflit avec le verrou de scroll du hero ni les sections sticky.
// Image centrale qui s'ouvre en clip-path, puis cartes en parallaxe, cliquables.
import { useRef, type FC } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowDown } from "lucide-react";
import { ALL_CATEGORIES, type Category } from "./category-data";

const SECTION_HEIGHT = 1100; // px de « course » avant la fin de la section

interface DomainsShowcaseProps {
  selected?: string | null;
  onSelect: (label: string) => void;
  className?: string;
}

/** Image centrale qui s'ouvre (clip-path) et se dézoome au scroll. */
const CenterImage: FC<{ progress: MotionValue<number>; src: string }> = ({
  progress,
  src,
}) => {
  const clip1 = useTransform(progress, [0, 0.45], [25, 0]);
  const clip2 = useTransform(progress, [0, 0.45], [75, 100]);
  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;
  const backgroundSize = useTransform(progress, [0, 0.55], ["180%", "100%"]);
  const opacity = useTransform(progress, [0.5, 0.7], [1, 0]);

  return (
    <motion.div
      className="sticky top-0 h-screen w-full"
      style={{
        clipPath,
        backgroundSize,
        opacity,
        backgroundImage: `url(${src})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
};

/** Carte d'une catégorie qui dérive en parallaxe et ouvre sa galerie au clic. */
const ParallaxCard: FC<{
  category: Category;
  start: number;
  end: number;
  selected: boolean;
  onSelect: (label: string) => void;
  className?: string;
}> = ({ category, start, end, selected, onSelect, className }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.85, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.85, 1], [1, 0.9]);

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={() => onSelect(category.label)}
      style={{ y, opacity, scale }}
      className={[
        "group relative block overflow-hidden rounded-2xl border bg-neutral-900 shadow-2xl shadow-black/50 cursor-pointer",
        selected ? "border-amber-400" : "border-white/10",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <img
        src={category.cover}
        alt={category.label}
        loading="lazy"
        draggable={false}
        className="h-full w-full object-cover brightness-90 transition-all duration-500 group-hover:scale-105 group-hover:brightness-100"
      />
      {/* Voile + libellé */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
        <span className="font-display text-lg md:text-2xl font-black tracking-tight text-white drop-shadow">
          {category.label}
        </span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400 text-neutral-900 opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <ArrowDown className="h-4 w-4 -rotate-90" />
        </span>
      </div>
    </motion.button>
  );
};

// Disposition éditoriale des 6 cartes (largeur/alignement/hauteur + parallaxe).
const LAYOUT: {
  className: string;
  start: number;
  end: number;
}[] = [
  { className: "w-5/12 h-72 md:h-96", start: -180, end: 180 },
  { className: "ml-auto w-1/2 h-80 md:h-[28rem] -mt-24", start: 220, end: -220 },
  { className: "mx-auto w-5/12 h-64 md:h-80 -mt-16", start: -140, end: 160 },
  { className: "w-1/2 h-80 md:h-[26rem] -mt-20", start: -240, end: 240 },
  { className: "ml-auto w-5/12 h-72 md:h-96 -mt-24", start: 200, end: -200 },
  { className: "mx-auto w-1/2 h-72 md:h-[24rem] -mt-16", start: -120, end: 120 },
];

export function DomainsShowcase({
  selected = null,
  onSelect,
  className,
}: DomainsShowcaseProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const centerSrc = ALL_CATEGORIES[0]?.cover ?? "";

  // Titre superposé qui apparaît puis s'efface avec l'ouverture de l'image.
  const titleOpacity = useTransform(scrollYProgress, [0, 0.12, 0.4], [0, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.4], [0, -60]);

  return (
    <section
      ref={sectionRef}
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
      className={["relative w-full bg-neutral-950", className]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Image centrale qui s'ouvre */}
      <CenterImage progress={scrollYProgress} src={centerSrc} />

      {/* Titre superposé (sticky le temps de l'ouverture) */}
      <motion.div
        style={{ opacity: titleOpacity, y: titleY }}
        className="pointer-events-none sticky top-0 -mt-[100vh] flex h-screen flex-col items-center justify-center text-center"
      >
        <span className="font-mono text-[9px] uppercase tracking-widest text-amber-400">
          CE QUE JE CONÇOIS // CATÉGORIES
        </span>
        <h2 className="mt-4 max-w-3xl px-6 font-display text-4xl md:text-7xl font-black tracking-tight text-white">
          Mes domaines de création
        </h2>
        <span className="mt-6 font-mono text-[10px] uppercase tracking-widest text-white/50">
          Faites défiler ↓
        </span>
      </motion.div>

      {/* Cartes en parallaxe (cliquables) */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-[150px] pb-64 md:px-10">
        <p className="mb-10 text-center font-mono text-[10px] uppercase tracking-widest text-white/40">
          Cliquez sur une catégorie pour voir tous ses visuels
        </p>
        {ALL_CATEGORIES.map((cat, i) => {
          const l = LAYOUT[i % LAYOUT.length];
          return (
            <ParallaxCard
              key={cat.label}
              category={cat}
              start={l.start}
              end={l.end}
              selected={selected === cat.label}
              onSelect={onSelect}
              className={l.className}
            />
          );
        })}
      </div>

      {/* Fondu vers le fond clair de la page */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-b from-transparent to-[#FAF7F2]" />
    </section>
  );
}

export default DomainsShowcase;
