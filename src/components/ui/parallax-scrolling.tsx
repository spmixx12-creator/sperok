"use client";

// parallax-scrolling.tsx
// Dernière section (hero « À propos ») en PARALLAXE épinglée (style Osmo) :
// la section se fige et, au scroll, les calques bougent à des vitesses
// différentes → profondeur nettement ressentie.
//   - Fond : logo « spérok » BLANC géant (bouge le plus).
//   - Premier plan : photo détourée (bouge en sens inverse).
//   - Contenu (tous les textes à leurs positions) : mouvement intermédiaire.
// GSAP + ScrollTrigger uniquement (pas de Lenis global). prefers-reduced-motion
// respecté. Cleanup via gsap.context().revert().
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CalendarCheck, Zap, Shield, Target, Hammer, Rocket } from "lucide-react";

import heroPhoto from "../../créa/spero-cutout.png";
import logoMask from "../../créa/sperok-mask.png";
import bgBoomerang from "../../créa/parallax-bg-boomerang.mp4";

gsap.registerPlugin(ScrollTrigger);

// Calques de profondeur (Osmo) — 2 (intermédiaire), 4 (premier plan).
// Le calque 1 (fond) est désormais une vidéo en boucle boomerang (bgBoomerang).
const OSMO_MID =
  "https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795b4d5ac529e7d3a562_osmo-parallax-layer-2.webp";
const OSMO_FRONT =
  "https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795bb5aceca85011ad83_osmo-parallax-layer-1.webp";

interface ParallaxHeroProps {
  onCalendly: () => void;
  onProjects: () => void;
}

// Logo « spérok » colorisé en blanc via masque (à n'importe quelle taille).
const logoStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  WebkitMaskImage: `url(${logoMask})`,
  maskImage: `url(${logoMask})`,
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskPosition: "center",
  maskPosition: "center",
};

export function ParallaxHero({ onCalendly, onProjects }: ParallaxHeroProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Calques de fond agrandis : marge de couverture pour une TRÈS ample
      // translation sans jamais découvrir de bord (T ≤ (scale+1)/2).
      gsap.set("[data-parallax-layer='1']", { scale: 1.6 });
      gsap.set("[data-parallax-layer='2']", { scale: 1.4 });
      gsap.set("[data-parallax-layer='4']", { scale: 1.2 });

      // PAS de pin : la parallaxe PROGRESSE au fur et à mesure que la section
      // sort de l'écran — c'est-à-dire exactement pendant que le footer se
      // dévoile en dessous. start "top top" (footer pas encore visible, effet à
      // 0) → end "bottom top" (footer entièrement révélé, effet à 100 %).
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      // Composition en place à pleine vue (0), forte dérive à mesure que le
      // footer se dévoile. Fond = grand mouvement, premier plan = faible.
      tl.to("[data-parallax-layer='1']", { yPercent: 115, ease: "none" }, 0);
      tl.to("[data-parallax-layer='2']", { yPercent: 82, ease: "none" }, 0);
      tl.to("[data-parallax='logo']", { yPercent: 60, ease: "none" }, 0);
      tl.to("[data-parallax='text']", { yPercent: 38, ease: "none" }, 0);
      tl.to("[data-parallax='photo']", { yPercent: 26, ease: "none" }, 0);
      tl.to("[data-parallax-layer='4']", { yPercent: 22, ease: "none" }, 0);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={rootRef}
      className="relative flex h-screen w-full select-none flex-col overflow-hidden bg-[#0d0d0d] px-6 pb-12 pt-6 text-white md:px-12 lg:justify-between"
    >
      {/* Réserve l'espace du logo persistant */}
      <div className="pointer-events-none h-12 w-full" />

      {/* Calque 1 — profondeur (fond, bouge le plus) : vidéo en boucle boomerang */}
      <video
        data-parallax-layer="1"
        src={bgBoomerang}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-70"
      />
      {/* Calque 2 — profondeur (intermédiaire) */}
      <img
        data-parallax-layer="2"
        src={OSMO_MID}
        alt=""
        aria-hidden
        loading="eager"
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover opacity-85"
      />

      {/* Logo « spérok » blanc, géant, entre les calques (parallaxe) */}
      <div
        data-parallax="logo"
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center"
      >
        <div className="mt-[14vh] h-[45vh] w-[92vw] opacity-90 lg:mt-0 lg:h-[60vh] lg:w-[60vw]" style={logoStyle} />
      </div>

      {/* Calque 4 — profondeur (premier plan, bouge le moins) */}
      <img
        data-parallax-layer="4"
        src={OSMO_FRONT}
        alt=""
        aria-hidden
        loading="eager"
        className="pointer-events-none absolute inset-0 z-[3] h-full w-full object-cover"
      />

      {/* Photo détourée (parallaxe, premier plan) */}
      <div
        data-parallax="photo"
        className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center"
      >
        <img
          src={heroPhoto}
          alt="Spéro Kouton"
          draggable={false}
          className="h-[68vh] w-auto translate-y-[4vh] object-contain object-bottom md:h-[82vh]"
        />
      </div>

      {/* ===================================================== */}
      {/* DESKTOP ( >= lg ) : grille 2 colonnes (parallaxe)     */}
      {/* ===================================================== */}
      <div
        data-parallax="text"
        className="relative z-20 mt-auto hidden w-full items-center gap-8 lg:grid lg:grid-cols-12"
      >
        <div className="flex flex-col items-start text-left lg:col-span-8">
          <h1 className="font-display text-5xl font-black uppercase leading-[0.95] tracking-tight text-white md:text-7xl lg:text-8xl">
            Design, <br />
            Appliqué <br />
            Différemment.
          </h1>

          <div className="mt-8 flex gap-4">
            <button
              onClick={onCalendly}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#F5B419] bg-[#F5B419] px-6 py-3.5 font-display text-xs font-bold uppercase tracking-wider text-[#191514] shadow-sm shadow-[#F5B419]/25 transition-all hover:bg-[#F5B419]/90 active:scale-95"
            >
              <CalendarCheck className="h-4 w-4" />
              <span>Réserver un appel</span>
            </button>
            <button
              onClick={onProjects}
              className="cursor-pointer rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 font-display text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-white/20 active:scale-95"
            >
              <span>Mes Réalisations</span>
            </button>
          </div>
        </div>

        <div className="flex h-full flex-col items-start justify-between gap-6 text-left lg:col-span-4 lg:items-end lg:text-right">
          {/* Qualificatifs */}
          <ul className="flex flex-col gap-2.5 font-display text-xs font-semibold uppercase tracking-wider text-white">
            <li className="flex items-center gap-2 lg:flex-row-reverse"><Zap className="h-3.5 w-3.5 text-[#F5B419]" /> <span>Créatif</span></li>
            <li className="flex items-center gap-2 lg:flex-row-reverse"><Shield className="h-3.5 w-3.5 text-[#F5B419]" /> <span>Fiable</span></li>
            <li className="flex items-center gap-2 lg:flex-row-reverse"><Target className="h-3.5 w-3.5 text-[#F5B419]" /> <span>Stratège</span></li>
            <li className="flex items-center gap-2 lg:flex-row-reverse"><Hammer className="h-3.5 w-3.5 text-[#F5B419]" /> <span>Bâtisseur</span></li>
            <li className="flex items-center gap-2 lg:flex-row-reverse"><Rocket className="h-3.5 w-3.5 text-[#F5B419]" /> <span>Efficace</span></li>
          </ul>

          <p className="max-w-xs text-xs leading-relaxed text-white/70 md:text-sm">
            J'accompagne les marques de la conception à la concrétisation. Mon objectif : allier beauté structurelle et identité forte pour marquer les esprits.
          </p>
        </div>
      </div>

      {/* ===================================================== */}
      {/* MOBILE / TABLETTE ( < lg ) : pile verticale (parallaxe) */}
      {/* ===================================================== */}
      <div
        data-parallax="text"
        className="relative z-20 flex flex-col items-center gap-6 pt-4 text-center lg:hidden"
      >
        <h1 className="font-display text-5xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl">
          Design, <br />
          Appliqué <br />
          Différemment.
        </h1>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <button
            onClick={onCalendly}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#F5B419] bg-[#F5B419] px-6 py-3.5 font-display text-xs font-bold uppercase tracking-wider text-[#191514] shadow-sm shadow-[#F5B419]/25 transition-all hover:bg-[#F5B419]/90 active:scale-95"
          >
            <CalendarCheck className="h-4 w-4" />
            <span>Réserver un appel</span>
          </button>
          <button
            onClick={onProjects}
            className="cursor-pointer rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 font-display text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-white/20 active:scale-95"
          >
            <span>Mes Réalisations</span>
          </button>
        </div>

        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-display text-xs font-semibold uppercase tracking-wider text-white">
          <li className="flex items-center gap-2"><Zap className="h-3.5 w-3.5 text-[#F5B419]" /> <span>Créatif</span></li>
          <li className="flex items-center gap-2"><Shield className="h-3.5 w-3.5 text-[#F5B419]" /> <span>Fiable</span></li>
          <li className="flex items-center gap-2"><Target className="h-3.5 w-3.5 text-[#F5B419]" /> <span>Stratège</span></li>
          <li className="flex items-center gap-2"><Hammer className="h-3.5 w-3.5 text-[#F5B419]" /> <span>Bâtisseur</span></li>
          <li className="flex items-center gap-2"><Rocket className="h-3.5 w-3.5 text-[#F5B419]" /> <span>Efficace</span></li>
        </ul>
      </div>

      {/* MOBILE / TABLETTE : paragraphe centré en bas, effet négatif
          (mix-blend-difference) → reste lisible sur tout fond. En parallaxe. */}
      <div
        data-parallax="text"
        className="absolute inset-x-0 bottom-0 z-20 px-6 pb-6 lg:hidden"
      >
        <p className="mx-auto max-w-xs text-center text-sm font-semibold leading-relaxed text-white mix-blend-difference">
          J'accompagne les marques de la conception à la concrétisation. Mon objectif : allier beauté structurelle et identité forte pour marquer les esprits.
        </p>
      </div>
    </section>
  );
}
