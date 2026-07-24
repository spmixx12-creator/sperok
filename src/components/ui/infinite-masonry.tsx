"use client";

// infinite-masonry.tsx
// Galerie plein écran à défilement INFINI (torique), déplaçable au scroll
// (vertical/horizontal) ou au glisser, fluide (interpolation), statique au
// repos. Chaque image gardée en ENTIER (proportions d'origine, aucune
// déformation), rangée en colonnes façon « masonry » → cadres emboîtés.
//   - chaque colonne boucle verticalement sur son propre jeu d'images ;
//   - l'ensemble des colonnes boucle horizontalement ;
// → on n'atteint jamais la fin : le contenu se régénère en continu.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

export interface InfiniteMasonryProps {
  images: string[];
  className?: string;
  columnWidth?: number;
  gap?: number;
  smoothing?: number;
  onImageClick?: (src: string) => void;
}

export function InfiniteMasonry({
  images,
  className,
  columnWidth = 420,
  gap = 18,
  smoothing = 0.12,
  onImageClick,
}: InfiniteMasonryProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const rowTrackRef = useRef<HTMLDivElement>(null);
  const offset = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  // startX/startY : position du pointeur à l'appui → distingue clic vs glisser.
  const drag = useRef({ active: false, x: 0, y: 0, startX: 0, startY: 0, src: "" });
  const onImageClickRef = useRef(onImageClick);
  onImageClickRef.current = onImageClick;
  const rafRef = useRef(0);
  const ratios = useRef<Record<string, number>>({});
  const tickScheduled = useRef(false);
  const [, setTick] = useState(0);
  const [vp, setVp] = useState({ w: 0, h: 0 });

  // Recalcule les hauteurs quand de nouvelles proportions d'images sont connues.
  const scheduleTick = useCallback(() => {
    if (tickScheduled.current) return;
    tickScheduled.current = true;
    requestAnimationFrame(() => {
      tickScheduled.current = false;
      setTick((t) => t + 1);
    });
  }, []);

  const ratioOf = (src: string) => ratios.current[src] ?? 1.3;

  // Précharge TOUTES les images uniques de la catégorie dès l'ouverture → dès
  // qu'on entre, les visuels sont en cache et s'affichent instantanément (plus
  // besoin de scroller pour qu'ils apparaissent).
  useEffect(() => {
    const set = Array.from(new Set(images));
    const preloaded = set.map((src) => {
      const im = new Image();
      im.decoding = "async";
      im.src = src;
      return im;
    });
    return () => {
      preloaded.forEach((im) => (im.src = ""));
    };
  }, [images]);

  // Colonnes (round-robin) — chaque image une seule fois par jeu.
  const columns = useMemo(() => {
    const n = images.length || 1;
    const cols = Math.max(2, Math.round(Math.sqrt(n)));
    const buckets: string[][] = Array.from({ length: cols }, () => []);
    images.forEach((src, i) => buckets[i % cols].push(src));
    return buckets;
  }, [images]);

  // Largeur de colonne RESPONSIVE : cadres réduits sur téléphone / tablette
  // pour faciliter la navigation entre les images.
  //   téléphone (< 640) → petit · tablette (< 1024) → moyen · sinon → prop.
  const colW =
    vp.w === 0
      ? columnWidth
      : vp.w < 640
      ? Math.min(columnWidth, 150)
      : vp.w < 1024
      ? Math.min(columnWidth, 230)
      : columnWidth;

  const TW = columns.length * (colW + gap);

  // Mesure du viewport
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setVp({ w: r.width, h: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Réinitialise la position quand la liste d'images change (autre catégorie).
  useEffect(() => {
    offset.current = { x: 0, y: 0 };
    targetRef.current = { x: 0, y: 0 };
    drag.current.active = false;
  }, [images]);

  // Entrées + boucle d'animation
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      targetRef.current.x -= e.deltaX;
      targetRef.current.y -= e.deltaY;
    };
    const onDown = (e: PointerEvent) => {
      const src = (e.target as HTMLElement)?.dataset?.src ?? "";
      drag.current = {
        active: true,
        x: e.clientX,
        y: e.clientY,
        startX: e.clientX,
        startY: e.clientY,
        src,
      };
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!drag.current.active) return;
      targetRef.current.x += e.clientX - drag.current.x;
      targetRef.current.y += e.clientY - drag.current.y;
      drag.current.x = e.clientX;
      drag.current.y = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      if (drag.current.active) {
        // Peu de mouvement + appui sur une image → clic (ouverture plein écran).
        const moved =
          Math.abs(e.clientX - drag.current.startX) +
          Math.abs(e.clientY - drag.current.startY);
        if (moved < 6 && drag.current.src && onImageClickRef.current) {
          onImageClickRef.current(drag.current.src);
        }
      }
      drag.current.active = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    const mod = (v: number, m: number) => (m > 0 ? ((v % m) + m) % m : 0);

    const loop = () => {
      offset.current.x += (targetRef.current.x - offset.current.x) * smoothing;
      offset.current.y += (targetRef.current.y - offset.current.y) * smoothing;

      // Boucle horizontale de l'ensemble des colonnes.
      if (rowTrackRef.current && TW > 0) {
        const wrapX = mod(offset.current.x, TW);
        rowTrackRef.current.style.transform = `translate3d(${wrapX - TW}px,0,0)`;
      }
      // Boucle verticale, propre à chaque colonne (hauteur lue sur data-h).
      const cols = rowTrackRef.current?.querySelectorAll<HTMLDivElement>("[data-track]");
      if (cols) {
        cols.forEach((t) => {
          const H = parseFloat(t.dataset.h || "0");
          if (H <= 0) return;
          const wrapY = mod(offset.current.y, H);
          t.style.transform = `translate3d(0, ${wrapY - H}px, 0)`;
        });
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [TW, smoothing, columns]);

  // Nombre de copies horizontales nécessaires pour couvrir le viewport.
  const M = vp.w > 0 && TW > 0 ? Math.ceil(vp.w / TW) + 2 : 1;

  return (
    <div
      ref={viewportRef}
      className={cx(
        "relative h-full w-full cursor-grab select-none overflow-hidden touch-none active:cursor-grabbing",
        className
      )}
    >
      <div
        ref={rowTrackRef}
        className="absolute left-0 top-0 flex h-full will-change-transform"
      >
        {Array.from({ length: M }).map((_, m) => (
          <div key={m} className="flex h-full shrink-0" style={{ gap, marginRight: gap }}>
            {columns.map((col, c) => {
              const H =
                col.reduce((h, src) => h + colW * ratioOf(src) + gap, 0) || 0;
              const R = H > 0 && vp.h > 0 ? Math.ceil(vp.h / H) + 2 : 1;
              return (
                <div
                  key={c}
                  className="relative h-full shrink-0 overflow-hidden"
                  style={{ width: colW }}
                >
                  <div
                    data-track
                    data-h={H}
                    className="absolute left-0 top-0 flex flex-col will-change-transform"
                    style={{ gap, width: colW }}
                  >
                    {Array.from({ length: R }).map((_, r) =>
                      col.map((src, idx) => (
                        <img
                          key={`${r}-${idx}`}
                          src={src}
                          data-src={src}
                          alt=""
                          draggable={false}
                          decoding="async"
                          onLoad={(e) => {
                            const im = e.currentTarget;
                            const ra = im.naturalWidth
                              ? im.naturalHeight / im.naturalWidth
                              : 1.3;
                            if (Math.abs((ratios.current[src] ?? -1) - ra) > 0.001) {
                              ratios.current[src] = ra;
                              scheduleTick();
                            }
                          }}
                          className="block h-auto w-full rounded-2xl border border-black/5 bg-neutral-100 shadow-sm"
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default InfiniteMasonry;
