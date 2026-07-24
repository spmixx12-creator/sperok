'use client';

// projects-showcase.tsx
// Section « Mes sites, en action. » : chaque projet s'affiche dans une fenêtre
// navigateur (style macOS). Quand on SCROLLE la page (et rien d'autre), la
// maquette défile toute seule à l'intérieur de la fenêtre, du haut au footer ;
// puis le projet suivant remonte et prend sa place.
//
// Technique : pas de GSAP (le projet utilise `motion/react`). Chaque scène est
// « épinglée » via `position: sticky` ; un `useScroll` mesure la progression du
// pin et pilote le translateY de la maquette interne. La distance de défilement
// est mesurée (ResizeObserver) pour s'adapter à la hauteur réelle de chaque
// maquette. Accent = ambre (DA du portfolio), fond sombre comme la référence.
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FC,
  type ReactNode,
  type RefObject,
} from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import gamplaySite from '../../créa/gamplay-site.png';
import vintageSite from '../../créa/vintage-site.png';
import snakiSite from '../../créa/snaki-site.png';

const ACCENT = '#feb804'; // ambre de la DA (remplace le vert acide de la réf)
const DOMAIN = 'sperokouton.com'; // domaine fictif affiché dans la barre d'URL
const READ_FACTOR = 1.1; // > 1 = on prend plus de temps pour lire la maquette

// Visuels locaux (dossier Apperçu) réutilisés pour composer les maquettes.
const MODULES = import.meta.glob('../../Apperçu/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
});
const IMAGES = Object.keys(MODULES)
  .sort()
  .map((k) => MODULES[k] as string);
const img = (i: number) => (IMAGES.length ? IMAGES[i % IMAGES.length] : '');
const pick = (offset: number, n = 4) =>
  Array.from({ length: n }, (_, i) => img(offset + i));

interface Project {
  index: string;
  title: string;
  tag: string;
  description: string;
  client: string;
  role: string;
  slug: string;
  image: string;
}

// Projets web présentés dans la fenêtre navigateur, dans l'ordre voulu.
const PROJECTS: Project[] = [
  {
    index: '01',
    title: 'Gamplay',
    tag: 'SITE WEB • GAMING',
    description:
      "Boutique d'accessoires gaming pensée pour la performance. Univers sombre et nerveux, parcours d'achat direct.",
    client: 'Gamplay',
    role: 'Design & Développement',
    slug: 'gamplay',
    image: gamplaySite,
  },
  {
    index: '02',
    title: 'Vintage',
    tag: 'MARKETPLACE • 2026',
    description:
      "Première marketplace d'occasion sécurisée du Bénin. Interface de confiance, claire et rassurante.",
    client: 'Vintage Bénin',
    role: 'UI/UX & Développement',
    slug: 'vintage',
    image: vintageSite,
  },
  {
    index: '03',
    title: 'Snaki',
    tag: 'SITE WEB • FOOD',
    description:
      'Site de commande pour une enseigne de bubble tea & snacks. Interface gourmande, colorée et fluide.',
    client: 'Snaki',
    role: 'Design & Développement',
    slug: 'snaki',
    image: snakiSite,
  },
];

/* ------------------------------------------------------------------ */
/* Maquette interne (fausse page de site, assemblée depuis les visuels) */
/* ------------------------------------------------------------------ */

const MockupPage: FC<{ project: Project }> = ({ project }) => (
  // Capture pleine page réelle du site : elle défile dans la fenêtre navigateur.
  <div className="w-full bg-white" data-mockup-page>
    <img
      src={project.image}
      alt={`Aperçu du site ${project.title}`}
      className="block h-auto w-full select-none"
      draggable={false}
    />
  </div>
);

/* ------------------------------------------------------------------ */
/* Fenêtre navigateur (faux chrome macOS)                              */
/* ------------------------------------------------------------------ */

const BrowserFrame: FC<{
  slug: string;
  frameRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  /** Remplit la hauteur du parent (mode portrait) au lieu du ratio 16/10. */
  fill?: boolean;
}> = ({ slug, frameRef, children, fill = false }) => (
  <div
    className={`overflow-hidden rounded-xl border border-white/[0.08] bg-[#1c1c1c] shadow-2xl shadow-black/50 ${
      fill ? 'flex h-full flex-col' : ''
    }`}
    aria-hidden
  >
    {/* Barre supérieure */}
    <div className="flex h-9 shrink-0 items-center gap-2 border-b border-white/[0.06] px-3 sm:px-4">
      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      <div className="ml-3 max-w-[70%] truncate rounded-md bg-white/[0.05] px-3 py-1 font-mono text-[10px] text-white/40 sm:text-[11px]">
        {DOMAIN}/{slug}
      </div>
    </div>
    {/* Zone de contenu (overflow caché). Ratio 16/10 en desktop, plein en portrait. */}
    <div
      ref={frameRef}
      className={`relative overflow-hidden ${fill ? 'flex-1' : ''}`}
      style={fill ? undefined : { aspectRatio: '16 / 10' }}
    >
      {children}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Une scène projet (pin + scrub via sticky/useScroll)                */
/* ------------------------------------------------------------------ */

type Variant = 'desktop' | 'mobile' | 'reduced';

const ProjectScene: FC<{ project: Project; total: number; variant: Variant }> = ({
  project,
  total,
  variant,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  const isMobile = variant === 'mobile';
  const isReduced = variant === 'reduced';
  const pinned = !isReduced; // desktop + mobile = effet épinglé/scroll-driven

  // Mesure la distance de défilement interne (recalcule au resize / chargement
  // des images via ResizeObserver).
  useLayoutEffect(() => {
    const inner = innerRef.current;
    const frame = frameRef.current;
    if (!inner || !frame) return;
    const update = () =>
      setDistance(Math.max(0, inner.scrollHeight - frame.clientHeight));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(inner);
    ro.observe(frame);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const dotY = useTransform(scrollYProgress, [0, 1], [0, 92]);
  const barWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Hauteur du « track » : viewport (le pin) + distance à parcourir (× facteur de
  // lecture, plus court sur mobile). `dvh` sur mobile pour éviter les sauts liés
  // à la barre d'adresse. En reduced-motion : pas de pin → hauteur auto.
  const vh = isMobile ? '100dvh' : '100vh';
  const factor = isMobile ? 0.9 : READ_FACTOR;
  const trackStyle: CSSProperties = isReduced
    ? {}
    : { height: `calc(${vh} + ${distance * factor}px)` };

  // --- Maquette interne (commune aux 3 variantes) ---
  const Mockup = isReduced ? (
    <div className="absolute inset-0 overflow-y-auto">
      <div ref={innerRef}>
        <MockupPage project={project} />
      </div>
    </div>
  ) : (
    <motion.div
      ref={innerRef}
      style={{ y, willChange: 'transform' }}
      className="absolute left-0 top-0 w-full"
      data-mockup-img
    >
      <MockupPage project={project} />
    </motion.div>
  );

  /* -------------------- MOBILE / TABLETTE (portrait) -------------------- */
  if (isMobile || isReduced) {
    return (
      <div ref={trackRef} style={trackStyle} className="relative">
        <div
          className={
            pinned
              ? 'sticky top-0 flex h-[100dvh] w-full flex-col overflow-hidden px-5 pb-5 pt-24'
              : 'flex min-h-[100svh] w-full flex-col px-5 pb-12 pt-24'
          }
        >
          {/* En-tête compact */}
          <div className="shrink-0">
            <span className="font-mono text-[11px] uppercase tracking-widest text-white/45">
              {project.index} / {String(total).padStart(2, '0')}
            </span>
            <h3 className="mt-2 font-display text-4xl font-black leading-[0.92] tracking-tight text-white">
              {project.title}
            </h3>
            <span
              className="mt-2 block font-mono text-[10px] uppercase tracking-[0.18em]"
              style={{ color: ACCENT }}
            >
              {project.tag}
            </span>
            <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-white/45">
              {project.description}
            </p>
          </div>

          {/* Fenêtre navigateur — remplit l'espace restant */}
          <div className="relative mt-4 min-h-0 flex-1">
            <BrowserFrame slug={project.slug} frameRef={frameRef} fill>
              {Mockup}
            </BrowserFrame>
          </div>

          {/* Bas : progression interne + client/rôle + contact */}
          <div className="mt-4 shrink-0">
            {pinned && (
              <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  style={{ width: barWidth, backgroundColor: ACCENT }}
                  className="h-full rounded-full"
                />
              </div>
            )}
            <div className="mt-3 flex items-center justify-between">
              <div className="min-w-0">
                <span className="block truncate font-mono text-[10px] uppercase tracking-widest text-white/35">
                  {project.client} · {project.role}
                </span>
              </div>
              <a
                href="#contact"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 font-display text-[13px] font-semibold text-neutral-900"
                style={{ backgroundColor: ACCENT }}
              >
                <span>Me contacter</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------- DESKTOP (deux colonnes) -------------------- */
  return (
    <div ref={trackRef} style={trackStyle} className="relative">
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden">
        {/* Corps : 2 colonnes */}
        <div className="flex flex-1 items-center">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-12 lg:px-12">
            {/* Indicateur de scroll (point vertical) */}
            <div className="absolute left-3 top-1/2 hidden h-[116px] -translate-y-1/2 lg:block">
              <div className="relative h-full w-px bg-white/10">
                <motion.span
                  style={{ y: dotY }}
                  className="absolute -left-[3px] top-0 h-2 w-2 rounded-full"
                >
                  <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: ACCENT }} />
                </motion.span>
              </div>
            </div>

            {/* Colonne gauche : infos */}
            <div className="lg:col-span-4">
              <span className="font-mono text-[11px] uppercase tracking-widest text-white/40">
                {project.index} / {String(total).padStart(2, '0')}
              </span>
              <h3 className="mt-3 font-display text-5xl font-black leading-[0.9] tracking-tight text-white md:text-6xl">
                {project.title}
              </h3>
              <span
                className="mt-4 block font-mono text-[11px] uppercase tracking-[0.2em]"
                style={{ color: ACCENT }}
              >
                {project.tag}
              </span>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/50">
                {project.description}
              </p>

              <div className="mt-7 grid grid-cols-2 gap-6">
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-white/30">
                    Client
                  </span>
                  <span className="mt-1 block font-display text-sm text-white/80">
                    {project.client}
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-white/30">
                    Rôle
                  </span>
                  <span className="mt-1 block font-display text-sm text-white/80">
                    {project.role}
                  </span>
                </div>
              </div>

              <a
                href="#contact"
                className="group mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 font-display text-sm font-semibold text-white transition-colors hover:border-transparent hover:text-neutral-900"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = ACCENT)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span>Me contacter</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </a>
            </div>

            {/* Colonne droite : fenêtre navigateur */}
            <div className="lg:col-span-8">
              <BrowserFrame slug={project.slug} frameRef={frameRef}>
                {Mockup}
              </BrowserFrame>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Section complète                                                    */
/* ------------------------------------------------------------------ */

const computeVariant = (): Variant => {
  if (typeof window === 'undefined') return 'desktop';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'reduced';
  return window.innerWidth < 1024 ? 'mobile' : 'desktop';
};

export function ProjectsShowcase() {
  // 'reduced' = accessibilité (statique) ; 'mobile' = portrait épinglé ;
  // 'desktop' = deux colonnes.
  const [variant, setVariant] = useState<Variant>(computeVariant);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setVariant(computeVariant());
    mq.addEventListener('change', update);
    window.addEventListener('resize', update);
    return () => {
      mq.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // Le titre démarre GRAND et centré, puis se réduit au fil du scroll de la zone
  // d'intro jusqu'à sa taille de bandeau — où il reste épinglé tout le reste.
  const introRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: introP } = useScroll({
    target: introRef,
    offset: ['start start', 'end start'],
  });
  const animate = variant !== 'reduced';
  const bigScale = animate ? (variant === 'mobile' ? 1.9 : 2.7) : 1;
  const titleScale = useTransform(introP, [0, 1], [bigScale, 1]);
  const titleY = useTransform(introP, [0, 1], [animate ? '42vh' : '0vh', '0vh']);

  return (
    <section id="sites" className="relative w-full bg-[#0a0a0a]">
      {/* Titre de section — bandeau persistant qui reste affiché en haut pendant
          tout le défilement. Au départ il est grand/centré (transform piloté par
          le scroll de la zone d'intro) puis se réduit jusqu'à sa taille finale.
          `pointer-events-none` pour ne pas bloquer les clics du contenu dessous. */}
      <div className="pointer-events-none sticky top-0 z-30 flex justify-center bg-[#0a0a0a]/80 px-6 py-5 text-center backdrop-blur-md">
        <motion.h2
          style={{ scale: titleScale, y: titleY, transformOrigin: 'center center' }}
          className="font-display text-3xl font-black tracking-tight text-white md:text-5xl"
        >
          Web Design
          <span style={{ color: ACCENT }}>/</span>
          Vibe coding
        </motion.h2>
      </div>

      {/* Zone d'intro : donne la distance de scroll pendant laquelle le titre se
          réduit, avant que le premier projet ne commence. */}
      <div ref={introRef} aria-hidden style={{ height: '80vh' }} />

      {PROJECTS.map((p) => (
        <ProjectScene key={p.slug} project={p} total={PROJECTS.length} variant={variant} />
      ))}
    </section>
  );
}

export default ProjectsShowcase;
