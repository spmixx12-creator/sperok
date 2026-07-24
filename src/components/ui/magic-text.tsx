import {
  useRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type FC,
  type ReactNode,
} from "react";
import { motion, MotionValue, useScroll, useTransform } from "motion/react";

export interface MagicTextProps extends ComponentPropsWithoutRef<"div"> {
  text: string;
}

/** Construit un tracé sinueux vertical (viewBox 0 0 180 1000).
 *  `reverse` = tracé construit depuis le BAS (le dessin au scroll part du bas). */
const wavePath = (cx: number, amp: number, periods: number, reverse = false) => {
  const pts: [number, number][] = [];
  for (let y = 0; y <= 1000; y += 5) {
    const x = cx + amp * Math.sin((y / 1000) * Math.PI * 2 * periods);
    pts.push([x, y]);
  }
  if (reverse) pts.reverse();
  return pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y}`)
    .join(" ");
};

const LINES = [
  // Gauche : se trace depuis le HAUT. Droite : se trace depuis le BAS.
  { key: "left", side: "left-[3%]", d: wavePath(90, 62, 3.2), color: "#feb804" },
  { key: "right", side: "right-[3%]", d: wavePath(90, 72, 2.6, true), color: "#feb804" },
];

/** Deux lignes sinueuses, de part et d'autre du texte, qui se tracent et ondulent
 *  au fil du scroll (remplace l'ancien décor 3D). Desktop uniquement. */
const ManifestoShapes: FC<{ progress: MotionValue<number> }> = ({ progress }) => {
  const pathLength = useTransform(progress, [0, 1], [0, 1]);
  return (
    <div className="pointer-events-none absolute inset-0 z-0 hidden lg:block" aria-hidden>
      {LINES.map((l) => (
        <svg
          key={l.key}
          className={`absolute top-0 ${l.side} h-full w-[180px] overflow-visible`}
          viewBox="0 0 180 1000"
          preserveAspectRatio="none"
        >
          <motion.path
            d={l.d}
            fill="none"
            stroke={l.color}
            strokeWidth={2.5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength, opacity: 0.6 }}
          />
        </svg>
      ))}
    </div>
  );
};

export const MagicText: FC<MagicTextProps> = ({ text, className }) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const words = text.split(" ");

  // Detect quote words: between « and »
  let insideQuote = false;
  const wordMetas = words.map((word) => {
    if (word.includes("«")) { insideQuote = true;  return { word, isQuote: true }; }
    if (word.includes("»")) { const was = insideQuote; insideQuote = false; return { word, isQuote: was }; }
    return { word, isQuote: insideQuote };
  });

  const total = wordMetas.length;

  // Encircle the punchline "show me." inside the citation with a hand-drawn circle.
  // Range = [first word "show", last word before the closing « » guillemet].
  const encircleStart = wordMetas.findIndex((m) => m.word.toLowerCase() === "show");
  const closeIdx = wordMetas.findIndex((m) => m.word.includes("»"));
  const encircleEnd = closeIdx === -1 ? -1 : closeIdx - 1;
  const hasEncircle =
    encircleStart !== -1 && encircleEnd !== -1 && encircleStart <= encircleEnd;

  // Mot « design » : reçoit le surligneur ambre (comme « j'suis Spéro KOUTON »)
  // au moment de sa révélation au scroll.
  const designIdx = wordMetas.findIndex(
    (m) => m.word.replace(/[.…]+$/g, "").toLowerCase() === "design",
  );

  // Mots « la Beauté » : rendus dans la police cursive de « j'suis Spéro KOUTON ».
  const beauteIdx = wordMetas.findIndex(
    (m) => m.word.replace(/[.,…»«]+$/g, "").toLowerCase() === "beauté",
  );
  const laIdx =
    beauteIdx > 0 && wordMetas[beauteIdx - 1].word.toLowerCase() === "la"
      ? beauteIdx - 1
      : -1;
  const isCursive = (i: number) => i === beauteIdx || i === laIdx;

  const windowSize = 0.82 / total;
  const renderWord = (i: number) => {
    const start = i * windowSize;
    const end = Math.min(start + windowSize * 3.5, 0.86);
    return (
      <Word
        key={i}
        progress={scrollYProgress}
        revealRange={[start, end]}
        isQuote={wordMetas[i].isQuote}
        cursive={isCursive(i)}
      >
        {wordMetas[i].word}
      </Word>
    );
  };

  // Build the inline flow, grouping the encircled words inside a single <Encircle>.
  const content: ReactNode[] = [];
  for (let i = 0; i < total; i++) {
    if (hasEncircle && i > encircleStart && i <= encircleEnd) continue; // rendered in the group
    if (i === designIdx) {
      const start = i * windowSize;
      const end = Math.min(start + windowSize * 3.5, 0.86);
      // Mot entier « design... » surligné en un seul bloc (ponctuation incluse).
      content.push(
        <HighlightWord
          key={`highlight-${i}`}
          progress={scrollYProgress}
          revealRange={[start, end]}
        >
          {wordMetas[i].word}
        </HighlightWord>,
      );
      continue;
    }
    if (hasEncircle && i === encircleStart) {
      const group: ReactNode[] = [];
      for (let j = encircleStart; j <= encircleEnd; j++) group.push(renderWord(j));
      content.push(
        <Encircle key={`encircle-${i}`} progress={scrollYProgress} range={[0.8, 0.99]}>
          {group}
        </Encircle>
      );
    } else {
      content.push(renderWord(i));
    }
  }

  // All words spread continuously from 0 → 0.85 of scroll progress.
  // Each word's reveal window has generous overlap (×3) for a smooth cascade.
  // The last 15% of scroll (0.85 → 1.0) is reserved for the closing dim on the citation.

  return (
    <div
      ref={sectionRef}
      className={["relative z-0 h-[300vh] w-full", className].filter(Boolean).join(" ")}
    >
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
        {/* Décor 3D de part et d'autre, qui défile vers le haut au fil du scroll */}
        <ManifestoShapes progress={scrollYProgress} />

        {/* Texte du manifeste */}
        <div className="relative z-10 mx-auto flex h-full max-w-4xl items-center px-4 py-20 md:px-8">
          <span className="flex flex-wrap p-5 font-display text-2xl font-black leading-snug tracking-tight text-neutral-900/15 md:p-8 md:text-3xl lg:p-10 lg:text-4xl xl:text-5xl">
            {content}
          </span>
        </div>
      </div>
    </div>
  );
};

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  revealRange: [number, number];
  isQuote?: boolean;
  cursive?: boolean;
}

const Word: FC<WordProps> = ({ children, progress, revealRange, isQuote, cursive }) => {
  // Single custom transform that handles both reveal AND closing dim for the citation.
  const opacity = useTransform(progress, (p: number) => {
    const [start, end] = revealRange;

    // 1. Reveal phase: linearly ramp from 0 → 1 within [start, end]
    const reveal = Math.min(Math.max((p - start) / Math.max(end - start, 0.001), 0), 1);

    if (!isQuote) return reveal;

    // 2. Closing dim for citation only: after 86% scroll, smoothly dim to ~60%
    //    giving a cinematic "curtain close" effect on the citation.
    const DIM_START = 0.86;
    const DIM_END = 1.0;
    if (p <= DIM_START) return reveal;
    const dimProgress = (p - DIM_START) / (DIM_END - DIM_START);
    const dim = 1 - dimProgress * 0.40; // dims down to 60% brightness max
    return reveal * dim;
  });

  if (cursive) {
    // Même police que « j'suis Spéro KOUTON » (cursive ambre).
    return (
      <span
        className="relative mx-1 lg:mx-2"
        style={{
          fontFamily: "Identic Partner Script, cursive",
          fontSize: "1em",
          lineHeight: "inherit",
          verticalAlign: "baseline",
          top: "0.12em", // descend légèrement les mots (sans casser l'interligne)
        }}
      >
        <span style={{ color: "rgba(26,26,26,0.3)" }}>{children}</span>
        <motion.span
          style={{ opacity, color: "#1a1a1a" }}
          className="absolute inset-0"
          aria-hidden
        >
          {children}
        </motion.span>
      </span>
    );
  }

  if (isQuote) {
    return (
      <span
        className="relative mx-1 lg:mx-2 italic"
        style={{ fontSize: "1.18em" }}
      >
        {/* Ghost layer — dark neutral so it's always readable on cream background */}
        <span className="font-black text-neutral-900/30">
          {children}
        </span>
        {/* Reveal layer — bright amber, includes the closing dim */}
        <motion.span
          style={{ opacity }}
          className="absolute inset-0 font-black text-amber-500 drop-shadow-[0_0_16px_rgba(251,191,36,0.5)]"
          aria-hidden
        >
          {children}
        </motion.span>
      </span>
    );
  }

  return (
    <span className="relative mx-1 lg:mx-1.5">
      <span className="text-neutral-900/30">{children}</span>
      <motion.span
        style={{ opacity }}
        className="absolute inset-0 text-neutral-900"
        aria-hidden
      >
        {children}
      </motion.span>
    </span>
  );
};

interface EncircleProps {
  children: ReactNode;
  progress: MotionValue<number>;
  /** Scroll range [start, end] over which the circle is drawn. */
  range: [number, number];
}

/**
 * Wraps inline words and draws a hand-written circle around them.
 * Reuses the encirclement effect from <HandWrittenTitle /> (hand-writing-text.tsx),
 * but the stroke is drawn progressively from the parent scroll progress.
 */
const Encircle: FC<EncircleProps> = ({ children, progress, range }) => {
  const pathLength = useTransform(progress, range, [0, 1]);
  // Fade the stroke in just as it starts being drawn.
  const opacity = useTransform(
    progress,
    [range[0], range[0] + 0.02, range[1]],
    [0, 1, 1]
  );

  return (
    <span className="relative inline-flex flex-wrap items-baseline">
      <span className="relative z-10">{children}</span>

      {/* Hand-drawn circle, stretched to wrap the words (preserveAspectRatio="none"). */}
      <motion.svg
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        style={{ opacity }}
        className="pointer-events-none absolute left-[-9%] top-[-42%] z-0 h-[185%] w-[118%] overflow-visible text-amber-500 drop-shadow-[0_0_12px_rgba(251,191,36,0.45)]"
        aria-hidden
      >
        <motion.path
          d="M 950 90
             C 1250 300, 1050 480, 600 520
             C 250 520, 150 480, 150 300
             C 150 120, 350 80, 600 80
             C 850 80, 950 180, 950 180"
          fill="none"
          stroke="currentColor"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength }}
        />
      </motion.svg>
    </span>
  );
};

interface HighlightWordProps {
  children: string;
  /** Ponctuation à droite du mot, révélée mais NON surlignée (ex. « ... »). */
  trail?: string;
  progress: MotionValue<number>;
  /** Plage de scroll [start, end] sur laquelle le surligneur balaie le mot. */
  revealRange: [number, number];
}

/**
 * Surligneur ambre (identique à « j'suis Spéro KOUTON » de la section Profil) :
 * une barre ambre balaie le mot de gauche à droite au fil du scroll, révélant
 * un texte sombre par-dessus une base grise. Le `trail` éventuel reste hors
 * du surlignage et se révèle simplement en opacité.
 */
const HighlightWord: FC<HighlightWordProps> = ({
  children,
  trail,
  progress,
  revealRange,
}) => {
  const [start, end] = revealRange;
  const width = useTransform(progress, [start, end], ["0%", "100%"]);
  const trailOpacity = useTransform(progress, (p: number) =>
    Math.min(Math.max((p - start) / Math.max(end - start, 0.001), 0), 1)
  );

  return (
    <span className="relative mx-1 inline-flex items-baseline lg:mx-1.5">
      <span className="relative inline-block">
        {/* Base grise (fantôme) */}
        <span className="text-neutral-900/30">{children}</span>
        {/* Barre ambre qui balaie + texte sombre révélé par-dessus */}
        <motion.span
          style={{ width }}
          className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap bg-amber-400"
          aria-hidden
        >
          <span className="absolute left-0 top-0 bottom-0 flex h-full items-center whitespace-nowrap text-neutral-900">
            {children}
          </span>
        </motion.span>
      </span>
      {trail && (
        <motion.span style={{ opacity: trailOpacity }} className="text-neutral-900">
          {trail}
        </motion.span>
      )}
    </span>
  );
};
