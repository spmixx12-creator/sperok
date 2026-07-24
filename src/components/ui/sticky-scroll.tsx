// sticky-scroll.tsx
//
// Galerie d'aperçus de projets en défilement "sticky".
// Adapté du composant ui-layout : intégré comme SECTION (pas comme page racine),
// donc on n'utilise PAS <ReactLenis root> (cela entrerait en conflit avec le scroll
// global de la page). L'effet sticky est du CSS pur (position: sticky), Lenis n'est
// pas nécessaire ici. Thème aligné sur le portfolio : fond sombre + accents ambre.
import { forwardRef, useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'motion/react';

interface StickyScrollGalleryProps {
  id?: string;
}

// Dégradé gris repris du titre original, partagé par chaque segment de "SPÉROK".
const GRADIENT_TEXT =
  'bg-gradient-to-r from-neutral-500 to-neutral-800 bg-clip-text text-transparent';

/**
 * Petite mascotte ambre qui surgit de l'intérieur de la lettre « O ».
 * Elle est rendue DERRIÈRE le glyphe « O » (z-0 vs z-10) : l'anneau opaque du O
 * la masque et elle n'apparaît qu'à travers le trou de la lettre → effet "sort du O".
 */
function PeekingMascot({ active }: { active: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-1/2 z-0 -translate-x-1/2"
      style={{ width: '7vw', top: '20%' }}
      initial={{ y: '120%' }}
      animate={active ? { y: ['120%', '-8%', '-8%', '120%'] } : { y: '120%' }}
      transition={{
        duration: 5,
        times: [0, 0.18, 0.8, 1],
        repeat: Infinity,
        repeatDelay: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Bras qui fait coucou */}
      <motion.div
        className="absolute -right-[1.4vw] top-[1.2vw] origin-bottom-left rounded-full bg-amber-400"
        style={{ width: '3vw', height: '1.1vw', border: '0.25vw solid #1C1917' }}
        animate={active ? { rotate: [0, 22, -6, 22, 0] } : { rotate: 0 }}
        transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Tête */}
      <div
        className="relative flex aspect-square w-full items-center justify-center rounded-full bg-amber-400 shadow-xl"
        style={{ border: '0.35vw solid #1C1917' }}
      >
        <svg viewBox="0 0 100 100" className="h-[60%] w-[60%]">
          <circle cx="35" cy="42" r="7" fill="#1C1917" />
          <circle cx="65" cy="42" r="7" fill="#1C1917" />
          <path
            d="M32 60 Q50 78 68 60"
            stroke="#1C1917"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </motion.div>
  );
}

/** Signature géante "SPÉROK" dont la lettre O laisse sortir la mascotte. */
function Signature() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, margin: '-20% 0px -20% 0px' });

  return (
    <footer ref={ref} className="group bg-neutral-950">
      <h2 className="translate-y-16 text-center text-[16vw] font-black uppercase leading-[100%] tracking-tighter">
        <span className={GRADIENT_TEXT}>Spér</span>
        {/* La lettre "O" sert de scène à la mascotte */}
        <span className="relative inline-block align-baseline">
          <span className={`relative z-10 ${GRADIENT_TEXT}`}>o</span>
          <PeekingMascot active={inView} />
        </span>
        <span className={GRADIENT_TEXT}>k</span>
      </h2>
    </footer>
  );
}

// Aperçus de projets — images locales (dossier src/Apperçu), chargées via Vite.
const APERCU_MODULES = import.meta.glob('../../Apperçu/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
});
// Image de fin (bas à droite) : épinglée explicitement en dernière position,
// indépendamment du tri alphabétique. Pour la changer, modifier END_IMAGE_NAME.
const END_IMAGE_NAME = 'Design sans titre (5)';
const END_SRC =
  (Object.entries(APERCU_MODULES).find(([key]) =>
    key.includes(END_IMAGE_NAME),
  )?.[1] as string) ?? '';

// Images écartées de la galerie (jamais affichées).
const EXCLUDED = ['WhatsApp', 'Simple', 'blue_pastry', 'sperok_logo_transparent'];

// 13 images : 12 auto (triées par nom) + l'image de fin épinglée en dernier.
const AUTO_IMAGES = Object.keys(APERCU_MODULES)
  .filter(
    (key) =>
      !key.includes(END_IMAGE_NAME) &&
      !EXCLUDED.some((name) => key.includes(name)),
  )
  .sort()
  .map((key) => APERCU_MODULES[key] as string);
const APERCU_IMAGES = [...AUTO_IMAGES.slice(0, 12), END_SRC];

const LEFT_COLUMN = APERCU_IMAGES.slice(0, 5);
const CENTER_COLUMN = APERCU_IMAGES.slice(5, 8);
const RIGHT_COLUMN = APERCU_IMAGES.slice(8, 13);

// Image "VINTAGE VOUS REGALE" (63.png) : reçoit un pan vertical lié au scroll.
const VINTAGE_SRC =
  (Object.entries(APERCU_MODULES).find(([key]) =>
    key.includes('/63.'),
  )?.[1] as string) ?? '';

// Ticket "THE BAL" (3.png) : reçoit un pan horizontal (gauche → droite) lié au scroll.
const BAL_SRC =
  (Object.entries(APERCU_MODULES).find(([key]) =>
    key.includes('/3.'),
  )?.[1] as string) ?? '';

// "Green (6)" : reçoit un pan horizontal (droite → gauche) lié au scroll.
const GREEN_SRC =
  (Object.entries(APERCU_MODULES).find(([key]) =>
    key.includes('Green (6)'),
  )?.[1] as string) ?? '';

// Formes et découpes asymétriques/éditoriales pour les cases de la colonne gauche.
// Mobile/tablette : hauteurs en `vh` (colonnes plus hautes que le viewport → vraie
// course de scroll). Desktop (lg/xl) : hauteurs fixes en rem, comme avant.
const CARD_SHAPES_LEFT = [
  {
    height: 'h-[42vh] w-full lg:h-[22rem] xl:h-[26rem]',
    rounded: 'rounded-[1.2rem] lg:rounded-[2rem]',
  },
  {
    height: 'h-[30vh] w-full lg:h-[16rem] xl:h-[20rem]',
    rounded: 'rounded-tl-[1.8rem] rounded-br-[1.8rem] lg:rounded-tl-[2.2rem] lg:rounded-br-[2.2rem] rounded-tr-md rounded-bl-md',
  },
  {
    height: 'h-[46vh] w-full lg:h-[26rem] xl:h-[28rem]',
    rounded: 'rounded-tr-[2.0rem] rounded-bl-[2.0rem] lg:rounded-tr-[2.5rem] lg:rounded-bl-[2.5rem] rounded-tl-lg rounded-br-lg',
  },
  {
    height: 'h-[34vh] w-full lg:h-[18rem] xl:h-[22rem]',
    rounded: 'rounded-[1.8rem] lg:rounded-[2.5rem]',
  },
  {
    height: 'h-[44vh] w-full lg:h-[24rem] xl:h-[26rem]',
    rounded: 'rounded-t-[1.8rem] lg:rounded-t-[2.2rem] rounded-b-md',
  },
];

// Formes et découpes asymétriques/éditoriales pour les cases de la colonne droite.
const CARD_SHAPES_RIGHT = [
  {
    height: 'h-[34vh] w-full lg:h-[18rem] xl:h-[22rem]',
    rounded: 'rounded-tr-[1.8rem] rounded-bl-[1.8rem] lg:rounded-tr-[2.2rem] lg:rounded-bl-[2.2rem] rounded-tl-md rounded-br-md',
  },
  {
    height: 'h-[45vh] w-full lg:h-[25rem] xl:h-[28rem]',
    rounded: 'rounded-[1.8rem] lg:rounded-[2.5rem]',
  },
  {
    height: 'h-[30vh] w-full lg:h-[16rem] xl:h-[20rem]',
    rounded: 'rounded-b-[1.8rem] lg:rounded-b-[2.2rem] rounded-t-md',
  },
  {
    height: 'h-[44vh] w-full lg:h-[24rem] xl:h-[26rem]',
    rounded: 'rounded-tl-[2.0rem] rounded-br-[2.0rem] lg:rounded-tl-[2.5rem] lg:rounded-br-[2.5rem] rounded-tr-lg rounded-bl-lg',
  },
  {
    height: 'h-[38vh] w-full lg:h-[20rem] xl:h-[24rem]',
    rounded: 'rounded-[1.8rem] lg:rounded-[2.5rem]',
  },
];

// Formes arrondies des 3 cases centrales figées
const CENTER_SHAPES = [
  'rounded-b-[1.2rem] lg:rounded-b-[2.2rem] rounded-t-md',
  'rounded-[1.2rem] lg:rounded-[2.2rem]',
  'rounded-t-[1.2rem] lg:rounded-t-[2.2rem] rounded-b-md',
];

const StickyScrollGallery = forwardRef<HTMLElement, StickyScrollGalleryProps>(
  ({ id }, ref) => {
    // Redéclenche le tracé du soulignement toutes les 6 s.
    const [drawKey, setDrawKey] = useState(0);
    useEffect(() => {
      const interval = setInterval(() => setDrawKey((k) => k + 1), 6000);
      return () => clearInterval(interval);
    }, []);

    // Pan vertical (haut → bas) de l'image "VINTAGE VOUS REGALE" tout au long
    // du défilement de la galerie.
    const galleryRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
      target: galleryRef,
      offset: ['start start', 'end end'],
    });
    const vintageObjectPosition = useTransform(
      scrollYProgress,
      [0, 1],
      ['50% 0%', '50% 100%'],
    );
    // Mouvement inversé (bas → haut) pour les images du haut et du bas.
    const invertedObjectPosition = useTransform(
      scrollYProgress,
      [0, 1],
      ['50% 100%', '50% 0%'],
    );
    // Pan horizontal (gauche → droite) de l'image ticket "THE BAL".
    const balObjectPosition = useTransform(
      scrollYProgress,
      [0, 1],
      ['0% 50%', '100% 50%'],
    );
    // Pan horizontal (droite → gauche) de l'image "Green (6)".
    const greenObjectPosition = useTransform(
      scrollYProgress,
      [0, 1],
      ['100% 50%', '0% 50%'],
    );

    return (
      <section id={id} ref={ref} className="relative bg-neutral-950 text-white">
        {/* Panneau d'intro épinglé pendant un écran, puis la galerie défile par-dessus */}
        <div className="wrapper">
          <div className="sticky top-0 grid h-screen w-full place-content-center overflow-hidden bg-neutral-950">
            {/* Grille décorative en fondu (cohérente avec le reste du site) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="relative z-10 px-8 text-center">
              <span className="mb-6 inline-block rounded border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-amber-500">
                APERÇUS // GALERIE_DÉFILANTE
              </span>
              <h2 className="font-display text-5xl font-black uppercase leading-[110%] tracking-tight 2xl:text-7xl">
                {/* Effet surligneur ambre (identique à "mon monde" de l'intro) */}
                <span className="relative inline-block select-none px-1">
                  <span className="text-neutral-500">Un aperçu</span>
                  <motion.span
                    initial={{ width: '0%' }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ delay: 0.2, duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                    className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap bg-amber-400"
                  >
                    <span className="absolute left-1 top-0 bottom-0 flex h-full items-center whitespace-nowrap text-neutral-950">
                      Un aperçu
                    </span>
                  </motion.span>
                </span>{' '}
                de ce que
                <br />
                <span className="relative inline-block">
                  je fais ?
                  {/* Soulignement dessiné à la main (tracé irrégulier), rejoué toutes les 6 s */}
                  <motion.svg
                    key={drawKey}
                    viewBox="0 0 300 24"
                    preserveAspectRatio="none"
                    fill="none"
                    aria-hidden
                    className="pointer-events-none absolute -bottom-3 left-0 h-3 w-full overflow-visible text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.45)]"
                  >
                    <motion.path
                      d="M3 14 C 60 6, 120 20, 180 11 S 270 5, 297 13"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 1, ease: [0.25, 1, 0.5, 1] }}
                    />
                  </motion.svg>
                </span>
              </h2>
              <p className="mx-auto mt-5 max-w-md font-mono text-[11px] uppercase tracking-widest text-neutral-500">
                Faites défiler pour parcourir la sélection 👇
              </p>
            </div>
          </div>
        </div>

        {/* Galerie 3 colonnes : formes variées et éditoriales, conserve la dynamique sticky scroll et le plein écran */}
        <div ref={galleryRef} className="w-full bg-neutral-950 px-1 sm:px-3">
          <div className="grid grid-cols-12 gap-2 sm:gap-3">
            {/* Colonne gauche (défile en plein écran) */}
            <div className="col-span-4 grid gap-2 sm:gap-3">
              {LEFT_COLUMN.map((src, i) => {
                const shape = CARD_SHAPES_LEFT[i % CARD_SHAPES_LEFT.length];
                return src === BAL_SRC ? (
                  <figure
                    key={`l-${i}`}
                    className={`group relative w-full overflow-hidden border border-white/15 hover:border-amber-400/50 shadow-lg shadow-black/40 transition-all duration-500 ${shape.rounded}`}
                  >
                    {/* Ticket "THE BAL" : pan horizontal (gauche → droite) lié au scroll. */}
                    <motion.img
                      src={src}
                      alt="The Bal — ticket d'entrée"
                      loading="lazy"
                      style={{ objectPosition: balObjectPosition }}
                      className={`${shape.height} w-full object-cover align-bottom transition-transform duration-700 group-hover:scale-105`}
                    />
                  </figure>
                ) : (
                  <figure
                    key={`l-${i}`}
                    className={`group relative w-full overflow-hidden border border-white/15 hover:border-amber-400/50 shadow-lg shadow-black/40 transition-all duration-500 ${shape.rounded}`}
                  >
                    <img
                      src={src}
                      alt={`Aperçu projet ${i + 1}`}
                      loading="lazy"
                      className={`${shape.height} w-full object-cover align-bottom transition-all duration-700 group-hover:scale-105`}
                    />
                  </figure>
                );
              })}
            </div>

            {/* Colonne centrale (figée / sticky en plein écran sur TOUS les écrans :
                mobile, tablette et PC) */}
            <div className="col-span-4 sticky top-0 h-screen grid gap-2 sm:gap-3 grid-rows-3 py-1.5 lg:py-2">
              {CENTER_COLUMN.map((src, i) => {
                const rounded = CENTER_SHAPES[i % CENTER_SHAPES.length];
                return (
                  <figure
                    key={`c-${i}`}
                    className={`group relative w-full h-full overflow-hidden border border-white/15 hover:border-amber-400/50 shadow-lg shadow-black/40 transition-all duration-500 ${rounded}`}
                  >
                    {/* Les 3 images centrales (figées) pannent verticalement avec le scroll. */}
                    <motion.img
                      src={src}
                      alt={src === VINTAGE_SRC ? 'Vintage vous régale' : `Aperçu projet phare ${i + 1}`}
                      loading="lazy"
                      style={{ objectPosition: src === VINTAGE_SRC ? vintageObjectPosition : invertedObjectPosition }}
                      className="h-full w-full object-cover align-bottom transition-transform duration-700 group-hover:scale-105"
                    />
                  </figure>
                );
              })}
            </div>

            {/* Colonne droite (défile en plein écran) */}
            <div className="col-span-4 grid gap-2 sm:gap-3">
              {RIGHT_COLUMN.map((src, i) => {
                const shape = CARD_SHAPES_RIGHT[i % CARD_SHAPES_RIGHT.length];
                return src === GREEN_SRC ? (
                  <figure
                    key={`r-${i}`}
                    className={`group relative w-full overflow-hidden border border-white/15 hover:border-amber-400/50 shadow-lg shadow-black/40 transition-all duration-500 ${shape.rounded}`}
                  >
                    {/* "Green (6)" : pan horizontal (droite → gauche) lié au scroll. */}
                    <motion.img
                      src={src}
                      alt="Green (6)"
                      loading="lazy"
                      style={{ objectPosition: greenObjectPosition }}
                      className={`${shape.height} w-full object-cover align-bottom transition-transform duration-700 group-hover:scale-105`}
                    />
                  </figure>
                ) : (
                  <figure
                    key={`r-${i}`}
                    className={`group relative w-full overflow-hidden border border-white/15 hover:border-amber-400/50 shadow-lg shadow-black/40 transition-all duration-500 ${shape.rounded}`}
                  >
                    <img
                      src={src}
                      alt={`Aperçu projet ${i + 6}`}
                      loading="lazy"
                      className={`${shape.height} w-full object-cover align-bottom transition-all duration-700 group-hover:scale-105`}
                    />
                  </figure>
                );
              })}
            </div>
          </div>
        </div>

        {/* Signature géante révélée en fin de défilement */}
        <Signature />
        <div className="relative z-10 -mt-px grid h-32 place-content-center rounded-tl-full rounded-tr-full bg-[#FAF7F2]" />
      </section>
    );
  }
);

StickyScrollGallery.displayName = 'StickyScrollGallery';

export default StickyScrollGallery;
