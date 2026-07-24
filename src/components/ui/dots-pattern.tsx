'use client';

// dots-pattern.tsx
// Grille de points INTERACTIVE (canvas) — inspirée de cursify « interactive
// dots ». Les points proches du curseur s'illuminent (ambre) et grossissent.
// Sert de fond décoratif plein écran. Pointeur écouté sur `window` pour réagir
// même lorsque le curseur survole le contenu par-dessus.
import { useEffect, useRef } from 'react';

const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ');

interface InteractiveDotsProps {
  className?: string;
  /** Espacement de la grille (px). */
  gap?: number;
  /** Rayon d'influence du curseur (px). */
  hoverRadius?: number;
}

export default function InteractiveDots({
  className,
  gap = 28,
  hoverRadius = 150,
}: InteractiveDotsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onLeave);

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const mx = mouse.current.x;
      const my = mouse.current.y;

      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const dist = Math.hypot(x - mx, y - my);
          // t = 1 au plus près du curseur, 0 au-delà du rayon.
          const t = Math.max(0, 1 - dist / hoverRadius);
          const eased = t * t;
          const radius = 1 + eased * 2.4;
          // Gris sombre au loin → ambre vif près du curseur.
          const rr = Math.round(90 + (245 - 90) * eased);
          const gg = Math.round(90 + (180 - 90) * eased);
          const bb = Math.round(90 + (25 - 90) * eased);
          const alpha = 0.1 + 0.8 * eased;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rr}, ${gg}, ${bb}, ${alpha})`;
          ctx.fill();
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
    };
  }, [gap, hoverRadius]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cx('pointer-events-none absolute inset-0 h-full w-full', className)}
    />
  );
}
