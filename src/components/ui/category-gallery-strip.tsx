'use client';

// category-gallery-strip.tsx
// Bande de « fenêtres » (une par catégorie) : image de couverture, nom écrit à
// la verticale, et la fenêtre survolée s'élargit (desktop). Clic/tap → ouvre la
// catégorie. Inspirée de la galerie extensible 21st.dev, adaptée à la charte.
import { ArrowUpRight } from 'lucide-react';

export interface GalleryStripItem {
  label: string;
  /** Image de couverture de la fenêtre. */
  imgSrc?: string;
  onClick: () => void;
}

interface CategoryGalleryStripProps {
  items: GalleryStripItem[];
  className?: string;
}

export function CategoryGalleryStrip({ items, className = '' }: CategoryGalleryStripProps) {
  return (
    <div className={`flex h-[52vh] w-full items-stretch gap-2 md:h-[440px] md:gap-3 ${className}`}>
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={item.onClick}
          aria-label={item.label}
          className="group relative min-w-0 flex-1 basis-0 cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-neutral-900 text-left transition-[flex-grow,border-color] duration-500 ease-out hover:flex-[4] hover:border-amber-400/60 md:rounded-2xl"
        >
          {item.imgSrc && (
            <img
              src={item.imgSrc}
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center brightness-75 transition-all duration-700 group-hover:scale-105 group-hover:brightness-100"
            />
          )}
          {/* Voile pour la lisibilité du nom */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

          {/* Nom de la catégorie écrit à la verticale */}
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rotate-180 whitespace-nowrap font-display text-sm font-black uppercase tracking-[0.2em] text-white drop-shadow transition-colors duration-500 [writing-mode:vertical-rl] group-hover:text-amber-400 md:text-lg">
            {item.label}
          </span>

          {/* Indice au survol (desktop) */}
          <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-neutral-900 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </button>
      ))}
    </div>
  );
}

export default CategoryGalleryStrip;
