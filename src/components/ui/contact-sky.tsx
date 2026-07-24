"use client";

// contact-sky.tsx
// Décor d'arrière-plan de la page contact, selon l'HEURE réelle au Bénin (UTC+1) :
//   - Journée (6–13 h) : ciel clair + quelques nuages.
//   - Après-midi (13–18 h) : fond ambre (charte) + rayons de soleil.
//   - Soirée / nuit (18–6 h) : fond noir + nuages sombres + étoiles.
// Le globe rotatif (cobe) est superposé, avec une palette qui contraste avec le
// fond du moment.
import { useMemo } from "react";
import { Globe } from "./globe";

export type SkyPeriod = "day" | "afternoon" | "night";

export function getBeninPeriod(): SkyPeriod {
  const h = (new Date().getUTCHours() + 1 + 24) % 24;
  if (h >= 6 && h < 13) return "day";
  if (h >= 13 && h < 18) return "afternoon";
  return "night";
}

// Fond de page par période.
export const SKY_BG: Record<SkyPeriod, string> = {
  day: "#eaf1fb",
  afternoon: "#F5B419",
  night: "#06070e",
};

type RGB = [number, number, number];
const AMBER: RGB = [245 / 255, 180 / 255, 25 / 255];

// Palette du globe (contraste avec le fond).
const GLOBE_PALETTE: Record<
  SkyPeriod,
  {
    dark: number;
    baseColor: RGB;
    glowColor: RGB;
    markerColor: RGB;
    mapBrightness: number;
    diffuse: number;
  }
> = {
  day: {
    dark: 0.15,
    baseColor: [0.12, 0.28, 0.55],
    glowColor: [0.45, 0.62, 1],
    markerColor: AMBER,
    mapBrightness: 9,
    diffuse: 1.3,
  },
  afternoon: {
    dark: 0.35,
    baseColor: [0.12, 0.12, 0.16],
    glowColor: [0.5, 0.3, 0.06],
    markerColor: AMBER,
    mapBrightness: 7,
    diffuse: 1.0,
  },
  night: {
    dark: 1,
    baseColor: [0.18, 0.22, 0.42],
    glowColor: [0.4, 0.48, 0.85],
    markerColor: AMBER,
    mapBrightness: 7,
    diffuse: 1.2,
  },
};

const SKY_CSS = `
@keyframes sky-cloud { from { transform: translateX(-15vw); } to { transform: translateX(115vw); } }
@keyframes sky-twinkle { 0%,100% { opacity: .15; } 50% { opacity: 1; } }
@keyframes sky-spin { to { transform: rotate(360deg); } }
@keyframes sky-pulse { 0%,100% { transform: scale(1); opacity:.9;} 50% { transform: scale(1.06); opacity:1;} }
.sky-cloud {
  position: absolute;
  border-radius: 9999px;
  filter: blur(24px);
  will-change: transform;
}
.sky-star {
  position: absolute;
  border-radius: 9999px;
  background: #fff;
  animation: sky-twinkle var(--d,3s) ease-in-out infinite;
}
`;

function Clouds({ dark }: { dark: boolean }) {
  const color = dark ? "rgba(120,125,150,0.28)" : "rgba(255,255,255,0.9)";
  const clouds = [
    { top: "14%", w: 260, h: 90, dur: 60, delay: 0 },
    { top: "30%", w: 180, h: 64, dur: 85, delay: -20 },
    { top: "62%", w: 320, h: 110, dur: 74, delay: -45 },
    { top: "78%", w: 150, h: 56, dur: 95, delay: -10 },
  ];
  return (
    <>
      {clouds.map((c, i) => (
        <div
          key={i}
          className="sky-cloud"
          style={{
            top: c.top,
            width: c.w,
            height: c.h,
            background: color,
            animation: `sky-cloud ${c.dur}s linear ${c.delay}s infinite`,
          }}
        />
      ))}
    </>
  );
}

function SunRays() {
  return (
    <div className="absolute left-1/2 top-[-18%] h-[70vh] w-[70vh] -translate-x-1/2">
      {/* Rayons */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.55) 0deg 4deg, transparent 4deg 14deg)",
          maskImage: "radial-gradient(circle at 50% 50%, #000 0%, transparent 62%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, #000 0%, transparent 62%)",
          animation: "sky-spin 90s linear infinite",
          filter: "blur(1px)",
        }}
      />
      {/* Disque solaire */}
      <div
        className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, #fff 0%, #fff6d8 45%, rgba(255,240,190,0) 72%)",
          animation: "sky-pulse 6s ease-in-out infinite",
        }}
      />
    </div>
  );
}

function Stars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 70 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 1.8 + 0.6,
        dur: Math.random() * 2.5 + 1.8,
        delay: Math.random() * 3,
      })),
    [],
  );
  return (
    <>
      {stars.map((s, i) => (
        <span
          key={i}
          className="sky-star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
            ["--d" as string]: `${s.dur}s`,
          }}
        />
      ))}
    </>
  );
}

export function ContactSky({ period }: { period: SkyPeriod }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: SKY_CSS }} />

      {period === "afternoon" && <SunRays />}
      {(period === "day" || period === "night") && (
        <Clouds dark={period === "night"} />
      )}
      {period === "night" && <Stars />}

      {/* Globe rotatif, adapté au fond du moment */}
      <div className="absolute left-1/2 top-1/2 aspect-square w-[92vw] max-w-[860px] -translate-x-1/2 -translate-y-1/2 opacity-100">
        <Globe className="!relative !inset-auto !max-w-none" palette={GLOBE_PALETTE[period]} />
      </div>
    </div>
  );
}

export default ContactSky;
