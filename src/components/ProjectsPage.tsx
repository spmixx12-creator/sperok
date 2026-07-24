import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, LayoutGrid, ArrowUp, Users, ArrowLeft, Monitor, Sparkles } from 'lucide-react';
import { ContainerScroll } from './ui/container-scroll-animation';
import { MarqueeAnimation } from './ui/marquee-effect';
import { Component as Footer } from './ui/footer-taped-design';
import { ZoomParallax } from './ui/zoom-parallax';
import { ProjectsShowcase } from './ui/projects-showcase';
import FloatingActionMenu from './ui/floating-action-menu';
import Lenis from 'lenis';
import logoMask from '../créa/sperok-mask.png';
import apercuVideo from '../créa/apercu-travaux-web.mp4';

interface ProjectsPageProps {
  onBack: () => void;
}

// Visuels locaux, rangés par sous-dossier de catégorie dans `Apperçu/`
// (Branding, Social Media, Print Design, Motion Design, Montage Vidéo).
// On accepte images, GIF et vidéos (mp4) ; la galerie gère les deux.
const MEDIA = import.meta.glob('../Apperçu/**/*.{png,jpg,jpeg,webp,gif,mp4}', {
  eager: true,
  import: 'default',
});

// Tous les médias d'une catégorie (= nom du sous-dossier), triés par nom.
const mediaFor = (category: string) =>
  Object.keys(MEDIA)
    .filter((key) => key.includes(`/Apperçu/${category}/`))
    .sort()
    .map((key) => ({ src: MEDIA[key] as string, alt: category }));

// Catégories de design présentées (titre + sous-titre + nombre de visuels).
// Ajoute autant de visuels que tu veux par catégorie via `count` (ou, plus tard,
// une liste d'images dédiée) : toutes restent visibles avec le même mouvement.
const CATEGORIES = [
  { title: 'Branding', subtitle: 'Identité visuelle & logotypes', count: 9 },
  { title: 'Social Media', subtitle: 'Contenus & feeds qui captent', count: 12 },
  { title: 'Print Design', subtitle: 'Affiches, supports & packaging', count: 8 },
  { title: 'Motion Design', subtitle: 'Visuels animés & génériques', count: 10 },
  { title: 'Montage Vidéo', subtitle: 'Récits montés image par image', count: 11 },
];

// Clients accompagnés (défilent en bandeau dans la section CLIENTS).
const CLIENTS = [
  "Lari's House",
  'Wadou Tasty',
  'Chrisnaud Agossou',
  'Gamplay',
  'Snaki',
  'NovaFlex',
  'Blue Pastry',
  'Christ-Milla Delight',
  'Vintage',
  'La Pause Bleue',
];

/**
 * Page dédiée aux projets.
 * Apparaît avec le même effet de révélation que le menu (fondu plein écran),
 * et se présente avec le hero « ContainerScroll ». (Le reste est à reconstruire.)
 */
export default function ProjectsPage({ onBack }: ProjectsPageProps) {
  // Repart immédiatement en haut de page à l'ouverture.
  // `behavior: 'instant'` contourne le `scroll-behavior: smooth` global (sinon la
  // page remonterait lentement depuis le bas et donnerait l'impression d'y rester).
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  // Défilement fluide/inertiel (Lenis) — même sensation que la page « Mon parcours »,
  // du grand titre Web Design jusqu'au dernier projet. Désactivé en reduced-motion.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  // Vidéo « Aperçu » :
  // - Sur desktop (tablette) : se lance dès que 60% est visible.
  // - Sur mobile (arrière-plan) : se joue automatiquement en boucle dès le chargement.
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.6) {
          v.play().catch(() => {});
          io.disconnect();
        }
      },
      { threshold: [0, 0.6, 1] },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const mv = mobileVideoRef.current;
    if (mv) {
      mv.muted = true;
      mv.play().catch(() => {});
    }
  }, []);

  // Image agrandie en plein écran (lightbox).
  const [zoomed, setZoomed] = useState<{ src: string; alt?: string } | null>(null);

  // Ouvre la vue agrandie et empile une entrée d'historique → le bouton « retour »
  // du navigateur (ou la touche Échap) referme la vue.
  const openZoom = (image: { src: string; alt?: string }) => {
    setZoomed(image);
    window.history.pushState({ lightbox: true }, '');
  };
  const closeZoom = () => {
    if (window.history.state?.lightbox) window.history.back();
    else setZoomed(null);
  };

  useEffect(() => {
    const onPop = () => setZoomed(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeZoom();
    };
    window.addEventListener('popstate', onPop);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <motion.div
      // Révélation façon menu : fondu plein écran.
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="relative min-h-screen bg-[#FAF7F2] text-neutral-900 font-sans selection:bg-amber-400 selection:text-neutral-900 overflow-x-clip"
    >
      <div className="noise-overlay" />

      {/* Logo de marque (inspiré de l'entête du site) — retour à l'accueil */}
      <button
        onClick={onBack}
        aria-label="spérok — retour à l'accueil"
        className="fixed top-5 left-6 z-50 block h-7 w-24 md:h-8 md:w-28 cursor-pointer select-none"
        style={{
          backgroundColor: '#111111',
          WebkitMaskImage: `url(${logoMask})`,
          maskImage: `url(${logoMask})`,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskPosition: 'left center',
          maskPosition: 'left center',
        }}
      />

      {/* Navigation flottante (remplace la barre supérieure) */}
      <FloatingActionMenu
        options={[
          {
            label: "Accueil",
            Icon: <Home className="h-4 w-4" />,
            onClick: onBack,
          },
          // Sections de la page Projets, dans l'ordre de défilement.
          {
            label: "Intro",
            Icon: <ArrowUp className="h-4 w-4" />,
            onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
          },
          {
            label: "Web Design",
            Icon: <Monitor className="h-4 w-4" />,
            onClick: () =>
              document.getElementById('sites')?.scrollIntoView({ behavior: 'smooth' }),
          },
          {
            label: "Mes réalisations",
            Icon: <LayoutGrid className="h-4 w-4" />,
            onClick: () =>
              document
                .getElementById('realisations')
                ?.scrollIntoView({ behavior: 'smooth' }),
          },
          {
            label: "Clients",
            Icon: <Sparkles className="h-4 w-4" />,
            onClick: () =>
              document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' }),
          },
          // Accès à l'autre page.
          {
            label: "Mes Clients",
            Icon: <Users className="h-4 w-4" />,
            onClick: () => {
              window.location.hash = '#/clients';
            },
          },
        ]}
      />

      {/* Hero Mobile & Tablette : Vidéo en arrière-plan jouée en boucle avec texte superposé (téléphone et tablette < 1024px) */}
      <section className="relative w-full h-[85vh] min-h-[500px] max-h-[850px] flex flex-col items-center justify-center overflow-hidden px-6 text-center bg-neutral-950 lg:hidden">
        {/* Vidéo en arrière-plan */}
        <video
          ref={mobileVideoRef}
          src={apercuVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover z-0 opacity-70 scale-105 pointer-events-none"
        />

        {/* Calque de dégradé sombre pour une lisibilité parfaite du texte */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/50 to-neutral-950/90 z-10 pointer-events-none" />

        {/* Titre et badges superposés */}
        <motion.div
          initial={{ opacity: 0, filter: 'blur(10px)', y: 16 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 max-w-2xl mx-auto flex flex-col items-center"
        >
          <span className="font-mono text-[10px] text-amber-400 uppercase tracking-widest bg-amber-400/15 px-3.5 py-1.5 rounded-full border border-amber-400/30 backdrop-blur-md shadow-sm">
            TRAVAUX // EN DÉTAIL
          </span>

          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[0.95] mt-6 text-white">
            <span
              className="font-normal text-amber-400"
              style={{ fontFamily: 'Identic Partner Script, cursive' }}
            >
              Scroll
            </span>{' '}
            et découvre <br />
            mon{' '}
            <span className="relative inline-block mt-1">
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: 'calc(100% + 0.4em)' }}
                transition={{ delay: 0.6, duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                className="absolute left-[-0.2em] top-[-0.05em] bottom-[-0.1em] z-0 bg-amber-400 rounded-sm"
                aria-hidden
              />
              <span className="relative z-10 text-neutral-950 font-black px-1">travail.</span>
            </span>
          </h1>
        </motion.div>

        {/* Indicateur de défilement animé sur mobile & tablette */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-white/70 text-xs font-mono select-none"
        >
          <span className="text-[10px] tracking-widest uppercase text-amber-400/90 font-medium">Fais défiler</span>
          <div className="w-5 h-8 rounded-full border-2 border-white/30 flex justify-center pt-1.5 bg-black/20 backdrop-blur-sm">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-2 bg-amber-400 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Hero Desktop : ContainerScroll (carte tablette qui se redresse au scroll sur grand écran desktop) */}
      <div className="hidden lg:block">
        <ContainerScroll
          titleComponent={
            <motion.div
              initial={{ opacity: 0, filter: 'blur(12px)', y: 12 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-mono text-[9px] text-amber-600 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded border border-amber-200/30">
                TRAVAUX // EN DÉTAIL
              </span>
              <h1 className="font-display font-black text-4xl md:text-[5.5rem] tracking-tight leading-[0.8] mt-5 text-neutral-900">
                <span
                  className="font-normal"
                  style={{ fontFamily: 'Identic Partner Script, cursive', color: '#feb804' }}
                >
                  Scroll
                </span>{' '}
                et découvre <br />
                mon{' '}
                <span className="relative inline-block">
                  {/* Soulignement ambre en arrière-plan (z-0), texte au premier plan (z-10) */}
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: 'calc(100% + 0.5em)' }}
                    transition={{ delay: 1.6, duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
                    className="absolute left-[-0.25em] top-[-0.05em] bottom-[-0.15em] z-0 bg-amber-400"
                    aria-hidden
                  />
                  <span className="relative z-10">travail.</span>
                </span>
              </h1>
            </motion.div>
          }
        >
          <video
            ref={videoRef}
            src={apercuVideo}
            muted
            loop
            playsInline
            preload="auto"
            className="mx-auto h-full w-full rounded-2xl object-cover"
          />
        </ContainerScroll>
      </div>

      {/* Web Design / Vibe coding : « Mes sites, en action. »
          Chaque maquette défile dans sa fenêtre navigateur au fil du scroll. */}
      <ProjectsShowcase />

      {/* Clients : marques accompagnées présentées en bandeaux défilants (marquee).
          Toute la section tient sur un écran, sans scroll supplémentaire. */}
      <section id="categories" className="relative flex h-[40vh] min-h-[340px] w-full flex-col items-center justify-center overflow-hidden py-10">
        <div className="mb-8 max-w-2xl px-6 text-center">
          <span className="font-mono text-[9px] uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-1 rounded border border-amber-200/30">
            ILS M'ONT FAIT CONFIANCE // CLIENTS
          </span>
          <h2 className="mt-4 font-display text-2xl md:text-4xl font-black tracking-tight text-neutral-900">
            J'ai travaillé avec eux:
          </h2>
        </div>

        <div className="flex w-full flex-col gap-4">
          <MarqueeAnimation
            direction="left"
            baseVelocity={1.4}
            className="bg-neutral-900 py-4 font-display text-4xl font-black uppercase text-white md:text-6xl"
          >
            {CLIENTS.map((name) => (
              <span key={name} className="inline-flex items-center">
                <span className="px-8">{name}</span>
                <span className="text-amber-400">✦</span>
              </span>
            ))}
          </MarqueeAnimation>

          <MarqueeAnimation
            direction="right"
            baseVelocity={1.4}
            className="bg-amber-400 py-4 font-display text-4xl font-black uppercase text-neutral-900 md:text-6xl"
          >
            {CLIENTS.map((name) => (
              <span key={name} className="inline-flex items-center">
                <span className="px-8">{name}</span>
                <span className="text-neutral-900/40">✦</span>
              </span>
            ))}
          </MarqueeAnimation>
        </div>
      </section>

      {/* Réalisations par catégorie : une catégorie = un « zoom parallax ».
          L'utilisateur scrolle, arrive sur la catégorie suivante, et ainsi de suite. */}
      <div id="realisations">
        {CATEGORIES.map((cat, i) => (
          <section key={cat.title} className="relative w-full">
            {/* Écran de titre de la catégorie */}
            <div className="relative flex h-[70vh] flex-col items-center justify-center px-6 text-center">
              <span className="font-mono text-[9px] uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-1 rounded border border-amber-200/30">
                {`CATÉGORIE ${String(i + 1).padStart(2, '0')} // RÉALISATIONS`}
              </span>
              <h2 className="mt-5 font-display text-5xl md:text-8xl font-black tracking-tight leading-[0.9] text-neutral-900">
                {cat.title}
              </h2>
              <p className="mt-4 max-w-md font-display text-sm md:text-base text-neutral-500">
                {cat.subtitle}
              </p>
              <span className="mt-8 font-mono text-[10px] uppercase tracking-widest text-neutral-400 animate-pulse">
                Faites défiler ↓
              </span>
            </div>

            {/* Galerie en zoom parallax (visuels du dossier de la catégorie) */}
            <ZoomParallax
              images={mediaFor(cat.title)}
              onImageClick={openZoom}
            />
          </section>
        ))}
      </div>

      {/* Vue agrandie (lightbox) : clic sur une image → plein écran.
          « Retour » (bouton, Échap ou retour navigateur) pour revenir derrière. */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeZoom}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-neutral-950/90 backdrop-blur-sm p-6 md:p-12"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeZoom();
              }}
              className="group absolute top-5 left-5 flex items-center gap-2.5 rounded-full bg-white/10 px-4 py-2.5 font-display text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-amber-400 hover:text-neutral-900 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour</span>
            </button>
            {/\.mp4($|\?)/i.test(zoomed.src) ? (
              <motion.video
                key={zoomed.src}
                src={zoomed.src}
                autoPlay
                muted
                loop
                playsInline
                controls
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
              />
            ) : (
              <motion.img
                key={zoomed.src}
                src={zoomed.src}
                alt={zoomed.alt || 'Réalisation'}
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
                draggable={false}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pied de page (commun à tout le portfolio) */}
      <Footer />
    </motion.div>
  );
}
