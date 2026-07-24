import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Sticker, ChatMessage } from './types';
import ProjectsPage from './components/ProjectsPage';
import AboutPage from './components/AboutPage';
import ShowcasePage from './components/ShowcasePage';
import { BlurFade } from './components/ui/blur-fade';
import { MagicText } from './components/ui/magic-text';
import { VideoScrollHero } from './components/ui/video-scroll-hero';
import InfiniteGallery from './components/ui/3d-gallery-photography';
import StickyScrollGallery from './components/ui/sticky-scroll';
import { Component as BlurText } from './components/ui/blur-text-animation';
import CountUp from './components/ui/count-up';
import FloatingActionMenu from './components/ui/floating-action-menu';
import { RevealImageList } from './components/ui/reveal-images';
import { BackgroundBeamsWithCollision } from './components/ui/background-beams-with-collision';
import { ScrollModel3D } from './components/ui/scroll-model';
import { ParallaxHero } from './components/ui/parallax-scrolling';
import { Component as Footer } from './components/ui/footer-taped-design';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
import mapBg from './créa/tribute-boomerang.mp4';
import philoBg from './créa/telechargement28-boomerang.mp4';
import cvCutout from './créa/Beige Noir Moderne Minimaliste CV (5).png';
import RadialOrbitalTimeline, { type TimelineItem } from './components/ui/radial-orbital-timeline';
import { LinkPreview } from './components/ui/link-preview';
import { TextScramble } from './components/ui/text-scramble';
import Logo from './components/Logo';
import profilePortrait from './créa/WhatsApp Image 2026-06-25 at 22.33.55.jpeg';
import {
  Palette,
  Code2,
  Film,
  Box,
  Compass,
  PenTool,
} from 'lucide-react';

const skillsTimeline: TimelineItem[] = [
  {
    id: 1,
    title: 'UI / UX Design',
    date: 'CORE',
    content:
      "Conception d'interfaces claires et désirables : recherche utilisateur, wireframes, design systems durables.",
    category: 'Design',
    icon: Palette,
    relatedIds: [2, 6],
    status: 'completed',
    energy: 90,
  },
  {
    id: 2,
    title: 'Branding',
    date: 'CORE',
    content:
      "Identités visuelles à forte personnalité : logotypes, territoires graphiques et systèmes de marque cohérents.",
    category: 'Brand',
    icon: PenTool,
    relatedIds: [1, 3],
    status: 'completed',
    energy: 90,
  },
  {
    id: 3,
    title: 'Creative Dev',
    date: 'BUILD',
    content:
      'Intégration sur mesure en React 19, TypeScript et Tailwind v4. Du design fidèle au pixel, performant et accessible.',
    category: 'Code',
    icon: Code2,
    relatedIds: [2, 4],
    status: 'completed',
    energy: 50,
  },
  {
    id: 4,
    title: 'Motion Design',
    date: 'MOTION',
    content:
      "Animations et micro-interactions fluides avec Motion / Framer Motion pour donner vie à chaque écran.",
    category: 'Animation',
    icon: Film,
    relatedIds: [3, 5],
    status: 'in-progress',
    energy: 40,
  },
  {
    id: 5,
    title: '3D / WebGL',
    date: 'EXPLORE',
    content:
      "Expériences immersives en 3D temps réel : galeries interactives, profondeur et scènes WebGL.",
    category: '3D',
    icon: Box,
    relatedIds: [4, 6],
    status: 'in-progress',
    energy: 10,
  },
  {
    id: 6,
    title: 'UX Architecture',
    date: 'STRATEGY',
    content:
      "Structuration de l'information et des parcours : arborescences, flux et logique d'interaction pensés en amont.",
    category: 'Strategy',
    icon: Compass,
    relatedIds: [1, 5],
    status: 'completed',
    energy: 80,
  },
];
import {
  ArrowDown,
  MapPin,
  Layers,
  Sparkles,
  Monitor,
  Heart,
  Smile,
  Github,
  Linkedin,
  MessageSquare,
  ArrowRight,
  X,
  Bell,
  Home,
  LayoutGrid,
  User,
  Users,
  Mail,
  ArrowUp,
  CalendarCheck,
  Zap,
  Shield,
  Target,
  Hammer,
  Rocket
} from 'lucide-react';

const sampleImages = [
  { src: 'https://images.unsplash.com/photo-1741332966416-414d8a5b8887?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8', alt: 'Image 1' },
  { src: 'https://images.unsplash.com/photo-1754769440490-2eb64d715775?q=80&w=1113&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Image 2' },
  { src: 'https://images.unsplash.com/photo-1758640920659-0bb864175983?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzNHx8fGVufDB8fHx8fA%3D%3D', alt: 'Image 3' },
  { src: 'https://plus.unsplash.com/premium_photo-1758367454070-731d3cc11774?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MXx8fGVufDB8fHx8fA%3D%3D', alt: 'Image 4' },
  { src: 'https://images.unsplash.com/photo-1746023841657-e5cd7cc90d2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D', alt: 'Image 5' },
  { src: 'https://images.unsplash.com/photo-1741715661559-6149723ea89a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1MHx8fGVufDB8fHx8fA%3D%3D', alt: 'Image 6' },
  { src: 'https://images.unsplash.com/photo-1725878746053-407492aa4034?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1OHx8fGVufDB8fHx8fA%3D%3D', alt: 'Image 7' },
  { src: 'https://images.unsplash.com/photo-1752588975168-d2d7965a6d64?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2M3x8fGVufDB8fHx8fA%3D%3D', alt: 'Image 8' },
];

// Bulle de survol « niveau de maîtrise » affichée par LinkPreview dans la
// section Philosophie (à la place de l'image d'aperçu).
function SkillMeter({ label, value }: { label: string; value: number }) {
  return (
    <div className="w-56 rounded-xl border border-white/10 bg-neutral-900/95 p-4 shadow-xl backdrop-blur">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
          {label}
        </span>
        <span className="font-display text-3xl font-black text-amber-400">{value}%</span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-amber-400"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        />
      </div>
    </div>
  );
}

// Remplissage « surligneur » ambre (identique au titre « Un aperçu » de la
// galerie) : le mot, d'abord grisé, se fait recouvrir par une barre ambre qui
// révèle le même texte en sombre. Rejoué à chaque entrée dans le viewport.
function HighlightFill({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block select-none whitespace-nowrap px-1">
      <span className="text-neutral-500">{children}</span>
      <motion.span
        initial={{ width: '0%' }}
        whileInView={{ width: '100%' }}
        viewport={{ once: false, amount: 0.6 }}
        transition={{ delay: 0.15, duration: 1, ease: [0.25, 1, 0.5, 1] }}
        className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap bg-amber-400"
      >
        <span className="absolute left-1 top-0 bottom-0 flex h-full items-center whitespace-nowrap text-neutral-950">
          {children}
        </span>
      </motion.span>
    </span>
  );
}

// Mémorise (au niveau module) que l'utilisateur a déjà vu l'intro du hero, afin
// de ne PAS la rejouer s'il revient sur l'accueil depuis la page Projets.
let hasEnteredSite = false;

// Lien Calendly de Spéro (type de RDV « 30 min »). Calendly envoie un e-mail à
// chaque réservation et l'ajoute à l'agenda Google/Outlook connecté.
const CALENDLY_URL = 'https://calendly.com/koutonsperop/30min';

// Charge (une seule fois) le widget Calendly, puis exécute `cb`.
function loadCalendly(cb: () => void) {
  const w = window as unknown as { Calendly?: unknown };
  if (w.Calendly) {
    cb();
    return;
  }
  if (!document.getElementById('calendly-css')) {
    const link = document.createElement('link');
    link.id = 'calendly-css';
    link.rel = 'stylesheet';
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(link);
  }
  const existing = document.getElementById('calendly-js') as HTMLScriptElement | null;
  if (existing) {
    existing.addEventListener('load', cb, { once: true });
    return;
  }
  const script = document.createElement('script');
  script.id = 'calendly-js';
  script.src = 'https://assets.calendly.com/assets/external/widget.js';
  script.async = true;
  script.onload = cb;
  document.body.appendChild(script);
}

// Modal de réservation : affiche le calendrier Calendly DIRECTEMENT sur le site
// (widget « inline »), dans une fenêtre superposée. Le client choisit son
// créneau sans jamais quitter la page.
function CalendlyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    loadCalendly(() => {
      const w = window as unknown as {
        Calendly?: { initInlineWidget: (o: { url: string; parentElement: HTMLElement }) => void };
      };
      if (w.Calendly && holder.current) {
        holder.current.innerHTML = '';
        w.Calendly.initInlineWidget({ url: CALENDLY_URL, parentElement: holder.current });
      }
    });
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm p-4 md:p-8"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3">
              <span className="font-display text-sm font-bold text-neutral-900">
                Réserver un créneau
              </span>
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Widget Calendly intégré (inline) */}
            <div ref={holder} className="min-h-0 flex-1" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface HomePageProps {
  onOpenProjects: () => void;
}

function HomePage({ onOpenProjects }: HomePageProps) {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(!hasEnteredSite);
  // Devient true une fois l'animation d'entrée du hero terminée (galerie stabilisée).
  const [heroIntroDone, setHeroIntroDone] = useState(hasEnteredSite);
  // Capturé au montage : si on est déjà entré, la galerie saute son intro.
  const skipHeroIntro = useRef(hasEnteredSite).current;
  // Vrai quand la dernière section (hero « À propos », #contact) est à l'écran
  // → le bouton de navigation se déplace alors vers le haut à droite.
  const [atLastSection, setAtLastSection] = useState(false);
  useEffect(() => {
    const el = document.getElementById('contact');
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setAtLastSection(entry.isIntersecting),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // Ouvre le modal de réservation Calendly (intégré au site).
  const [showCalendly, setShowCalendly] = useState(false);
  const [scrambleCode, setScrambleCode] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  // Vrai dès qu'on n'est plus tout en haut de la page (affiche le bouton « haut »).
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Durée de l'animation d'entrée cinématique de la galerie 3D (cf. InfiniteGallery).
  const HERO_INTRO_MS = 6000;

  // Words that cycle in the title, scrambling between each one. Starts with "Spéro".
  const scrambleWords = [
    'votre Vision',
    'Image',
    'Illustration',
    'Graphisme',
    'Création',
    'Composition',
    'Rendu',
    'Maquette',
    'Support visuel',
    'Design',
    'Identité',
  ];

  // Advance to the next word and re-trigger the scramble effect every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % scrambleWords.length);
      setScrambleCode(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [scrambleWords.length]);

  // Auto-dismiss welcome screen after 6 seconds
  useEffect(() => {
    if (!showIntro) return;
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, [showIntro]);

  // Une fois l'écran de bienvenue retiré, la galerie du hero se monte et joue son
  // animation d'entrée. On marque celle-ci comme terminée après HERO_INTRO_MS,
  // moment où la vitesse de défilement des images s'est stabilisée.
  useEffect(() => {
    if (showIntro) return;
    const timer = setTimeout(() => setHeroIntroDone(true), HERO_INTRO_MS);
    return () => clearTimeout(timer);
  }, [showIntro]);

  // Tant que l'intro du hero n'est pas terminée, on bloque le scroll de la page :
  // impossible de descendre dans le site avant que la galerie soit stabilisée.
  // Une fois débloqué, la galerie exige encore un peu de défilement (seuil
  // d'accumulation) avant de laisser la page descendre → l'utilisateur « essaye ».
  useEffect(() => {
    document.body.style.overflow = heroIntroDone ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [heroIntroDone]);

  // Mémorise que l'intro a été vue → pas de relecture si retour depuis Projets.
  useEffect(() => {
    if (heroIntroDone) hasEnteredSite = true;
  }, [heroIntroDone]);

  // Load chat messages sequentially
  const chatSequence = [
    { text: 'Salut ! 👋 Bienvenue sur mon espace créatif.', sender: 'bot' as const },
    { text: 'Je m\'appelle Spérok, designer d\'expériences interactives.', sender: 'bot' as const },
    { text: 'Curieux ? Clique sur la grille pour personnaliser ma mise en page avec des tampons ! 👇', sender: 'bot' as const }
  ];

  useEffect(() => {
    // Sequence the loading of initial messages
    const timers: NodeJS.Timeout[] = [];
    chatSequence.forEach((msg, idx) => {
      const timer = setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: `msg-${idx}`,
          text: msg.text,
          sender: msg.sender,
          timestamp: new Date()
        }]);
        setActiveMessageIndex(idx);
      }, (idx + 1) * 1200);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleAddSticker = (sticker: Sticker) => {
    setStickers(prev => [...prev, sticker]);
  };

  const handleClearStickers = () => {
    setStickers([]);
  };

  const handleUpdateStickerPos = (id: string, x: number, y: number) => {
    setStickers(prev => prev.map(s => s.id === id ? { ...s, x, y } : s));
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-neutral-900 font-sans selection:bg-amber-400 selection:text-neutral-900 overflow-x-clip">
      {/* Film grain/paper texture noise overlay */}
      <div className="noise-overlay" />

      {/* Intro Overlay Screen */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro-overlay"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 1.0, ease: "easeInOut" }
            }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none bg-[#FAF7F2] text-neutral-900"
          >
            <motion.div
              initial={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{
                scale: 0.82, // de-zoome (scale down)
                opacity: 0,
                filter: "blur(12px)",
                transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
              }}
              className="text-center px-6 relative z-10 flex flex-col items-center"
            >
              <BlurFade delay={0.2} duration={0.8} yOffset={12} blur="10px">
                <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-tighter uppercase leading-none text-neutral-900">
                  Hello,
                </h1>
              </BlurFade>
              <BlurFade delay={0.6} duration={0.8} yOffset={12} blur="10px">
                <p className="font-display font-medium text-lg sm:text-2xl md:text-3xl tracking-tight text-neutral-600 mt-4 max-w-xl mx-auto">
                  bienvenue dans{" "}
                  <span className="relative inline-block font-bold select-none px-1">
                    {/* Gray base text */}
                    <span className="text-neutral-400">mon monde</span>

                    {/* Crisp, strict rectangular selection highlighter and black text reveal */}
                    <motion.span
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 1.4, duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                      className="absolute inset-y-0 left-0 bg-amber-400 overflow-hidden whitespace-nowrap"
                    >
                      <span className="absolute left-1 top-0 bottom-0 text-neutral-950 font-bold whitespace-nowrap flex items-center h-full">
                        mon monde
                      </span>
                    </motion.span>
                  </span>.
                </p>
              </BlurFade>

              <BlurFade delay={1.0} duration={1.2} yOffset={6} blur="8px">
                <div className="mt-12 flex flex-col items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce duration-1000" />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 animate-pulse">
                    Portfolio — Entrée automatique dans quelques instants
                  </span>
                </div>
              </BlurFade>

              <BlurFade delay={1.4} duration={0.8} yOffset={6} blur="6px">
                <button
                  onClick={() => setShowIntro(false)}
                  className="mt-6 px-4 py-1.5 rounded-full border border-neutral-200 text-[10px] font-mono uppercase tracking-widest text-neutral-500 hover:text-neutral-950 hover:border-neutral-400 hover:bg-neutral-50 transition-all duration-300 active:scale-95 cursor-pointer"
                >
                  Passer l'introduction
                </button>
              </BlurFade>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PERSISTENT ADAPTIVE LOGO (top-left) */}
      <Logo />

      {/* PERSISTENT FLOATING NAVIGATION MENU (même bouton que la page Projets,
          options adaptées aux sections de la page principale) */}
      <FloatingActionMenu
        position={atLastSection ? 'top' : 'bottom'}
        options={[
          {
            label: 'Home',
            Icon: <Home className="h-4 w-4" />,
            onClick: () => handleScrollToSection('hero'),
          },
          {
            label: 'À propos',
            Icon: <User className="h-4 w-4" />,
            onClick: () => {
              window.location.hash = '#/a-propos';
            },
          },
          {
            label: 'Contact',
            Icon: <Mail className="h-4 w-4" />,
            onClick: () => handleScrollToSection('contact'),
          },
        ]}
      />

      {/* MAIN LAYOUT WRAPPER */}
      <main className="relative z-10">

        {/* SECTION 1: HERO / INTRO */}
        <section
          id="hero"
          className="relative h-screen w-full bg-[#FAF7F2] border-b border-neutral-200/60 select-none overflow-hidden"
        >
          {/* Les animations du hero ne se montent — et donc ne démarrent —
              qu'une fois l'écran de bienvenue retiré (showIntro === false). */}
          {!showIntro && (
            <>
          {/* 3D Infinite Scroll Gallery background */}
          <InfiniteGallery
            images={sampleImages}
            speed={1.2}
            zSpacing={3}
            visibleCount={12}
            falloff={{ near: 0.8, far: 14 }}
            className="h-full w-full"
            skipIntro={skipHeroIntro}
          />

          {/* Top Row Status Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="absolute top-6 left-6 right-6 flex items-center justify-end z-30 font-mono text-[10px] text-neutral-500 tracking-wider pointer-events-none"
          >
            <div className="flex items-center gap-1.5 text-neutral-800 font-semibold bg-white/60 backdrop-blur-md py-1 px-2.5 rounded-full border border-neutral-200/40 pointer-events-auto">
              <MapPin className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>COTONOU, BÉNIN</span>
            </div>
          </motion.div>

          {/* Central Immersive "le design?" Heading */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center px-4 mix-blend-exclusion text-white z-20">
            <motion.h1
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black text-5xl sm:text-7xl md:text-9xl tracking-tight leading-none lowercase select-none"
            >
              le design?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: 0.5, duration: 1.0, ease: "easeOut" }}
              className="font-mono text-[9px] md:text-[11px] tracking-[0.3em] uppercase mt-4 select-none"
            >
              C'est ma manière de parler.
            </motion.p>
          </div>

          {/* Bottom Bar: Instructions & Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.8 }}
            className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row items-center justify-between z-30 border-t border-neutral-200/80 pt-4 text-neutral-800"
          >
            {/* CTA de scroll : « Découvrir mon profil » + flèche animée */}
            <button
              onClick={() => handleScrollToSection('identity')}
              className="flex items-center gap-2 font-display text-xs font-semibold text-neutral-800 hover:text-neutral-950 cursor-pointer group transition-all"
            >
              <span>Découvrir mon profil</span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                className="w-7 h-7 rounded-full bg-neutral-100 group-hover:bg-amber-400 group-hover:text-neutral-900 flex items-center justify-center transition-colors border border-neutral-200"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </motion.div>
            </button>
          </motion.div>
            </>
          )}
        </section>


        {/* SECTION 2: SERVICES (survol d'un service → révélation de visuels) */}
        <section
          id="identity"
          className="relative border-y border-neutral-200/60"
        >
          <BackgroundBeamsWithCollision className="min-h-[80vh] flex-col text-center py-20 px-6">
            {/* Modèle 3D (scene.glb) qui traverse la section de gauche à droite au scroll */}
            <ScrollModel3D />

            <span className="relative z-20 mb-12 font-mono text-[10px] tracking-widest uppercase font-bold text-[#F5B419] bg-neutral-900 px-2.5 py-1 rounded">
              QUELQUES-UNS DE MES SERVICES
            </span>

            <div className="relative z-20 block">
              <RevealImageList />
            </div>
          </BackgroundBeamsWithCollision>
        </section>

        {/* SECTION 2.5: SCROLL-REVEAL MANIFESTO */}
        <section
          id="manifesto"
          className="relative bg-[#FAF7F2] border-b border-neutral-200/60"
        >
          <span className="pointer-events-none absolute top-8 left-1/2 z-10 -translate-x-1/2 font-mono text-[9px] uppercase tracking-widest text-neutral-400">
            MANIFESTO // SCROLL
          </span>
          <MagicText
            text="Je ne suis qu'un passionné de la Beauté et, pour moi, chaque visuel doit raconter une histoire claire. Je ne vais donc pas vous redéfinir ce qu'est le design... Comme l'a dit Anton Tchekhov : « Don't tell me, show me. »"
          />
        </section>


        {/* SECTION 2.75: VIDEO SCROLL HERO — mène à la galerie d'aperçus (masquée sur téléphone) */}
        <section id="showreel" className="relative hidden sm:block">
          <VideoScrollHero
            src={mapBg}
            label="SHOWREEL_2026"
          />
        </section>


        {/* SECTION 2.8: STICKY-SCROLL PROJECT PREVIEWS GALLERY */}
        <StickyScrollGallery id="apercus" />


        {/* SECTION 2.85: BLUR TEXT ANIMATION — EXPERTISE EN MOUVEMENT */}
        <section id="morph" className="relative bg-[#FAF7F2] border-b border-neutral-200/60">
          <BlurText
            eyebrow="EXPERTISE // EN MOUVEMENT"
            text={"Laisse moi designer ta\nprochaine identité visuelle."}
            subtitle="Une seule obsession : transformer une idée en expérience vivante."
            accentWord="designer"
            accentStyle={{ fontFamily: 'Identic Partner Script, cursive' }}
            highlightPhrase="identité visuelle."
          />

          {/* Chiffres clés — preuve d'expérience (3 chiffres alignés horizontalement sur mobile & desktop) */}
          <div className="mx-auto -mt-6 max-w-4xl px-3 sm:px-6 pb-12 sm:pb-20 md:-mt-10 md:pb-28">
            <p className="mb-4 sm:mb-8 text-center font-mono text-[9px] uppercase tracking-widest text-amber-600">
              // EN QUELQUES CHIFFRES
            </p>
            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl sm:rounded-2xl border border-neutral-200 bg-neutral-200">
              {[
                { number: '200', suffix: '', cursiveSuffix: false, label: 'Visuels réalisés', underline: false },
                { number: '2', suffix: ' ans', cursiveSuffix: true, label: "D'expérience", underline: false },
                { number: '10', suffix: '', cursiveSuffix: false, label: 'Marques accompagnées', underline: true },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ delay: 0.1 + i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center justify-center bg-[#FAF7F2] px-1.5 py-4 sm:px-6 sm:py-10 text-center"
                >
                  <span className="font-display text-2xl sm:text-4xl md:text-6xl font-black tracking-tight text-neutral-900 flex items-center justify-center">
                    <span className="text-amber-500">+</span>
                    <CountUp to={Number(stat.number)} duration={1.4} />
                    {stat.cursiveSuffix ? (
                      <span
                        className="ml-1 text-lg sm:text-3xl md:text-5xl font-normal text-amber-500"
                        style={{ fontFamily: 'Identic Partner Script, cursive' }}
                      >
                        {stat.suffix.trim()}
                      </span>
                    ) : (
                      <span className="text-xs sm:text-2xl md:text-3xl text-neutral-400">{stat.suffix}</span>
                    )}
                  </span>
                  <span className="relative mt-1.5 sm:mt-2.5 inline-block font-mono text-[8px] sm:text-[10px] md:text-[11px] uppercase tracking-wider text-neutral-500 leading-tight text-center">
                    {stat.label}
                    {stat.underline && (
                      <motion.svg
                        viewBox="0 0 200 12"
                        preserveAspectRatio="none"
                        aria-hidden
                        className="absolute -bottom-1.5 left-0 h-1.5 sm:h-2 w-full overflow-visible text-amber-400"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ delay: 0.45, duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
                      >
                        <motion.path
                          d="M3,7 C26,2 50,11 76,6 C100,2 126,12 152,6 C170,3 188,9 197,5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={3}
                          strokeLinecap="round"
                        />
                      </motion.svg>
                    )}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* SECTION 3: DARK SLATE SANDBOX / DRAGGABLE BADGES */}
        <section
          id="about"
          className="relative isolate flex min-h-screen items-center overflow-hidden bg-neutral-950 py-16 px-6 md:px-12 border-b border-neutral-800"
        >
          {/* Fond : animation en boucle. */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <video
              src={philoBg}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-neutral-950/70" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-4xl">
            <span className="font-mono text-[9px] text-amber-500 uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded border border-white/10">
              PHILOSOPHIE
            </span>

            <h2 className="mt-4 font-display text-3xl font-black tracking-tight text-white md:text-5xl">
              Ma philosophie
            </h2>

            <div className="mt-6 space-y-3 text-left font-display text-[0.95rem] leading-relaxed text-neutral-300 md:space-y-4 md:text-base lg:text-lg">
              <p>
                Je crois qu'un bon design, ça ne se voit pas&nbsp;:{' '}
                <HighlightFill>ça se ressent</HighlightFill>.
              </p>

              <p>
                Mon terrain de jeu, c'est l'
                <LinkPreview content={<SkillMeter label="UI/UX" value={70} />} className="font-bold text-amber-400">
                  UI/UX
                </LinkPreview>{' '}
                — cet endroit précis où l'esthétique rencontre l'usage. Je passe autant de temps sur ce qui
                est beau que sur ce qui est juste, parce qu'une interface réussie, c'est celle que vous
                utilisez sans même y penser. Le fond et la forme, jamais l'un sans l'autre.
              </p>

              <p>
                Côté{' '}
                <LinkPreview content={<SkillMeter label="Branding" value={80} />} className="font-bold text-amber-400">
                  branding
                </LinkPreview>
                , j'aide les marques à trouver leur voix et leur visage. Pas seulement un logo&nbsp;: une
                vraie personnalité, cohérente partout où on la croise. L'idée, c'est de marquer les esprits —
                et <HighlightFill>d'y rester</HighlightFill>.
              </p>

              <p>
                Pour le web, j'avance en{' '}
                <LinkPreview content={<SkillMeter label="Vibe coding" value={70} />} className="font-bold text-amber-400">
                  vibe coding
                </LinkPreview>
                . Je code à l'instinct&nbsp;: je teste, j'ajuste, et je laisse l'idée guider la technique
                plutôt que l'inverse. Moins de prise de tête, plus de prise de plaisir.
              </p>

              <p>
                Et puis il y a le{' '}
                <LinkPreview content={<SkillMeter label="Motion design" value={30} />} className="font-bold text-amber-400">
                  motion design
                </LinkPreview>
                , ma petite touche de magie. Ce moment où une idée statique se met à bouger, à raconter, à
                respirer. Parce qu'un design qui bouge, c'est un design qui parle.
              </p>

              <p>
                Au fond, que ce soit{' '}
                <span className="text-amber-400" style={{ fontFamily: 'Identic Partner Script, cursive' }}>
                  en pixels, en marques ou en mouvement
                </span>
                , je poursuis toujours la même chose&nbsp;: créer des expériences qui ont{' '}
                <span className="text-white">du style, du sens et du souffle</span>.
              </p>
            </div>
          </div>
        </section>


        {/* SECTION 5: HERO « À PROPOS » — parallaxe épinglée (logo blanc + photo +
            textes à leurs positions, tous en parallaxe). Voir ParallaxHero. */}
        <ParallaxHero
          onCalendly={() => setShowCalendly(true)}
          onProjects={onOpenProjects}
        />


        {/* SECTION 6: « À PROPOS — LA SUITE » (intégrée à l'accueil, atteinte via
            le bouton « À propos de moi »). Révélation au scroll (pin + mot par
            mot) façon nendo. N'apparaît qu'au clic (showAboutStory). */}
        {/* Footer identique à celui de la page réalisations, directement après
            la parallaxe (donne aussi l'espace de défilement à la parallaxe). */}
        <Footer />

      </main>

      {/* Modal de réservation Calendly (intégré au site) */}
      <CalendlyModal open={showCalendly} onClose={() => setShowCalendly(false)} />
    </div>
  );
}

// Routage minimal par hash : « #/projets » → Projets, « #/clients » → Mes Clients,
// sinon l'accueil.
const PROJECTS_HASH = '#/projets';
const ABOUT_HASH_EN = '#/about';
const ABOUT_HASH_FR = '#/a-propos';
const WEBDESIGN_HASH = '#/web-design';
const MONTAGE_HASH = '#/montage-video';

export default function App() {
  const [route, setRoute] = useState(() => window.location.hash);

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (route === ABOUT_HASH_EN || route === ABOUT_HASH_FR) {
    return <AboutPage onBack={() => { window.location.hash = ''; }} />;
  }

  if (route === WEBDESIGN_HASH || route === MONTAGE_HASH) {
    return (
      <ShowcasePage
        kind={route === MONTAGE_HASH ? 'montage-video' : 'web-design'}
        onBack={() => {
          window.location.hash = PROJECTS_HASH;
        }}
      />
    );
  }

  if (route === PROJECTS_HASH) {
    return (
      <ProjectsPage
        onBack={() => {
          window.location.hash = '';
        }}
      />
    );
  }

  return (
    <HomePage
      onOpenProjects={() => {
        window.location.hash = PROJECTS_HASH;
      }}
    />
  );
}
