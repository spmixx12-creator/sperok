import React, { useEffect, useMemo, useRef } from "react";

interface InfiniteGalleryProps {
  images: { src: string; alt?: string }[];
  speed?: number;
  zSpacing?: number;
  visibleCount?: number;
  falloff?: { near: number; far: number };
  className?: string;
  /** Démarre la galerie déjà stabilisée (saute l'animation d'entrée cinématique). */
  skipIntro?: boolean;
}

// Coordonnées déterministes (hélice / spirale organique) pour chaque image.
// Pures → calculées une seule fois et mémoïsées.
function getCoordinates(i: number) {
  const seed = i * 2.3;
  const radiusX = 32; // % de largeur depuis le centre
  const radiusY = 22; // % de hauteur depuis le centre
  const x = Math.sin(seed) * radiusX;
  const y = Math.cos(seed * 0.7) * radiusY;
  const rotateY = -x * 0.6;
  const rotateX = y * 0.5;
  const rotateZ = (i % 2 === 0 ? 1 : -1) * (2 + (i % 4));
  return { x, y, rotateX, rotateY, rotateZ };
}

const INTRO_MS = 6000;
const Z_SCALE = 150; // px par unité de profondeur

/**
 * Galerie 3D infinie.
 *
 * Optimisation : aucun état React n'est mis à jour pendant le défilement. La
 * boucle requestAnimationFrame écrit DIRECTEMENT les styles (transform / opacity
 * / filter / zIndex) sur chaque carte via des refs. Résultat : zéro re-render
 * React par frame → mouvement très fluide. La boucle ne lit jamais le layout
 * (pas de reflow forcé), elle ne fait qu'écrire.
 */
export default function InfiniteGallery({
  images,
  speed = 1.0,
  zSpacing = 3,
  visibleCount = 12,
  falloff = { near: 0.8, far: 14 },
  className = "",
  skipIntro = false,
}: InfiniteGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Profondeur de scroll : démarrée loin dans la scène (15) pour l'effet d'entrée.
  const targetZRef = useRef(15);
  const currentZRef = useRef(15);

  // Horloge d'entrée + suivi des interactions (en refs, jamais en state).
  // skipIntro → horloge initialisée dans le passé : l'intro est déjà « terminée ».
  const startTimeRef = useRef<number | null>(
    skipIntro ? Date.now() - INTRO_MS : null,
  );
  const lastInteractionTimeRef = useRef(Date.now());
  const hoveredIndexRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);

  const isIntroActive = () =>
    !startTimeRef.current || Date.now() - startTimeRef.current < INTRO_MS;

  // Coordonnées pré-calculées une fois (dépend uniquement du nombre d'images).
  const coords = useMemo(
    () => images.map((_, i) => getCoordinates(i)),
    [images.length],
  );

  const { near, far } = falloff;

  // 1. Molette (avec verrou d'accumulation en haut de page pour « essayer un peu »).
  useEffect(() => {
    let accumulatedDelta = 0;
    const threshold = 600;

    const handleWheel = (e: WheelEvent) => {
      if (isIntroActive()) return;
      const delta = e.deltaY;

      if (window.scrollY < 5) {
        if (delta > 0 && accumulatedDelta < threshold) {
          if (e.cancelable) e.preventDefault();
          accumulatedDelta += Math.abs(delta);
        } else if (delta < 0 && accumulatedDelta > 0) {
          if (e.cancelable) e.preventDefault();
          accumulatedDelta = Math.max(0, accumulatedDelta - Math.abs(delta));
        }
      }

      targetZRef.current -= delta * 0.045 * speed; // direction inversée
      lastInteractionTimeRef.current = Date.now();
    };

    const container = containerRef.current;
    container?.addEventListener("wheel", handleWheel, { passive: false });
    return () => container?.removeEventListener("wheel", handleWheel);
  }, [speed]);

  // 2. Clavier.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isIntroActive()) return;
      let amount = 0;
      if (e.key === "ArrowUp" || e.key === "ArrowRight") amount = -1.2 * speed;
      else if (e.key === "ArrowDown" || e.key === "ArrowLeft") amount = 1.2 * speed;
      else if (e.key === "PageUp") amount = -4 * speed;
      else if (e.key === "PageDown") amount = 4 * speed;

      if (amount !== 0) {
        targetZRef.current += amount;
        lastInteractionTimeRef.current = Date.now();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [speed]);

  // 2b. Scroll de la page (accentue le zoom).
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleWindowScroll = () => {
      if (isIntroActive()) return;
      const currentScrollY = window.scrollY;
      const diffY = currentScrollY - lastScrollY;
      if (diffY !== 0) {
        targetZRef.current -= diffY * 0.008 * speed;
        lastInteractionTimeRef.current = Date.now();
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, [speed]);

  // Tactile.
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isIntroActive()) return;
    isDraggingRef.current = true;
    startYRef.current = e.touches[0].clientY;
    lastInteractionTimeRef.current = Date.now();
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isIntroActive() || !isDraggingRef.current) return;
    const currentY = e.touches[0].clientY;
    const diffY = startYRef.current - currentY;
    targetZRef.current -= diffY * 0.02 * speed; // direction inversée
    startYRef.current = currentY;
    lastInteractionTimeRef.current = Date.now();
  };
  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // 3. Boucle d'animation : calcul + écriture directe des styles (aucun setState).
  useEffect(() => {
    let raf: number;
    const total = images.length;
    const totalLength = total * zSpacing;

    const update = () => {
      if (!startTimeRef.current) startTimeRef.current = Date.now();
      const now = Date.now();
      const elapsed = now - startTimeRef.current;

      // Phases d'entrée cinématique.
      let globalScale = 1;
      let globalOpacity = 1;
      let speedMul = 1;
      if (elapsed < 2000) {
        globalScale = 0;
        globalOpacity = 0;
        speedMul = 0;
      } else if (elapsed < INTRO_MS) {
        const progress = (elapsed - 2000) / 4000;
        globalOpacity = Math.min(1, (elapsed - 2000) / 1500);
        globalScale = 1 - Math.pow(1 - progress, 4);
        speedMul = 1 + 65 * Math.pow(1 - progress, 3);
      }

      const timeSinceInteraction = now - lastInteractionTimeRef.current;
      const isIntroPlaying = elapsed < INTRO_MS;

      // Autoplay : avance continue si intro en cours ou inactivité > 3 s.
      if ((isIntroPlaying || timeSinceInteraction > 3000) && elapsed >= 2000) {
        targetZRef.current -= 0.005 * speed * speedMul;
      }

      // Lissage (lerp) vers la cible.
      const lerpFactor = isIntroPlaying
        ? 0.12
        : timeSinceInteraction < 1500
          ? 0.08
          : 0.05;
      currentZRef.current +=
        (targetZRef.current - currentZRef.current) * lerpFactor;
      const scrollZ = currentZRef.current;

      const introActive = isIntroPlaying;
      const hovered = hoveredIndexRef.current;

      for (let i = 0; i < total; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;

        // Boucle infinie : on ramène relativeZ dans [-far, near].
        let relativeZ = ((i * zSpacing - scrollZ) % totalLength);
        if (relativeZ > near) relativeZ -= totalLength;
        else if (relativeZ < -far) relativeZ += totalLength;

        // Opacité (brouillard) + flou de profondeur.
        let opacity = 1;
        let blur = 0;
        if (relativeZ > 0) {
          opacity = Math.max(0, (near - relativeZ) / near);
        } else if (relativeZ < -far) {
          opacity = 0;
        } else {
          const fadeStart = -far * 0.75;
          if (relativeZ < fadeStart) {
            opacity = Math.max(0, (relativeZ + far) / (far + fadeStart));
          }
          if (relativeZ < -far * 0.4) {
            blur = Math.min(6, Math.abs(relativeZ + far * 0.4) * 0.8);
          }
        }

        // Carte invisible → on la sort du flux de rendu.
        if (opacity * globalOpacity <= 0.01) {
          if (el.style.display !== "none") el.style.display = "none";
          continue;
        }
        if (el.style.display === "none") el.style.display = "";

        const c = coords[i];
        const translateZ = relativeZ * Z_SCALE;
        const scale = (hovered === i ? 1.08 : 1) * globalScale;

        el.style.transform =
          `translate3d(${c.x}vw, ${c.y}vh, ${translateZ}px) ` +
          `rotateX(${c.rotateX}deg) rotateY(${c.rotateY}deg) ` +
          `rotateZ(${c.rotateZ}deg) scale(${scale})`;
        el.style.opacity = `${opacity * globalOpacity}`;
        el.style.filter = blur > 0.1 ? `blur(${blur}px)` : "none";
        el.style.zIndex = `${Math.round((relativeZ + far) * 10)}`;
        el.style.pointerEvents = introActive ? "none" : "auto";
      }

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length, speed, zSpacing, near, far, coords]);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative select-none outline-none cursor-grab active:cursor-grabbing ${className}`}
      style={{
        perspective: "1000px",
        perspectiveOrigin: "50% 50%",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Scène 3D — cartes rendues UNE seule fois, mises à jour via refs. */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ transformStyle: "preserve-3d" }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="absolute"
            style={{
              width: "260px",
              height: "360px",
              transformStyle: "preserve-3d",
              willChange: "transform, opacity",
              opacity: 0,
              backfaceVisibility: "hidden",
            }}
            onMouseEnter={() => {
              if (!isIntroActive()) hoveredIndexRef.current = i;
            }}
            onMouseLeave={() => {
              if (hoveredIndexRef.current === i) hoveredIndexRef.current = null;
            }}
          >
            {/* Bordure/halo au survol gérés en CSS pur (pas de re-render). */}
            <div className="group relative w-full h-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl shadow-black/80 transition-[border-color,box-shadow] duration-300 hover:border-amber-400/80 hover:shadow-[0_0_25px_rgba(251,191,36,0.25)]">
              <img
                src={img.src}
                alt={img.alt || `Gallery Image ${i}`}
                className="w-full h-full object-cover select-none pointer-events-none brightness-90 transition-[filter] duration-300 group-hover:brightness-100"
                referrerPolicy="no-referrer"
                loading="lazy"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 font-mono text-[9px] text-white/50 tracking-widest uppercase">
                {String(i + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vignette d'ambiance qui fond les bords dans le fond clair. */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(circle, transparent 25%, rgba(250,247,242,0.9) 100%)",
        }}
      />
    </div>
  );
}
