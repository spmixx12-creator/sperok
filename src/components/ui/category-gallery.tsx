"use client";

// category-gallery.tsx
// Affiche les visuels d'une catégorie SANS les rogner (chaque affiche garde son
// ratio), sur 2 rangées. Le défilement vertical de la page est converti en
// défilement HORIZONTAL des rangées (section épinglée). Barre de progression
// originale : un petit personnage en tyrolienne qui avance avec le scroll.
import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowLeft } from "lucide-react";
import type { Category } from "./category-data";

/** Petit personnage suspendu à une poulie (tyrolienne). */
function ZiplineCharacter() {
  return (
    <motion.div
      animate={{ rotate: [-4, 4, -4] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      style={{ originX: 0.5, originY: 0.12 }}
    >
      <svg width="48" height="78" viewBox="0 0 48 78" fill="none">
        <circle cx="24" cy="9" r="6.5" fill="#1C1917" />
        <circle cx="24" cy="9" r="2.6" fill="#FBBF24" />
        <line x1="18.5" y1="13" x2="16" y2="25" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="29.5" y1="13" x2="32" y2="25" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="12" y="24" width="24" height="4.5" rx="2.25" fill="#1C1917" />
        <line x1="17" y1="28" x2="20" y2="43" stroke="#1C1917" strokeWidth="3.2" strokeLinecap="round" />
        <line x1="31" y1="28" x2="28" y2="43" stroke="#1C1917" strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="24" cy="46" r="7.5" fill="#FBBF24" stroke="#1C1917" strokeWidth="2.6" />
        <line x1="24" y1="53.5" x2="24" y2="64" stroke="#1C1917" strokeWidth="3.6" strokeLinecap="round" />
        <line x1="24" y1="64" x2="17" y2="74" stroke="#1C1917" strokeWidth="3.2" strokeLinecap="round" />
        <line x1="24" y1="64" x2="33" y2="70" stroke="#1C1917" strokeWidth="3.2" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}

/** Câble + personnage qui avance selon la progression du scroll. */
function ZiplineProgress({
  progress,
  category,
}: {
  progress: MotionValue<number>;
  category: string;
}) {
  const left = useTransform(progress, [0, 1], ["1%", "93%"]);
  const dip = useTransform(progress, [0, 0.5, 1], [0, 10, 0]);
  const pct = useTransform(progress, (p) => `${Math.round(p * 100)}%`);

  return (
    <div className="rounded-2xl border border-neutral-200/70 bg-[#FAF7F2]/85 px-4 py-3 backdrop-blur-md">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
          {category}
        </span>
        <motion.span className="font-mono text-[10px] uppercase tracking-widest text-amber-600">
          {pct}
        </motion.span>
      </div>
      <div className="relative h-16">
        <div className="absolute left-0 top-1 h-9 w-[3px] -skew-x-12 rounded bg-neutral-400" />
        <div className="absolute right-0 top-1 h-9 w-[3px] skew-x-12 rounded bg-neutral-400" />
        <div className="absolute left-1 right-1 top-[14px] h-[3px] rounded-full bg-gradient-to-r from-neutral-400 via-neutral-300 to-neutral-400" />
        <motion.div
          style={{ left, y: dip }}
          className="absolute top-[6px] -translate-x-1/2"
        >
          <ZiplineCharacter />
        </motion.div>
      </div>
    </div>
  );
}

interface CategoryGalleryProps {
  category: Category;
  onClose: () => void;
}

export default function CategoryGallery({
  category,
  onClose,
}: CategoryGalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const max1 = useRef(0);
  const max2 = useRef(0);

  const [sectionH, setSectionH] = useState(0);

  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ["start start", "end end"],
  });

  // Translation horizontale de chaque rangée, pilotée par la progression.
  const x1 = useMotionValue(0);
  const x2 = useMotionValue(0);

  // 2 rangées : indices pairs / impairs.
  const row1 = category.images.filter((_, i) => i % 2 === 0);
  const row2 = category.images.filter((_, i) => i % 2 === 1);

  const apply = useCallback(
    (p: number) => {
      x1.set(-p * max1.current);
      x2.set(-p * max2.current);
    },
    [x1, x2],
  );

  // Mesure la largeur des rangées → débordement à parcourir + hauteur de section.
  const measure = useCallback(() => {
    const vw = viewportRef.current?.clientWidth ?? 0;
    const w1 = row1Ref.current?.scrollWidth ?? 0;
    const w2 = row2Ref.current?.scrollWidth ?? 0;
    max1.current = Math.max(0, w1 - vw);
    max2.current = Math.max(0, w2 - vw);
    const overflow = Math.max(max1.current, max2.current);
    // Distance de scroll vertical = hauteur visible + débordement horizontal.
    setSectionH(window.innerHeight + overflow);
    apply(scrollYProgress.get());
  }, [apply, scrollYProgress]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    const unsub = scrollYProgress.on("change", apply);
    return () => {
      window.removeEventListener("resize", measure);
      unsub();
    };
  }, [measure, apply, scrollYProgress, category]);

  return (
    <div
      ref={galleryRef}
      style={{ height: sectionH ? `${sectionH}px` : undefined }}
      className="relative w-full"
    >
      {/* Zone épinglée : reste à l'écran pendant que les rangées défilent. */}
      <div
        ref={viewportRef}
        className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col overflow-hidden"
      >
        {/* En-tête + barre de progression tyrolienne */}
        <div className="shrink-0 pt-4">
          <div className="mb-3 flex items-center justify-between">
            <button
              onClick={onClose}
              className="group flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 transition-colors group-hover:bg-amber-400 group-hover:text-neutral-900">
                <ArrowLeft className="h-3.5 w-3.5" />
              </span>
              Toutes les catégories
            </button>
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
              {category.images.length} affiches
            </span>
          </div>
          <ZiplineProgress progress={scrollYProgress} category={category.label} />
        </div>

        {/* 2 rangées d'affiches (non rognées) qui défilent horizontalement */}
        <div className="flex flex-1 flex-col justify-center gap-4 overflow-hidden md:gap-6">
          <motion.div
            ref={row1Ref}
            style={{ x: x1 }}
            className="flex w-max gap-4 will-change-transform md:gap-6"
          >
            {row1.map((src, i) => (
              <img
                key={`r1-${i}`}
                src={src}
                alt={`${category.label} — affiche ${i * 2 + 1}`}
                onLoad={measure}
                draggable={false}
                className="h-[30vh] w-auto rounded-xl border border-neutral-200 bg-white object-contain shadow-sm md:h-[34vh]"
              />
            ))}
          </motion.div>

          <motion.div
            ref={row2Ref}
            style={{ x: x2 }}
            className="flex w-max gap-4 will-change-transform md:gap-6"
          >
            {row2.map((src, i) => (
              <img
                key={`r2-${i}`}
                src={src}
                alt={`${category.label} — affiche ${i * 2 + 2}`}
                onLoad={measure}
                draggable={false}
                className="h-[30vh] w-auto rounded-xl border border-neutral-200 bg-white object-contain shadow-sm md:h-[34vh]"
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
