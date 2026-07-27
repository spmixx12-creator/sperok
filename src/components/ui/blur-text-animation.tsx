"use client";

// blur-text-animation.tsx
// Texte révélé progressivement (flou → net), mot par mot, par-dessus un fond
// animé en continu (blobs de dégradé ambre dérivants + grille). Autonome.
import type { CSSProperties, FC, ReactNode } from "react";
import { motion } from "motion/react";

interface BlurTextAnimationProps {
  /** Texte affiché ; chaque mot est animé séparément. */
  text?: string;
  /** Petit libellé mono au-dessus du titre. */
  eyebrow?: string;
  /** Phrase secondaire sous le titre. */
  subtitle?: string;
  className?: string;
  /** Mot du titre à styliser différemment (insensible à la casse/ponctuation). */
  accentWord?: string;
  /** Style appliqué au mot accentué (ex. police différente). */
  accentStyle?: CSSProperties;
  /** Suite de mots (contiguë) du titre à surligner en bloc (surligneur ambre). */
  highlightPhrase?: string;
}

/**
 * Surligneur ambre appliqué à un bloc de mots (comme « j'suis Spéro KOUTON »).
 * Une barre ambre balaie le texte de gauche à droite en `whileInView`, juste
 * après l'entrée floutée.
 */
const HighlightBlock: FC<{ children: ReactNode; delay: number }> = ({
  children,
  delay,
}) => {
  return (
    <motion.span
      initial={{ opacity: 0, filter: "blur(14px)", y: 16 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay, duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
      className="relative mr-[0.25em] inline-block"
    >
      {/* Barre ambre en ARRIÈRE-PLAN (z-0), qui balaie de gauche à droite. */}
      <motion.span
        initial={{ width: "0%" }}
        whileInView={{ width: "calc(100% + 0.5em)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ delay: delay + 0.45, duration: 1.0, ease: [0.25, 1, 0.5, 1] }}
        className="absolute left-[-0.25em] top-[-0.08em] bottom-[-0.2em] z-0 bg-amber-400"
        aria-hidden
      />
      {/* Texte au PREMIER PLAN (z-10), toujours lisible par-dessus l'ambre. */}
      <span className="relative z-10 text-neutral-900">{children}</span>
    </motion.span>
  );
};

export function Component({
  text = "Le design en mouvement, l'émotion en action.",
  eyebrow = "EXPERTISE // EN MOUVEMENT",
  subtitle = "Une seule obsession : transformer une idée en expérience vivante.",
  className,
  accentWord,
  accentStyle,
  highlightPhrase,
}: BlurTextAnimationProps) {
  const normalize = (w: string) =>
    w.replace(/[.,;:!?'’«»()]/g, "").toLowerCase();
  const phraseTokens = highlightPhrase ? highlightPhrase.split(" ") : [];
  // Le texte peut contenir des « \n » pour forcer des sauts de ligne :
  // chaque ligne est rendue dans son propre bloc, tout en conservant
  // l'animation (et la cascade de délais) mot par mot.
  const lines = text.split("\n");
  const wordCount = lines.reduce(
    (n, line) => n + line.trim().split(/\s+/).filter(Boolean).length,
    0,
  );
  let wordIndex = 0;

  return (
    <div
      className={[
        "relative flex w-full flex-col items-center justify-center overflow-hidden px-6 pt-1 pb-20 md:pt-4 md:pb-24",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ── Contenu ────────────────────────────────────────────── */}
      <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, filter: "blur(8px)", y: 8 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
            className="mb-5 md:mb-8 inline-block rounded border border-amber-200/30 bg-amber-50 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-amber-600"
          >
            {eyebrow}
          </motion.span>
        )}

        {/* Taille fluide : chaque ligne est en `whitespace-nowrap`, la police
            s'ajuste pour que la plus longue tienne → toujours exactement 2 lignes. */}
        <h2 className="font-display text-[clamp(1.5rem,5.2vw,4.25rem)] font-black leading-[0.92] tracking-tight text-neutral-900">
          {lines.map((line, li) => {
            const words = line.split(" ");
            const nodes: ReactNode[] = [];
            for (let k = 0; k < words.length; k++) {
              // Suite de mots correspondant à la phrase surlignée ? → un seul bloc.
              const matchesPhrase =
                phraseTokens.length > 0 &&
                k + phraseTokens.length <= words.length &&
                phraseTokens.every((t, j) => words[k + j] === t);
              if (matchesPhrase) {
                const startIndex = wordIndex;
                wordIndex += phraseTokens.length;
                nodes.push(
                  <HighlightBlock
                    key={`hl-${startIndex}`}
                    delay={0.15 + startIndex * 0.12}
                  >
                    {phraseTokens.join(" ")}
                  </HighlightBlock>,
                );
                k += phraseTokens.length - 1;
                continue;
              }
              const word = words[k];
              const i = wordIndex++;
              const isAccent =
                !!accentWord && normalize(word) === normalize(accentWord);
              nodes.push(
                <motion.span
                  key={`${word}-${i}`}
                  initial={{ opacity: 0, filter: "blur(14px)", y: 16 }}
                  whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    delay: 0.15 + i * 0.12,
                    duration: 0.85,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                  style={isAccent ? accentStyle : undefined}
                  className={`mr-[0.25em] inline-block${
                    isAccent ? " relative z-10" : ""
                  }`}
                >
                  {word}
                </motion.span>,
              );
            }
            return (
              <span key={li} className="block whitespace-nowrap">
                {nodes}
              </span>
            );
          })}
        </h2>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.15 + wordCount * 0.12 + 0.2, duration: 0.9 }}
            className="mt-10 max-w-md font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500 md:text-[11px]"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}

export default Component;
