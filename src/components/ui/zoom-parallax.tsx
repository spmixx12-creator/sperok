'use client';

// zoom-parallax.tsx
// Effet « zoom parallax » (DavidHDev / 21st.dev), adapté à `motion/react` et
// étendu pour gérer un NOMBRE QUELCONQUE d'images :
// - on retrouve la disposition d'origine (1 image centrale + 6 satellites qui
//   filent vers l'extérieur au scroll),
// - si les images dépassent ce que l'écran affiche d'un coup, les suivantes
//   apparaissent au fil du scroll et filent de la même façon, par vagues,
// - à la fin, l'image centrale occupe toute la surface → catégorie suivante.
import { useScroll, useTransform, motion, type MotionValue } from 'motion/react';
import { useRef, type CSSProperties, type FC } from 'react';

interface Image {
  src: string;
  alt?: string;
}

interface ZoomParallaxProps {
  /** Tableau d'images (autant que voulu). */
  images: Image[];
  /** Appelé au clic sur une image (pour l'agrandir en plein écran). */
  onImageClick?: (image: Image) => void;
}

// Position + taille (relatives au centre de l'écran) de chaque emplacement,
// reprises de l'effet d'origine. Index 0 = centre (image qui remplit à la fin).
interface Slot {
  top: string;
  left: string;
  width: string;
  height: string;
  scaleTo: number;
}

const CENTER: Slot = { top: '0vh', left: '0vw', width: '25vw', height: '25vh', scaleTo: 4.4 };

const SATELLITES: Slot[] = [
  { top: '-30vh', left: '5vw', width: '35vw', height: '30vh', scaleTo: 5 },
  { top: '-10vh', left: '-25vw', width: '20vw', height: '45vh', scaleTo: 6 },
  { top: '0vh', left: '27.5vw', width: '25vw', height: '25vh', scaleTo: 5 },
  { top: '27.5vh', left: '5vw', width: '20vw', height: '25vh', scaleTo: 6 },
  { top: '27.5vh', left: '-22.5vw', width: '30vw', height: '25vh', scaleTo: 8 },
  { top: '22.5vh', left: '25vw', width: '15vw', height: '15vh', scaleTo: 9 },
];

const STREAM_END = 0.82; // les satellites finissent de défiler avant la fin

interface TileProps {
  progress: MotionValue<number>;
  image: Image;
  slot: Slot;
  isCenter: boolean;
  start: number; // progression d'apparition (0 = visible dès le départ)
  end: number; // progression de fin de zoom
  startVisible: boolean; // visible immédiatement (1re vague)
  onClick?: (image: Image) => void;
}

const Tile: FC<TileProps> = ({ progress, image, slot, isCenter, start, end, startVisible, onClick }) => {
  // L'image centrale grossit surtout en fin de course pour « remplir » à la fin.
  const scale = useTransform(
    progress,
    isCenter ? [0, 0.6, 1] : [start, end],
    isCenter ? [1, 1.7, slot.scaleTo] : [1, slot.scaleTo],
  );

  // Opacité : les satellites montent en fondu RAPIDE (≈12 % de leur vie) dès le
  // début de leur créneau → la vague suivante devient vite visible en arrière-
  // plan, pendant que la précédente finit de sortir. Disparition tardive pour
  // rester visible/cliquable le plus longtemps possible.
  const span = Math.max(end - start, 0.0001);
  const up = Math.min(start + span * 0.12, end - 0.002);
  const down = Math.min(Math.max(up + 0.002, end - span * 0.1), end - 0.001);
  const opacity = useTransform(
    progress,
    isCenter ? [0, 1] : [start, up, down, end],
    isCenter ? [1, 1] : startVisible ? [1, 1, 1, 0] : [0, 1, 1, 0],
  );

  // Z-index piloté par l'opacité : l'image la plus visible passe AUTOMATIQUEMENT
  // au premier plan (donc cliquable), et celle qui s'efface repasse derrière.
  // L'image centrale reste en fond (0).
  const zIndex = useTransform(opacity, (o) => (isCenter ? 0 : 1 + Math.round(o * 1000)));

  // Une image capte les clics dès qu'elle est suffisamment visible.
  const pointerEvents = useTransform(opacity, (o) =>
    onClick && o > 0.2 ? 'auto' : 'none',
  );

  const innerStyle: CSSProperties = {
    position: 'relative',
    top: slot.top,
    left: slot.left,
    width: slot.width,
    height: slot.height,
  };

  return (
    <motion.div
      style={{ scale, opacity, zIndex }}
      // Le conteneur plein écran ne capte rien ; seul le cadre image le fait.
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <motion.div style={{ ...innerStyle, pointerEvents }}>
        {/\.mp4($|\?)/i.test(image.src) ? (
          <video
            src={image.src}
            autoPlay
            muted
            loop
            playsInline
            onClick={onClick ? () => onClick(image) : undefined}
            className={`h-full w-full rounded-md object-contain ${onClick ? 'cursor-pointer' : ''}`}
          />
        ) : (
          <img
            src={image.src}
            alt={image.alt || 'Réalisation'}
            onClick={onClick ? () => onClick(image) : undefined}
            className={`h-full w-full rounded-md object-contain ${onClick ? 'cursor-pointer' : ''}`}
            draggable={false}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export function ZoomParallax({ images, onImageClick }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  const list = images.length ? images : [{ src: '' }];
  const center = list[0];
  const satellites = list.slice(1);

  // Les satellites défilent par vagues de 6 (les 6 emplacements d'origine).
  const numBatches = Math.max(1, Math.ceil(satellites.length / SATELLITES.length));
  const batchDur = STREAM_END / numBatches;

  // Plus il y a de vagues, plus la section est longue à scroller.
  const heightVh = 150 + numBatches * 150;

  const tiles = satellites.map((image, i) => {
    const slotIndex = i % SATELLITES.length;
    const batch = Math.floor(i / SATELLITES.length);
    const start = batch * batchDur;
    // Les vagues vivent plus longtemps (×2.1) → forte zone de recouvrement : la
    // vague suivante apparaît bien avant que la précédente n'ait disparu.
    const end = Math.min(start + batchDur * 2.1, 0.99);
    return {
      image,
      slot: SATELLITES[slotIndex],
      start,
      end,
      startVisible: batch === 0, // la 1re vague est visible dès le départ
    };
  });

  return (
    <div ref={container} className="relative" style={{ height: `${heightVh}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Image centrale (remplit l'écran en fin de scroll) */}
        <Tile
          progress={scrollYProgress}
          image={center}
          slot={CENTER}
          isCenter
          start={0}
          end={1}
          startVisible
          onClick={onImageClick}
        />
        {/* Satellites qui filent vers l'extérieur, par vagues successives */}
        {tiles.map((t, i) => (
          <Tile
            key={i}
            progress={scrollYProgress}
            image={t.image}
            slot={t.slot}
            isCenter={false}
            start={t.start}
            end={t.end}
            startVisible={t.startVisible}
            onClick={onImageClick}
          />
        ))}
      </div>
    </div>
  );
}

export default ZoomParallax;
