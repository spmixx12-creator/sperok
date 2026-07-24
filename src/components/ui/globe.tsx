"use client";

// globe.tsx
// Globe 3D rotatif (magicui / cobe), adapté pour ce projet :
//   - `cn` (shadcn) → helper local `cx`, `motion/react`,
//   - COULEURS pilotées par l'HEURE réelle au Bénin (UTC+1) : nuit sombre/bleutée,
//     aube & crépuscule dorées, jour clair. Marqueur ambre sur Cotonou.
import createGlobe, { type COBEOptions } from "cobe";
import { useEffect, useMemo, useRef } from "react";
import { useMotionValue, useSpring } from "motion/react";

const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

const MOVEMENT_DAMPING = 1400;
type RGB = [number, number, number];
const AMBER: RGB = [245 / 255, 180 / 255, 25 / 255];

// cobe v2 supporte `onRender` au runtime mais l'omet de ses types → on l'ajoute.
type GlobeOptions = COBEOptions & {
  onRender?: (state: Record<string, number>) => void;
};

// Palette selon l'heure locale au Bénin (UTC+1, sans heure d'été).
function beninPalette() {
  const hour = (new Date().getUTCHours() + 1 + 24) % 24;
  if (hour >= 21 || hour < 5) {
    // Nuit — globe bleuté nettement visible sur fond sombre, halo froid.
    return {
      dark: 1,
      baseColor: [0.18, 0.22, 0.42] as RGB,
      glowColor: [0.35, 0.42, 0.75] as RGB,
      mapBrightness: 7,
      diffuse: 1.2,
    };
  }
  if ((hour >= 5 && hour < 8) || (hour >= 18 && hour < 21)) {
    // Aube / crépuscule (doré)
    return {
      dark: 0.4,
      baseColor: [0.95, 0.62, 0.35] as RGB,
      glowColor: [1, 0.72, 0.42] as RGB,
      mapBrightness: 7,
      diffuse: 1.2,
    };
  }
  // Jour (clair)
  return {
    dark: 0,
    baseColor: [1, 1, 1] as RGB,
    glowColor: [0.9, 0.95, 1] as RGB,
    mapBrightness: 8,
    diffuse: 1.3,
  };
}

const BASE_CONFIG: GlobeOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 1.2,
  mapSamples: 16000,
  mapBrightness: 6,
  baseColor: [1, 1, 1],
  markerColor: AMBER,
  glowColor: [1, 1, 1],
  markers: [], // pas de points/marqueurs — uniquement la sphère
};

type GlobePalette = Partial<
  Pick<
    COBEOptions,
    "dark" | "baseColor" | "glowColor" | "markerColor" | "mapBrightness" | "diffuse"
  >
>;

export function Globe({
  className,
  config,
  palette,
}: {
  className?: string;
  config?: COBEOptions;
  palette?: GlobePalette;
}) {
  let phi = 0;
  const widthRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  const r = useMotionValue(0);
  const rs = useSpring(r, { mass: 1, damping: 30, stiffness: 100 });

  // Config = base + couleurs de l'heure au Bénin (recalculée au montage).
  const resolvedConfig = useMemo<GlobeOptions>(
    () =>
      config
        ? config
        : { ...BASE_CONFIG, ...beninPalette(), ...(palette ?? {}) },
    [config, palette],
  );

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const measure = () => {
      widthRef.current = canvas.offsetWidth;
    };
    measure();

    // Suit les changements de taille du canvas (fiable, contrairement au seul
    // event window 'resize').
    const ro = new ResizeObserver(measure);
    ro.observe(canvas);

    let globe: ReturnType<typeof createGlobe> | null = null;
    let raf = 0;
    let cancelled = false;

    // Attendre que la largeur soit connue (> 0) avant de créer le globe :
    // sinon il est créé à 0px et reste invisible (seuls les marqueurs).
    const start = () => {
      if (cancelled) return;
      measure();
      if (widthRef.current === 0) {
        raf = requestAnimationFrame(start);
        return;
      }
      const opts: GlobeOptions = {
        ...resolvedConfig,
        width: widthRef.current * 2,
        height: widthRef.current * 2,
        onRender: (state) => {
          if (!pointerInteracting.current) phi += 0.005;
          state.phi = phi + rs.get();
          state.width = widthRef.current * 2;
          state.height = widthRef.current * 2;
        },
      };
      globe = createGlobe(canvas, opts);
      requestAnimationFrame(() => {
        canvas.style.opacity = "1";
      });
    };
    start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      globe?.destroy();
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rs, resolvedConfig]);

  return (
    <div
      className={cx(
        "absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]",
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        className="size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
        onPointerDown={(e) =>
          updatePointerInteraction(e.clientX - pointerInteractionMovement.current)
        }
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  );
}

export default Globe;
