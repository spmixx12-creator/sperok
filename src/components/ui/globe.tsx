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
  markers: [
    { location: [6.3703, 2.3912], size: 0.12 }, // Cotonou, Bénin (mis en avant)
    { location: [48.8566, 2.3522], size: 0.05 }, // Paris
    { location: [40.7128, -74.006], size: 0.05 }, // New York
    { location: [-33.8688, 151.2093], size: 0.05 }, // Sydney
    { location: [35.6762, 139.6503], size: 0.05 }, // Tokyo
  ],
};

export function Globe({
  className,
  config,
}: {
  className?: string;
  config?: COBEOptions;
}) {
  let phi = 0;
  let width = 0;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  const r = useMotionValue(0);
  const rs = useSpring(r, { mass: 1, damping: 30, stiffness: 100 });

  // Config = base + couleurs de l'heure au Bénin (recalculée au montage).
  const resolvedConfig = useMemo<GlobeOptions>(
    () => (config ? config : { ...BASE_CONFIG, ...beninPalette() }),
    [config],
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
    const onResize = () => {
      if (canvasRef.current) width = canvasRef.current.offsetWidth;
    };
    window.addEventListener("resize", onResize);
    onResize();

    const opts: GlobeOptions = {
      ...resolvedConfig,
      width: width * 2,
      height: width * 2,
      onRender: (state) => {
        if (!pointerInteracting.current) phi += 0.005;
        state.phi = phi + rs.get();
        state.width = width * 2;
        state.height = width * 2;
      },
    };
    const globe = createGlobe(canvasRef.current!, opts);

    const t = setTimeout(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1";
    });

    return () => {
      clearTimeout(t);
      globe.destroy();
      window.removeEventListener("resize", onResize);
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
