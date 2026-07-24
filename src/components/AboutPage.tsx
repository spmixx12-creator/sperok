import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  CalendarCheck, 
  ArrowRight, 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUp, 
  ExternalLink,
  Zap,
  Shield,
  Target,
  Hammer,
  Rocket
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { BlurFade } from './ui/blur-fade';
import Logo from './Logo';

// Enregistrement de ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Imports d'images locales
import cvCutout from '../créa/Beige Noir Moderne Minimaliste CV (5).png';
import profilePortrait from '../créa/WhatsApp Image 2026-06-25 at 22.33.55.jpeg';
import gamplaySite from '../créa/gamplay-site.png';
import vintageSite from '../créa/vintage-site.png';
import snakiSite from '../créa/snaki-site.png';

interface AboutPageProps {
  onBack: () => void;
}

interface TimelineItem {
  year: string;
  title: string;
  text: string;
  tag: string;
}

const TIMELINE_DATA: TimelineItem[] = [
  {
    year: '2018 - 2020',
    tag: '@paint',
    title: 'Les débuts, pixel par pixel',
    text: "Mes premiers designs, je les faisais en pixel art sur Microsoft Paint. Aucune formation, juste de la curiosité.",
  },
  {
    year: '2020 - 2023',
    tag: '@youtube',
    title: 'Apprendre en autodidacte',
    text: "YouTube est devenu mon école. Tutoriel après tutoriel, j'ai construit mes bases en design.",
  },
  {
    year: '2023',
    tag: '@bac',
    title: 'Obtention de mon BAC',
    text: "Une étape clé franchie, ouvrant de nouveaux horizons pour perfectionner mes compétences et viser plus grand.",
  },
  {
    year: '2024',
    tag: '@gameplay',
    title: 'Premier vrai client',
    text: "Premier projet concret pour Gameplay. Premier vrai brief, première vraie pression.",
  },
  {
    year: '2024',
    tag: '@snaki',
    title: 'La confiance grandit',
    text: "Snaki m'a fait confiance à son tour. Le début d'une vraie crédibilité.",
  },
  {
    year: '2026',
    tag: '@vintage',
    title: 'Fondation de Vintage',
    text: "J'ai co-fondé Vintage, une marketplace béninoise de seconde main. Un projet complet combinant produit et marque.",
  },
  {
    year: '2026',
    tag: '@dir-art',
    title: 'Directeur Artistique de Vintage',
    text: "Prendre la direction créative et piloter la vision de marque de A à Z pour donner une âme au projet.",
  },
  {
    year: '2026',
    tag: '@genie-civil',
    title: 'Licence Génie Civil à l\'ESGC',
    text: "En parallèle, je termine ma licence en Génie Civil. Construire des structures et des marques : la même exigence.",
  },
  {
    year: 'Aujourd\'hui',
    tag: '@aujourdhui',
    title: 'L\'histoire continue',
    text: "Le design ne s'arrête jamais d'évoluer, moi non plus. Même obsession du détail, nouveaux outils, nouveaux projets.",
  }
];

const PROJECTS_PREVIEW = [
  {
    id: '01',
    title: 'Vintage',
    tags: ['Branding', 'UI/UX', 'Stratégie'],
    description: "Première marketplace d'occasion sécurisée du Bénin. Interface de confiance, claire et rassurante.",
    image: vintageSite,
    link: '#/projets'
  },
  {
    id: '02',
    title: 'Gamplay',
    tags: ['E-Commerce', 'Branding', 'Development'],
    description: "Boutique d'accessoires gaming pensée pour la performance. Univers sombre et nerveux.",
    image: gamplaySite,
    link: '#/projets'
  },
  {
    id: '03',
    title: 'Snaki',
    tags: ['UI/UX', 'Branding', 'Social Media'],
    description: "Site de commande pour bubble tea & snacks. Interface gourmande et fluide.",
    image: snakiSite,
    link: '#/projets'
  }
];

// Composant de fenêtre sticky/mockup de droite
function StickyWindow({ activeTag }: { activeTag: string }) {
  return (
    <div className="w-full h-full rounded-2xl bg-[#101010] border border-neutral-800 shadow-2xl flex flex-col overflow-hidden text-white font-mono text-[10px]">
      {/* Barre d'adresse type Mac */}
      <div className="h-9 border-b border-neutral-800/80 bg-neutral-900/40 flex items-center px-4 relative shrink-0">
        <div className="flex gap-1.5 absolute left-4">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
        </div>
        <div className="mx-auto w-48 bg-neutral-950/60 rounded py-1 px-3 text-[9px] text-neutral-500 text-center truncate">
          {activeTag === '@paint' ? 'microsoft-paint.app' :
           activeTag === '@youtube' ? 'youtube.com/spero' :
           activeTag === '@bac' ? 'baccalaureat-2023.edu' :
           activeTag === '@gameplay' ? 'gamplay.site' :
           activeTag === '@snaki' ? 'snaki-bubbletea.com' :
           activeTag === '@vintage' ? 'vintage.bj' :
           activeTag === '@dir-art' ? 'figma.com/creative' :
           activeTag === '@genie-civil' ? 'esgc-engineering.bj' :
           'sperokouton.com/2026'}
        </div>
      </div>

      {/* Zone de contenu de la fenêtre avec cross-fade */}
      <div className="flex-1 relative bg-neutral-950 flex items-center justify-center p-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTag}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full flex flex-col items-center justify-center relative"
          >
            {activeTag === '@paint' && (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <div className="border border-neutral-700 bg-neutral-900 p-3 rounded flex flex-col gap-2 shadow-xl">
                  <div className="grid grid-cols-8 gap-1 w-36 h-24 bg-white border border-neutral-700 p-1">
                    <div className="col-span-8 bg-[#F5B419] h-2 rounded-sm" />
                    <div className="col-span-3 bg-black h-5 rounded-sm" />
                    <div className="col-span-5 bg-neutral-200 h-5 rounded-sm" />
                    <div className="col-span-8 bg-[#F5B419] h-6 flex items-center justify-center text-[9px] text-black font-bold font-sans">PAINT - 2018</div>
                  </div>
                  <span className="text-[9px] text-neutral-500 text-center uppercase tracking-wider">Paint Canvas - 2018</span>
                </div>
              </div>
            )}

            {activeTag === '@youtube' && (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <div className="w-full max-w-[220px] aspect-video bg-neutral-900 border border-neutral-800 rounded flex items-center justify-center relative group shadow-xl">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-red-600/30">
                    ▶
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 h-1 bg-neutral-700 rounded-full overflow-hidden">
                    <div className="w-[70%] h-full bg-red-600" />
                  </div>
                </div>
                <span className="text-[9px] text-neutral-500 text-center uppercase tracking-wider">Tutoriels Design - 2020</span>
              </div>
            )}

            {activeTag === '@bac' && (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <div className="border border-[#F5B419]/40 bg-neutral-900 p-5 rounded-lg flex flex-col items-center justify-center shadow-lg shadow-[#F5B419]/5">
                  <span className="text-4xl">🎓</span>
                  <span className="mt-3 font-display font-black text-sm uppercase tracking-wider text-[#F5B419]">BACCALAURÉAT</span>
                  <span className="text-[9px] text-neutral-500 mt-1 uppercase">Option Scientifique - 2023</span>
                </div>
              </div>
            )}

            {activeTag === '@gameplay' && (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <img 
                  src={gamplaySite} 
                  alt="Gameplay Site" 
                  className="w-full max-w-[240px] rounded border border-neutral-800 shadow-xl object-contain" 
                />
                <span className="text-[9px] text-neutral-500 text-center uppercase tracking-wider">Gameplay Project - 2024</span>
              </div>
            )}

            {activeTag === '@snaki' && (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <img 
                  src={snakiSite} 
                  alt="Snaki Site" 
                  className="w-full max-w-[240px] rounded border border-neutral-800 shadow-xl object-contain" 
                />
                <span className="text-[9px] text-neutral-500 text-center uppercase tracking-wider">Snaki Bubble Tea - 2024</span>
              </div>
            )}

            {activeTag === '@vintage' && (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <img 
                  src={vintageSite} 
                  alt="Vintage Site" 
                  className="w-full max-w-[240px] rounded border border-neutral-800 shadow-xl object-contain" 
                />
                <span className="text-[9px] text-neutral-500 text-center uppercase tracking-wider">Vintage Marketplace - 2026</span>
              </div>
            )}

            {activeTag === '@dir-art' && (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <div className="border border-neutral-800 bg-neutral-900 p-4 rounded flex flex-col gap-2 w-48 shadow-xl">
                  <div className="flex gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-black border border-neutral-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-500" />
                  </div>
                  <div className="text-[9px] text-neutral-300 font-sans tracking-wide leading-relaxed italic">
                    "Identité forte, teintes ambrées & grilles modernes."
                  </div>
                  <span className="text-[8px] text-[#F5B419] uppercase tracking-wider font-bold mt-1">Vision Créative</span>
                </div>
              </div>
            )}

            {activeTag === '@genie-civil' && (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <div className="w-44 h-32 border border-neutral-800 bg-neutral-900 rounded p-3 flex flex-col justify-between relative overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:10px_10px]" />
                  <div className="relative z-10 border border-neutral-700/60 flex-1 rounded flex items-center justify-center text-[10px] text-neutral-400">
                    <div className="w-full h-[1px] bg-amber-400/30 rotate-12 absolute" />
                    <div className="w-full h-[1px] bg-amber-400/30 -rotate-12 absolute" />
                    <span>STRUCTURES // ESGC</span>
                  </div>
                  <span className="text-[8px] text-[#F5B419] uppercase tracking-wider mt-1 text-center font-bold z-10">Licence Génie Civil - 2026</span>
                </div>
              </div>
            )}

            {activeTag === '@aujourdhui' && (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <div className="w-48 border border-neutral-800 bg-neutral-900 p-4 rounded flex flex-col gap-2 shadow-xl">
                  <div className="flex justify-between items-center text-[8px] text-neutral-500 border-b border-neutral-800 pb-1.5">
                    <span>index.tsx</span>
                    <span className="text-[#F5B419]">active</span>
                  </div>
                  <code className="text-[8px] text-neutral-300 leading-tight">
                    {`const spero = {\n  role: "Creative Designer",\n  obsessedByDetail: true,\n  nextProject: "Yours"\n};`}
                  </code>
                </div>
                <span className="text-[9px] text-neutral-500 text-center uppercase tracking-wider">Aujourd'hui / 2026</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function AboutPage({ onBack }: AboutPageProps) {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');
  const [activeTag, setActiveTag] = useState('@paint');
  const [timelineHeight, setTimelineHeight] = useState(0);
  const [showCalendly, setShowCalendly] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pathBgRef = useRef<SVGPathElement>(null);

  // Remonter en haut au chargement
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  // Copier l'e-mail
  const handleCopyEmail = () => {
    navigator.clipboard.writeText('koutonsperop@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Ouvrir Calendly
  const handleOpenCalendly = () => {
    const w = window as any;
    if (w.Calendly) {
      w.Calendly.initPopupWidget({ url: 'https://calendly.com/koutonsperop/30min' });
    } else {
      window.open('https://calendly.com/koutonsperop/30min', '_blank');
    }
  };

  // Mesurer la hauteur de la timeline
  useEffect(() => {
    if (!timelineRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setTimelineHeight(entry.contentRect.height);
      }
    });
    resizeObserver.observe(timelineRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Générer le tracé ondulé du SVG de la timeline
  const getPathD = (height: number) => {
    if (height === 0) return 'M 0 0';
    let d = 'M 0 0';
    const step = 320; // espacement des vagues
    const count = Math.ceil(height / step);
    for (let i = 0; i < count; i++) {
      const startY = i * step;
      const endY = Math.min((i + 1) * step, height);
      const midY = (startY + endY) / 2;
      const offset = i % 2 === 0 ? 30 : -30;
      d += ` Q ${offset} ${midY}, 0 ${endY}`;
    }
    return d;
  };

  const pathD = getPathD(timelineHeight);

  // GSAP animations
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    // Initialisation Lenis
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // 1. Transition Hero -> About (motion blur & scale blur au scroll)
      gsap.to(heroRef.current, {
        opacity: 0.15,
        filter: 'blur(8px) scale(0.96)',
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'bottom 90%',
          end: 'bottom top',
          scrub: true,
        }
      });

      // 2. Révélation Sidebar (Fade in)
      gsap.fromTo(sidebarRef.current, 
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#about-intro',
            start: 'top 80%',
            end: 'top 50%',
            scrub: true,
          }
        }
      );

      // 3. Animation du tracé actif de la timeline SVG
      if (pathRef.current) {
        const pathLength = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 30%',
            end: 'bottom 80%',
            scrub: true,
          }
        });
      }

      // 4. Scrollspy pour chaque étape de la timeline
      TIMELINE_DATA.forEach((item) => {
        ScrollTrigger.create({
          trigger: `[data-timeline-tag="${item.tag}"]`,
          start: 'top center+=120',
          end: 'bottom center+=120',
          onToggle: (self) => {
            if (self.isActive) {
              setActiveTag(item.tag);
            }
          }
        });
      });

      // 5. Scrollspy global de section pour le menu
      const trackSections = ['intro', 'timeline', 'projects'];
      trackSections.forEach((section) => {
        ScrollTrigger.create({
          trigger: `#about-${section}`,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (self.isActive) setActiveSection(section);
          }
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
      lenis.destroy();
      gsap.ticker.remove(tick);
    };
  }, [timelineHeight]);

  const handleScrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#F8F5F0] text-[#191514] font-sans selection:bg-[#F5B419] selection:text-[#191514] overflow-x-hidden">
      {/* Logo adaptatif persistant global (seul élément visible en haut) */}
      <Logo />

      {/* Texture papier/film grain */}
      <div className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.035] bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')]" />

      {/* ========================================== */}
      {/* 2. SECTION HERO                            */}
      {/* ========================================== */}
      <section 
        id="about-hero"
        ref={heroRef}
        className="relative h-screen w-full flex flex-col justify-between pt-6 pb-12 px-6 md:px-12 select-none overflow-hidden bg-[#F8F5F0]"
      >
        {/* Navigation vide pour réserver l'espace du logo persistant */}
        <div className="h-12 w-full pointer-events-none" />

        {/* Nom géant en arrière-plan */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-display font-black uppercase text-[17vw] leading-none text-[#F5B419]/35 select-none tracking-tighter mt-12 whitespace-nowrap">
            SPÉRO KOUTON
          </span>
        </div>

        {/* Photo de Spéro détourée qui chevauche le nom géant */}
        <div className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none select-none pb-4">
          <div className="h-[55vh] md:h-[65vh] lg:h-[70vh] w-auto">
            <img 
              src={cvCutout} 
              alt="Spéro Kouton" 
              draggable={false}
              className="h-full w-auto object-contain object-bottom"
            />
          </div>
        </div>

        {/* Colonnes interactives et contenu du Hero */}
        <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-auto w-full">
          {/* Gauche : Titre d'accroche et Badges flottants */}
          <div className="lg:col-span-8 flex flex-col items-start text-left">
            {/* Badges Flottants */}
            <div className="flex gap-3 mb-6">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-300 bg-white/70 backdrop-blur-md text-[10px] font-semibold tracking-wider font-mono">
                💼 +200 PROJETS
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-300 bg-white/70 backdrop-blur-md text-[10px] font-semibold tracking-wider font-mono">
                ⭐️ +2 ANS D'EXP
              </span>
            </div>

            <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-tight text-[#191514] leading-[0.95] uppercase">
              Design, <br />
              Appliqué <br />
              Différemment.
            </h1>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={handleOpenCalendly}
                className="px-6 py-3.5 bg-[#F5B419] text-[#191514] font-display font-bold text-xs uppercase tracking-wider rounded-xl border border-[#F5B419] hover:bg-[#F5B419]/90 transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-[#F5B419]/25 active:scale-95"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Réserver un appel</span>
              </button>
              <button 
                onClick={() => handleScrollToId('about-intro')}
                className="px-6 py-3.5 bg-white/40 text-[#191514] font-display font-bold text-xs uppercase tracking-wider rounded-xl border border-neutral-300 hover:bg-white/80 transition-all cursor-pointer active:scale-95"
              >
                <span>À propos de moi</span>
              </button>
            </div>
          </div>

          {/* Droite : Qualificatifs, Paragraphe & Signature */}
          <div className="lg:col-span-4 flex flex-col justify-between items-start lg:items-end h-full text-left lg:text-right gap-6">
            {/* Liste de 5 qualificatifs */}
            <ul className="flex flex-col gap-2.5 font-display text-xs font-semibold tracking-wider uppercase">
              <li className="flex items-center gap-2 lg:flex-row-reverse"><Zap className="w-3.5 h-3.5 text-[#F5B419]" /> <span>Créatif</span></li>
              <li className="flex items-center gap-2 lg:flex-row-reverse"><Shield className="w-3.5 h-3.5 text-[#F5B419]" /> <span>Fiable</span></li>
              <li className="flex items-center gap-2 lg:flex-row-reverse"><Target className="w-3.5 h-3.5 text-[#F5B419]" /> <span>Stratège</span></li>
              <li className="flex items-center gap-2 lg:flex-row-reverse"><Hammer className="w-3.5 h-3.5 text-[#F5B419]" /> <span>Bâtisseur</span></li>
              <li className="flex items-center gap-2 lg:flex-row-reverse"><Rocket className="w-3.5 h-3.5 text-[#F5B419]" /> <span>Efficace</span></li>
            </ul>

            {/* Paragraphe explicatif */}
            <p className="max-w-xs text-neutral-600 text-xs md:text-sm leading-relaxed">
              J'accompagne les marques de la conception à la concrétisation. Mon objectif : allier beauté structurelle et identité forte pour marquer les esprits.
            </p>

            {/* Signature */}
            <div className="font-mono text-[9px] uppercase tracking-widest text-[#F5B419] font-bold bg-[#191514] text-white px-3 py-1.5 rounded">
              Le designer autodidacte. C'est Spéro.
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 1. LAYOUT PRINCIPAL À DEUX COLONNES        */}
      {/* ========================================== */}
      <div className="relative w-full flex flex-col lg:flex-row border-t border-neutral-200">
        
        {/* COLONNE GAUCHE : Sidebar sticky (Écrans >= lg uniquement) */}
        <aside 
          ref={sidebarRef}
          className="hidden lg:block w-80 lg:w-[22rem] shrink-0 border-r border-neutral-200 sticky top-0 h-screen p-8 bg-[#F8F5F0] z-40 flex flex-col justify-between overflow-y-auto"
        >
          {/* Logo / Monogramme */}
          <div>
            <div className="flex items-center gap-4">
              <div 
                onClick={onBack}
                className="w-12 h-12 bg-[#F5B419] flex items-center justify-center font-display font-black text-xl text-[#191514] cursor-pointer hover:scale-105 transition-transform"
              >
                SK
              </div>
              <div>
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#191514]">Spéro KOUTON</h4>
                <p className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest">DESIGNER CRÉATIF</p>
              </div>
            </div>

            {/* Paragraphe de positionnement */}
            <p className="mt-8 text-xs text-neutral-600 leading-relaxed">
              Designer autodidacte basé au Bénin. J'applique le design différemment pour concevoir des identités visuelles vivantes et des produits soignés.
            </p>

            {/* Badges statistiques */}
            <div className="grid grid-cols-2 gap-2 mt-6">
              <div className="border border-neutral-200 bg-white/50 p-3 text-center">
                <span className="block font-display font-black text-lg text-[#191514]">+200</span>
                <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-400">Projets</span>
              </div>
              <div className="border border-neutral-200 bg-white/50 p-3 text-center">
                <span className="block font-display font-black text-lg text-[#191514]">+2 ans</span>
                <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-400">Expérience</span>
              </div>
            </div>

            {/* Menu de navigation vertical avec scrollspy */}
            <nav className="mt-8 flex flex-col gap-1.5 font-display text-xs uppercase tracking-wider font-semibold">
              <button 
                onClick={onBack} 
                className="flex items-center justify-between px-3 py-2 text-left hover:bg-neutral-100 transition-colors font-bold"
              >
                Accueil
              </button>
              <button 
                onClick={() => handleScrollToId('about-intro')} 
                className={`flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer ${activeSection === 'intro' ? 'bg-[#F5B419] text-[#191514]' : 'hover:bg-neutral-100'}`}
              >
                À propos
              </button>
              <button 
                onClick={() => handleScrollToId('about-timeline')} 
                className={`flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer ${activeSection === 'timeline' ? 'bg-[#F5B419] text-[#191514]' : 'hover:bg-neutral-100'}`}
              >
                Mon parcours
              </button>
              <button 
                onClick={() => handleScrollToId('about-projects')} 
                className={`flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer ${activeSection === 'projects' ? 'bg-[#F5B419] text-[#191514]' : 'hover:bg-neutral-100'}`}
              >
                Projets
              </button>
            </nav>

            {/* Rangée de logos clients */}
            <div className="mt-8 border-t border-neutral-200 pt-6">
              <span className="block font-mono text-[8px] uppercase tracking-widest text-neutral-400 mb-3">// CLIENTS MARQUANTS</span>
              <div className="flex flex-wrap gap-2 text-[10px] font-mono text-neutral-500">
                <span className="bg-neutral-100 px-2 py-1 rounded">Vintage</span>
                <span className="bg-neutral-100 px-2 py-1 rounded">Gameplay</span>
                <span className="bg-neutral-100 px-2 py-1 rounded">Snaki</span>
                <span className="bg-neutral-100 px-2 py-1 rounded">La Pause Bleue</span>
              </div>
            </div>
          </div>

          {/* Bas : Email, copy, réseaux & CTA */}
          <div className="mt-8 border-t border-neutral-200 pt-6 space-y-4">
            {/* Email cliquable avec icône copier */}
            <div className="flex items-center justify-between bg-white border border-neutral-200 px-3 py-2 text-xs">
              <a href="mailto:koutonsperop@gmail.com" className="font-mono text-[10px] text-neutral-600 hover:text-[#F5B419] transition-colors truncate">
                koutonsperop@gmail.com
              </a>
              <button 
                onClick={handleCopyEmail}
                className="text-neutral-400 hover:text-[#191514] transition-colors p-1 cursor-pointer"
                title="Copier l'e-mail"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Réseaux sociaux */}
            <div className="flex gap-4 items-center justify-center py-1">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#F5B419] transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#F5B419] transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="mailto:koutonsperop@gmail.com" className="text-neutral-400 hover:text-[#F5B419] transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>

            {/* CTA Réservation */}
            <button 
              onClick={handleOpenCalendly}
              className="w-full py-3 bg-[#F5B419] text-[#191514] font-display font-bold text-xs uppercase tracking-wider border border-[#F5B419] hover:bg-[#F5B419]/90 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Réserver un appel</span>
            </button>
          </div>
        </aside>

        {/* COLONNE DROITE : Layout de contenu scindé en 2 sous-colonnes sur PC */}
        <main className="flex-1 w-full relative z-10 pb-20">
          <div className="w-full flex flex-col lg:flex-row gap-8 xl:gap-16 px-6 md:px-12 py-12 relative">
            
            {/* Sous-colonne gauche : L'histoire & La timeline défilantes */}
            <div className="flex-1 max-w-2xl relative z-10">
              
              {/* ========================================== */}
              {/* 4. SECTION À PROPOS & MON HISTOIRE         */}
              {/* ========================================== */}
              <section 
                id="about-intro" 
                className="py-12 text-left"
              >
                <BlurFade inView inViewOnce={false} delay={0.1}>
                  <span className="inline-block font-mono text-[9px] uppercase tracking-widest text-[#F5B419] font-bold bg-[#191514] text-white px-2.5 py-1 rounded mb-4">
                    COMMENCER PETIT, VOIR GRAND
                  </span>
                </BlurFade>
                
                <BlurFade inView inViewOnce={false} delay={0.2}>
                  <h2 className="font-display font-black text-4xl md:text-6xl uppercase tracking-tight text-[#191514] leading-[0.95]">
                    À propos <br />
                    (&) mon histoire
                  </h2>
                </BlurFade>

                <BlurFade inView inViewOnce={false} delay={0.3}>
                  <p className="mt-8 font-display text-lg md:text-xl text-neutral-800 leading-relaxed">
                    Il y a quelques années j'ouvrais Paint pour la première fois. Ce qui s'est passé après se raconte mieux qu'il ne s'explique.
                  </p>
                </BlurFade>

                <BlurFade inView inViewOnce={false} delay={0.4}>
                  <p className="mt-6 text-neutral-500 text-sm md:text-base leading-relaxed">
                    Passionné de création visuelle, je me suis formé de manière totalement autodidacte. D'abord en bricolant des pixels, puis en dévorant les tutoriels, jusqu'à accompagner aujourd'hui de vraies marques et concevoir des produits durables. Pour moi, le design ne consiste pas seulement à faire de belles choses : c'est construire des ponts cohérents et solides entre une idée et les personnes qui l'utilisent.
                  </p>
                </BlurFade>
              </section>

              {/* ========================================== */}
              {/* 5. FRISE CHRONOLOGIQUE ANIMÉE (TIMELINE)   */}
              {/* ========================================== */}
              <section 
                id="about-timeline" 
                className="relative py-16 bg-[#F5F2EB]/30 rounded-3xl border border-neutral-200/50 px-4 sm:px-8 mt-12 text-left"
              >
                {/* Ligne SVG collée sur le côté gauche de la timeline */}
                <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-[2px] -translate-x-1/2 z-0">
                  {/* Ligne grise en arrière-plan */}
                  <svg className="absolute inset-0 h-full w-[80px] -translate-x-[40px] overflow-visible">
                    <path 
                      ref={pathBgRef}
                      d={pathD} 
                      fill="none" 
                      stroke="rgba(25, 21, 20, 0.08)" 
                      strokeWidth="2" 
                    />
                  </svg>

                  {/* Ligne ambre active (GSAP ScrollTrigger) */}
                  <svg className="absolute inset-0 h-full w-[80px] -translate-x-[40px] overflow-visible">
                    <path 
                      ref={pathRef}
                      id="timeline-path-active"
                      d={pathD} 
                      fill="none" 
                      stroke="#F5B419" 
                      strokeWidth="3.5" 
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Liste des cartes (alignées à droite de la ligne) */}
                <div ref={timelineRef} className="relative z-10 flex flex-col gap-20 sm:gap-24 w-full">
                  {TIMELINE_DATA.map((item, i) => {
                    const isToday = item.year === 'Aujourd\'hui';

                    return (
                      <div 
                        key={item.tag}
                        data-timeline-tag={item.tag}
                        className="flex w-full items-start relative pl-10 sm:pl-16 text-left"
                      >
                        {/* Le point sur la ligne */}
                        <div className="absolute left-6 sm:left-8 top-8 w-4 h-4 rounded-full bg-white border-4 border-[#F5B419] -translate-x-1/2 z-20 shadow-sm" />

                        {/* Carte */}
                        <motion.div 
                          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          viewport={{ once: true, margin: '-100px' }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`w-full relative z-10 transition-all ${
                            isToday 
                              ? 'bg-[#191514] border border-neutral-800 text-white p-8 rounded-2xl shadow-xl' 
                              : 'bg-white/50 border border-neutral-200/60 backdrop-blur-md p-6 rounded-2xl shadow-sm hover:shadow-md'
                          }`}
                        >
                          {/* Grand chiffre fantôme */}
                          <span className={`absolute right-4 bottom-2 font-display font-black text-6xl md:text-7xl select-none pointer-events-none opacity-[0.06] ${isToday ? 'text-white' : 'text-[#F5B419]'}`}>
                            {item.year.includes('-') ? item.year.split(' - ')[1] : item.year}
                          </span>

                          <div className="flex justify-between items-center mb-4">
                            <span className={`font-mono text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded ${isToday ? 'bg-white/10 text-[#F5B419]' : 'bg-[#F5B419]/10 text-[#F5B419]'}`}>
                              {item.tag}
                            </span>
                            <span className={`font-mono text-xs font-bold ${isToday ? 'text-neutral-400' : 'text-neutral-500'}`}>
                              {item.year}
                            </span>
                          </div>

                          <div className="relative">
                            {isToday && (
                              <div className="flex items-center gap-3 mb-4">
                                <img 
                                  src={profilePortrait} 
                                  alt="Avatar" 
                                  className="w-10 h-10 rounded-full object-cover border border-[#F5B419]" 
                                />
                                <div>
                                  <h4 className="font-display font-bold text-xs uppercase tracking-wider">Spéro Kouton</h4>
                                  <p className="font-mono text-[9px] text-[#F5B419] tracking-widest uppercase">PRÉSENT</p>
                                </div>
                              </div>
                            )}
                            <h3 className="font-display font-black text-lg md:text-xl text-left uppercase tracking-tight mb-2">
                              {item.title}
                            </h3>
                            <p className={`text-xs md:text-sm leading-relaxed text-left ${isToday ? 'text-neutral-300' : 'text-neutral-600'}`}>
                              {item.text}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Sous-colonne droite : La fenêtre interactive sticky */}
            <div className="hidden lg:block w-[40%] xl:w-[42%] shrink-0 sticky top-[20vh] h-[55vh] self-start z-20">
              <StickyWindow activeTag={activeTag} />
            </div>
          </div>

          {/* ========================================== */}
          {/* 6. SECTION PROJETS (APERÇU)                 */}
          {/* ========================================== */}
          <section 
            id="about-projects" 
            className="px-6 md:px-12 py-24 bg-[#191514] border-t border-neutral-800 text-white select-none overflow-hidden mt-12"
          >
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                <div>
                  <span className="inline-block font-mono text-[9px] uppercase tracking-widest text-[#F5B419] font-bold border border-[#F5B419]/35 px-2.5 py-1 rounded mb-4">
                    PROJETS SÉLECTIONNÉS
                  </span>
                  <h2 className="font-display font-black text-4xl md:text-6xl uppercase tracking-tight text-white leading-[0.95] text-left">
                    Pensés avec soin, <br />
                    conçus pour durer.
                  </h2>
                </div>
                <p className="max-w-xs text-neutral-400 text-xs md:text-sm leading-relaxed text-left">
                  Une sélection de mes travaux récents, combinant direction artistique, branding et expériences digitales soignées.
                </p>
              </div>

              {/* Cartes projets disposées horizontalement */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PROJECTS_PREVIEW.map((project) => (
                  <motion.div 
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="group relative h-[360px] md:h-[400px] border border-neutral-800 rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-end p-6"
                  >
                    <div className="absolute inset-0 z-0">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover object-center filter brightness-[0.4] group-hover:scale-105 duration-700 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-1" />
                    </div>

                    <div className="relative z-10 text-left space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-display font-black text-[#F5B419] text-sm">{project.id}</span>
                        <div className="flex gap-1.5 flex-wrap">
                          {project.tags.map((tag) => (
                            <span 
                              key={tag} 
                              className="font-mono text-[8px] tracking-wider uppercase bg-white/10 text-white px-2 py-0.5 rounded-full border border-white/5"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-display font-black text-2xl uppercase tracking-tight text-white group-hover:text-[#F5B419] transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-neutral-400 text-xs mt-1.5 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      <div className="flex justify-between items-center border-t border-neutral-800/80 pt-4">
                        <span className="font-mono text-[9px] tracking-widest text-[#F5B419] uppercase">VOIR LE PROJET</span>
                        <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#F5B419] group-hover:text-[#191514] flex items-center justify-center text-white transition-all">
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ========================================== */}
          {/* BOUTON RETOUR MOBILES                       */}
          {/* ========================================== */}
          <div className="lg:hidden px-6 mt-12 w-full">
            <button 
              onClick={onBack}
              className="w-full py-4 bg-white text-[#191514] font-display font-bold text-xs uppercase tracking-wider border border-neutral-300 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l'accueil</span>
            </button>
          </div>
        </main>
      </div>

      {/* Bouton retour collant en bas à droite (Écrans mobiles/tablettes uniquement) */}
      <button 
        onClick={onBack}
        className="lg:hidden fixed bottom-6 left-6 z-[60] w-12 h-12 bg-[#F5B419] text-[#191514] rounded-full flex items-center justify-center shadow-lg cursor-pointer border border-[#F5B419] active:scale-95"
        title="Retour à l'accueil"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Modal Calendly */}
      <AnimatePresence>
        {showCalendly && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl h-[80vh] relative overflow-hidden flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-neutral-200">
                <span className="font-display font-bold text-sm text-neutral-900">Réserver un créneau</span>
                <button 
                  onClick={() => setShowCalendly(false)}
                  className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 transition-colors"
                >
                  &times;
                </button>
              </div>
              <iframe 
                src="https://calendly.com/koutonsperop/30min" 
                className="w-full flex-1 border-0"
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
