import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, LayoutGrid, ArrowLeft, Monitor, Palette, Share2, Clapperboard, Printer, Film, ChevronRight, X, User, Mail, MousePointerClick, type LucideIcon } from 'lucide-react';
import { ContainerScroll } from './ui/container-scroll-animation';
import { Dock, DockItem, DockIcon, DockLabel } from './ui/dock';
import { InfiniteMasonry } from './ui/infinite-masonry';
import { Button } from './ui/new-button';
import { BellNotify } from './ui/bell-notify';
import { Component as Footer } from './ui/footer-taped-design';
import { MarqueeAnimation } from './ui/marquee-effect';
import FloatingActionMenu from './ui/floating-action-menu';
import Lenis from 'lenis';
import logoMask from '../créa/sperok-mask.png';
import apercuVideo from '../créa/apercu-travaux-web.mp4';

interface ProjectsPageProps {
  onBack: () => void;
}

// Domaines d'intervention présentés dans le « hub » (dock façon macOS).
// Un clic ouvre la visionneuse plein écran de la catégorie.
// « Tout » = navigation dans l'ensemble des réalisations.
const DOCK = [
  { label: 'Tout', icon: LayoutGrid },
  { label: 'Branding', icon: Palette },
  { label: 'Social media', icon: Share2 },
  { label: 'Motion design', icon: Clapperboard },
  { label: 'Print design', icon: Printer },
] as const;

// Tous les visuels (images uniquement — le canvas ne dessine pas les mp4 ; les
// mp4 « Montage Vidéo » sont représentés par des posters `poster-*.jpg`).
const IMG = import.meta.glob('../Apperçu/**/*.{png,jpg,jpeg,webp,gif}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

// Images à la racine d'Apperçu/ = domaine « Web design ».
const rootImages = Object.keys(IMG)
  .filter((k) => /\/Apperçu\/[^/]+$/.test(k))
  .sort()
  .map((k) => IMG[k]);

// Images d'un sous-dossier de catégorie.
const folderImages = (folder: string) =>
  Object.keys(IMG)
    .filter((k) => k.includes(`/Apperçu/${folder}/`))
    .sort()
    .map((k) => IMG[k]);

// Pool d'images par domaine (clé = libellé du dock).
const CATEGORY_IMAGES: Record<string, string[]> = {
  'Web design': rootImages,
  Branding: folderImages('Branding'),
  'Social media': folderImages('Social Media'),
  'Motion design': folderImages('Motion Design'),
  'Print design': folderImages('Print Design'),
  'Montage vidéo': folderImages('Montage Vidéo'),
};

// « Tout » = l'ensemble des réalisations des options actuelles (Web design et
// Montage vidéo sont réservés pour un autre emplacement).
CATEGORY_IMAGES['Tout'] = [
  ...folderImages('Branding'),
  ...folderImages('Social Media'),
  ...folderImages('Motion Design'),
  ...folderImages('Print Design'),
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

  // Domaine ouvert en visionneuse plein écran (null = page normale).
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Le bouton de navigation s'arrête à la dernière section : on le masque dès
  // que le footer entre à l'écran (il ne flotte donc pas par-dessus le footer).
  const [footerVisible, setFooterVisible] = useState(false);
  useEffect(() => {
    const el = document.getElementById('footer');
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // Image agrandie plein écran (null = aucune).
  const [zoomed, setZoomed] = useState<string | null>(null);

  // Échap ferme d'abord l'image agrandie, sinon la visionneuse.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setZoomed((z) => (z ? null : z));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Icône de chaque domaine (dock + les deux mis en avant sous le hub).
  const ICONS: Record<string, LucideIcon> = {
    Tout: LayoutGrid,
    Branding: Palette,
    'Social media': Share2,
    'Motion design': Clapperboard,
    'Print design': Printer,
    'Web design': Monitor,
    'Montage vidéo': Film,
  };
  // Cycle de la barre épurée = uniquement les options du dock. Depuis un domaine
  // hors dock (Web design / Montage vidéo), « suivant » ramène au cycle (Tout).
  const cycle = DOCK.map((d) => d.label as string);
  const ActiveIcon = activeCategory ? ICONS[activeCategory] : null;
  const nextCategory = activeCategory
    ? cycle.includes(activeCategory)
      ? cycle[(cycle.indexOf(activeCategory) + 1) % cycle.length]
      : 'Tout'
    : null;

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

  return (
    <motion.div
      // Révélation façon menu : fondu plein écran.
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="relative min-h-screen bg-[#FAF7F2] text-neutral-900 font-sans selection:bg-amber-400 selection:text-neutral-900 overflow-x-clip"
    >
      <div className="noise-overlay" />

      {/* Logo de marque — ramène à la 1re section de l'accueil (sans intro). */}
      <button
        onClick={() => {
          try {
            sessionStorage.setItem('sperok_entered', '1');
          } catch {
            /* noop */
          }
          window.location.hash = '';
          requestAnimationFrame(() => window.scrollTo({ top: 0 }));
        }}
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

      {/* Navigation flottante — toujours visible (au-dessus du hub z-[10000],
          sous la visionneuse z-[100000]). */}
      <FloatingActionMenu
        baseZ={10050}
        hidden={footerVisible}
        options={[
          {
            label: "Accueil",
            Icon: <Home className="h-4 w-4" />,
            onClick: onBack,
          },
          {
            label: "À propos",
            Icon: <User className="h-4 w-4" />,
            onClick: () => {
              window.location.hash = '#/a-propos';
            },
          },
          {
            label: "Contact",
            Icon: <Mail className="h-4 w-4" />,
            onClick: () => {
              window.location.hash = '#/contact';
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

      {/* ============================================================= */}
      {/* HUB CATÉGORIES : page noire (SANS grain), fenêtre de navigation */}
      {/* (dock façon macOS) centrée. Chaque icône = une catégorie        */}
      {/* d'intervention ; le clic amène à la catégorie correspondante.    */}
      {/* z-[10000] > noise-overlay (z-9999) → aucun grain sur cette page. */}
      {/* ============================================================= */}
      <section
        id="hub"
        className="relative z-[10000] flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black px-6 pt-44 text-center md:pt-0"
      >
        {/* Cloche « À propos de moi » suspendue au dock : sa PROPRE corde relie
            le dock à la lanterne, DERRIÈRE le texte (z-[-1]) — le paragraphe la
            recouvre. Le bouton apparaît en bas, sous le paragraphe. Taille
            inchangée. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[62%] z-[-1] flex justify-center">
          <div className="pointer-events-auto h-full w-full max-w-md">
            <BellNotify
              size={300}
              isOn
              disableToggle
              buttonLabel="À propos de moi"
              onButtonClick={() => {
                window.location.hash = '#/a-propos';
              }}
            />
          </div>
        </div>

        {/* CLIENTS : superposés sur le haut de cette section (overlay). */}
        <div className="absolute inset-x-0 top-0 z-20 flex flex-col gap-3 pt-8">
          <div className="px-6 text-center">
            <span className="font-mono text-[9px] uppercase tracking-widest text-amber-400 bg-amber-400/15 px-2.5 py-1 rounded border border-amber-400/30">
              ILS M'ONT FAIT CONFIANCE // CLIENTS
            </span>
          </div>
          <div className="flex w-full flex-col gap-3">
            <MarqueeAnimation
              direction="left"
              baseVelocity={1.4}
              className="bg-neutral-900 py-2.5 font-display text-xl font-black uppercase text-white md:text-4xl"
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
              className="bg-amber-400 py-2.5 font-display text-xl font-black uppercase text-neutral-900 md:text-4xl"
            >
              {CLIENTS.map((name) => (
                <span key={name} className="inline-flex items-center">
                  <span className="px-8">{name}</span>
                  <span className="text-neutral-900/40">✦</span>
                </span>
              ))}
            </MarqueeAnimation>
          </div>
        </div>

        <span className="font-mono text-[9px] uppercase tracking-widest text-amber-400/90">
          MES DOMAINES // CHOISIS UNE CATÉGORIE
        </span>
        <h2 className="mt-4 mb-8 font-display text-3xl font-black tracking-tight text-white md:mb-12 md:text-5xl">
          Ce que{' '}
          <span
            className="inline-block -translate-y-[0.1em] text-[1.25em] font-normal leading-none text-amber-400"
            style={{ fontFamily: 'Identic Partner Script, cursive' }}
          >
            je fais.
          </span>
        </h2>

        <Dock className="dock-cta border border-white/10 bg-white/5 backdrop-blur-md">
          {DOCK.map((item) => {
            const Icon = item.icon;
            return (
              <DockItem
                key={item.label}
                onClick={() => setActiveCategory(item.label)}
                className="group aspect-square cursor-pointer rounded-full border border-white/10 bg-white/10 transition-colors hover:bg-amber-400"
              >
                <DockLabel className="border border-white/10 bg-neutral-800 text-white">
                  {item.label}
                </DockLabel>
                <DockIcon>
                  <Icon className="h-full w-full text-amber-400 transition-colors group-hover:text-neutral-900" />
                </DockIcon>
              </DockItem>
            );
          })}
        </Dock>

        {/* Indice de cliquabilité : beaucoup ne devinaient pas que les icônes
            sont cliquables (mobile + desktop) → micro-instruction animée. */}
        <div className="mt-4 flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-widest text-amber-400/90 md:text-[10px]">
          <MousePointerClick className="h-3.5 w-3.5 shrink-0 animate-bounce" />
          <span>Touchez une icône pour explorer un domaine</span>
        </div>

        {/* Web design & Montage vidéo mis en avant, sur le même écran, juste
            sous le dock (boutons animés → ouvrent la visionneuse). */}
        <p className="mt-8 max-w-2xl text-center font-display text-sm font-medium leading-relaxed text-white/90 md:mt-12 md:text-lg">
          En dehors de tout ça, je me débrouille aussi en{' '}
          <Button
            variant="default"
            icon={<Monitor />}
            onClick={() => { window.location.hash = '#/web-design'; }}
            className="align-middle"
          >
            Web design
          </Button>
          . Pour moi, en tant que créatif, je ne peux pas négliger le{' '}
          <Button
            variant="default"
            icon={<Film />}
            onClick={() => { window.location.hash = '#/montage-video'; }}
            className="align-middle"
          >
            Montage vidéo
          </Button>
          .
        </p>
      </section>

      {/* Footer identique à celui de l'accueil (au-dessus du grain, z-[10000]). */}
      <div className="relative z-[10000]">
        <Footer />
      </div>

      {/* ============================================================= */}
      {/* VISIONNEUSE PAR CATÉGORIE : page blanche plein écran qui monte, */}
      {/* champ d'images infini (projets), et barre (dock) réduite qui   */}
      {/* glisse au centre pour naviguer entre les domaines.             */}
      {/* ============================================================= */}
      <AnimatePresence>
        {activeCategory && (
          <motion.div
            className="fixed inset-0 z-[100000] overflow-hidden bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Projets de la catégorie : galerie plein écran à défilement
                INFINI (torique) au scroll/glisser. Chaque réalisation en entier
                (proportions d'origine), cadres emboîtés, régénération continue. */}
            <InfiniteMasonry
              key={activeCategory}
              className="absolute inset-0"
              images={CATEGORY_IMAGES[activeCategory] ?? []}
              columnWidth={420}
              gap={20}
              onImageClick={(src) => setZoomed(src)}
            />

            {/* Fermer la visionneuse */}
            <button
              onClick={() => setActiveCategory(null)}
              className="group fixed top-5 left-6 z-[100001] flex items-center gap-2.5 rounded-full border border-neutral-200 bg-white/80 px-4 py-2.5 font-display text-sm font-semibold text-neutral-900 shadow-sm backdrop-blur-md transition-colors hover:bg-neutral-900 hover:text-white cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour</span>
            </button>

            {/* Barre (dock) réduite qui glisse du centre vers le BAS de la page */}
            <div className="pointer-events-none absolute inset-0 z-[100001] flex items-end justify-center pb-8">
              <motion.div
                initial={{ y: '-42vh', scale: 1.12, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-auto"
              >
                {/* Barre épurée : icône + nom de la section courante.
                    Un clic passe à la section suivante (cycle, « Tout »
                    compris — il se comporte comme les autres). */}
                {ActiveIcon && (
                  <button
                    onClick={() => nextCategory && setActiveCategory(nextCategory)}
                    title={`Suivant : ${nextCategory}`}
                    className="group flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 bg-white/85 py-1.5 pl-1.5 pr-3.5 shadow-xl backdrop-blur-md transition-transform hover:-translate-y-0.5 md:gap-3 md:py-2.5 md:pl-2.5 md:pr-5"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 md:h-10 md:w-10">
                      <ActiveIcon className="h-4 w-4 text-neutral-900 md:h-5 md:w-5" />
                    </span>
                    <span className="font-display text-xs font-bold uppercase tracking-wide text-neutral-900 md:text-sm">
                      {activeCategory}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-neutral-400 transition-transform group-hover:translate-x-0.5 md:h-4 md:w-4" />
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image agrandie plein écran : clic sur une réalisation → vue complète.
          Clic n'importe où, bouton ✕ ou Échap pour refermer. */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            className="fixed inset-0 z-[100002] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setZoomed(null)}
          >
            <button
              onClick={() => setZoomed(null)}
              aria-label="Fermer"
              className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-neutral-900 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.img
              key={zoomed}
              src={zoomed}
              alt=""
              draggable={false}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
