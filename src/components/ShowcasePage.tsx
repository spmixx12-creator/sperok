'use client';

// ShowcasePage.tsx
// Page dédiée « présentation projet » : chaque projet occupe TOUT l'écran.
//   - INFOS à gauche (~25 %) : titre + client (+ tag, description, rôle) ;
//   - APERÇU à droite (~75 %).
// Web design : la colonne infos (gauche) reste FIXE (épinglée) pendant que
// l'aperçu pleine page défile à droite ; arrivé en bas de l'aperçu, on passe
// au projet suivant. Montage vidéo : aperçu = vidéo, un projet par écran
// (scroll-snap). Générique, réutilisable.
import {
  useLayoutEffect,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import gamplaySite from '../créa/gamplay-site.png';
import vintageSite from '../créa/vintage-site.png';
import snakiSite from '../créa/snaki-site.png';

const ACCENT = '#F5B419';

export interface ShowProject {
  index: string;
  title: string;
  tag?: string;
  description?: string;
  client: string;
  role?: string;
  media: string;
  video?: boolean;
}

// Projets web design (respecte les projets envoyés).
const WEB_PROJECTS: ShowProject[] = [
  {
    index: '01',
    title: 'Gamplay',
    tag: 'SITE WEB • GAMING',
    description:
      "Boutique d'accessoires gaming pensée pour la performance. Univers sombre et nerveux, parcours d'achat direct.",
    client: 'Gamplay',
    role: 'Design & Développement',
    media: gamplaySite,
  },
  {
    index: '02',
    title: 'Vintage',
    tag: 'MARKETPLACE • 2026',
    description:
      "Première marketplace d'occasion sécurisée du Bénin. Interface de confiance, claire et rassurante.",
    client: 'Vintage Bénin',
    role: 'UI/UX & Développement',
    media: vintageSite,
  },
  {
    index: '03',
    title: 'Snaki',
    tag: 'SITE WEB • FOOD',
    description:
      'Site de commande pour une enseigne de bubble tea & snacks. Interface gourmande, colorée et fluide.',
    client: 'Snaki',
    role: 'Design & Développement',
    media: snakiSite,
  },
];

// Projets montage vidéo (vidéos du dossier ; client = Chrisnaud AGOSSOU).
const MONTAGE_MODULES = import.meta.glob('../Apperçu/Montage Vidéo/*.mp4', {
  eager: true,
  import: 'default',
}) as Record<string, string>;
const MONTAGE_PROJECTS: ShowProject[] = Object.keys(MONTAGE_MODULES)
  .sort()
  .map((k, i) => ({
    index: String(i + 1).padStart(2, '0'),
    title: `Montage ${String(i + 1).padStart(2, '0')}`,
    tag: 'MONTAGE VIDÉO',
    description: 'Récit monté image par image — rythme, transitions et sound design.',
    client: 'Chrisnaud AGOSSOU',
    role: 'Montage & Étalonnage',
    media: MONTAGE_MODULES[k],
    video: true,
  }));

const SHOWCASES: Record<string, { title: string; projects: ShowProject[] }> = {
  'web-design': { title: 'Web Design', projects: WEB_PROJECTS },
  'montage-video': { title: 'Montage Vidéo', projects: MONTAGE_PROJECTS },
};

/* ------------------------------------------------------------------ */
/* Colonne d'infos (gauche)                                            */
/* ------------------------------------------------------------------ */

const Info: FC<{
  project: ShowProject;
  total: string;
  onBack: () => void;
  barWidth?: MotionValue<string>;
}> = ({ project, total, onBack, barWidth }) => (
  <div className="order-2 flex w-full flex-col justify-center gap-4 px-7 py-8 md:order-1 md:w-1/4 md:px-8">
    <span className="font-mono text-[11px] uppercase tracking-widest text-white/40">
      {project.index} / {total}
    </span>
    <h2 className="font-display text-4xl font-black leading-[0.92] tracking-tight text-white md:text-5xl">
      {project.title}
    </h2>
    {project.tag && (
      <span className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
        {project.tag}
      </span>
    )}
    {project.description && (
      <p className="max-w-sm text-sm leading-relaxed text-white/50">{project.description}</p>
    )}

    <div className="mt-2 grid grid-cols-2 gap-5">
      <div>
        <span className="block font-mono text-[10px] uppercase tracking-widest text-white/30">
          Client
        </span>
        <span className="mt-1 block font-display text-sm text-white/85">{project.client}</span>
      </div>
      {project.role && (
        <div>
          <span className="block font-mono text-[10px] uppercase tracking-widest text-white/30">
            Rôle
          </span>
          <span className="mt-1 block font-display text-sm text-white/85">{project.role}</span>
        </div>
      )}
    </div>

    {/* Progression du scroll dans l'aperçu (web design uniquement) */}
    {barWidth && (
      <div className="mt-1 h-[3px] w-full max-w-sm overflow-hidden rounded-full bg-white/10">
        <motion.div style={{ width: barWidth, backgroundColor: ACCENT }} className="h-full rounded-full" />
      </div>
    )}

    <a
      href="#contact"
      onClick={onBack}
      className="group mt-4 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 font-display text-sm font-semibold text-neutral-900 transition-transform hover:-translate-y-0.5"
      style={{ backgroundColor: ACCENT }}
    >
      <span>Me contacter</span>
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
    </a>
  </div>
);

/* ------------------------------------------------------------------ */
/* Conteneur d'aperçu (droite, ~75 %)                                  */
/* ------------------------------------------------------------------ */

const PreviewShell: FC<{ children: ReactNode; refEl?: (n: HTMLDivElement | null) => void }> = ({
  children,
  refEl,
}) => (
  <div
    ref={refEl}
    className="relative order-1 h-[58%] w-full overflow-hidden bg-[#0a0a0a] md:order-2 md:h-full md:w-3/4"
  >
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* WEB DESIGN : scène épinglée — infos fixes, aperçu qui défile         */
/* ------------------------------------------------------------------ */

const PinnedScene: FC<{ project: ShowProject; total: string; onBack: () => void }> = ({
  project,
  total,
  onBack,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  // Distance = hauteur de l'aperçu qui dépasse le cadre (à faire défiler).
  useLayoutEffect(() => {
    const inner = innerRef.current;
    const frame = frameRef.current;
    if (!inner || !frame) return;
    const update = () => setDistance(Math.max(0, inner.scrollHeight - frame.clientHeight));
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
  const barWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={trackRef} style={{ height: `calc(100vh + ${distance}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden md:flex-row">
        <Info project={project} total={total} onBack={onBack} barWidth={barWidth} />
        <PreviewShell refEl={(n) => { frameRef.current = n; }}>
          <motion.div
            ref={innerRef}
            style={{ y, willChange: 'transform' }}
            className="absolute left-0 top-0 w-full"
          >
            <img
              src={project.media}
              alt={`Aperçu — ${project.title}`}
              draggable={false}
              className="block h-auto w-full select-none"
            />
          </motion.div>
        </PreviewShell>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* MONTAGE : un projet par écran (scroll-snap), aperçu = vidéo          */
/* ------------------------------------------------------------------ */

const SnapScene: FC<{ project: ShowProject; total: string; onBack: () => void }> = ({
  project,
  total,
  onBack,
}) => (
  <section className="flex h-screen w-full snap-start flex-col overflow-hidden md:flex-row">
    <Info project={project} total={total} onBack={onBack} />
    <PreviewShell>
      <video
        src={project.media}
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
      />
    </PreviewShell>
  </section>
);

/* ------------------------------------------------------------------ */

interface ShowcasePageProps {
  kind: 'web-design' | 'montage-video';
  onBack: () => void;
}

export default function ShowcasePage({ kind, onBack }: ShowcasePageProps) {
  const { title, projects } = SHOWCASES[kind] ?? SHOWCASES['web-design'];
  const isWeb = kind === 'web-design';

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [kind]);

  const total = String(projects.length).padStart(2, '0');

  const header = (
    <>
      <button
        onClick={onBack}
        className="group fixed top-5 left-6 z-50 flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 font-display text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white hover:text-neutral-900 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Réalisations</span>
      </button>
      <span className="pointer-events-none fixed top-6 right-6 z-50 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
        {title}
      </span>
    </>
  );

  // Web design : défilement de page (window) → l'épinglage sticky fonctionne.
  if (isWeb) {
    return (
      <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0a0a0a] text-white font-sans selection:bg-[#F5B419] selection:text-neutral-900">
        {header}
        {projects.map((p) => (
          <PinnedScene key={p.index} project={p} total={total} onBack={onBack} />
        ))}
      </div>
    );
  }

  // Montage : un projet par écran, scroll-snap.
  return (
    <div className="relative h-screen w-full overflow-x-hidden bg-[#0a0a0a] text-white font-sans selection:bg-[#F5B419] selection:text-neutral-900">
      {header}
      <div className="h-screen w-full snap-y snap-mandatory overflow-y-scroll">
        {projects.map((p) => (
          <SnapScene key={p.index} project={p} total={total} onBack={onBack} />
        ))}
      </div>
    </div>
  );
}
