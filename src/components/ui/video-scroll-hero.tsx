import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface VideoScrollHeroProps {
  /** Path or URL to the video file */
  src?: string;
  /** Poster image shown before video plays */
  poster?: string;
  /** Image/GIF à afficher à la place de la vidéo (prioritaire si défini) */
  image?: string;
  /** Label shown above the video (optional) */
  label?: string;
}

export function VideoScrollHero({
  src = "/assets/background-identity.mp4",
  poster,
  image,
  label = "SHOWREEL_2026",
}: VideoScrollHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mv = mobileVideoRef.current;
    if (mv) {
      mv.muted = true;
      mv.play().catch(() => {});
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Video container: starts at 55vw wide / 50vh tall, grows to 100vw / 100vh
  const width = useTransform(scrollYProgress, [0, 0.85], ["56%", "100%"]);
  const height = useTransform(scrollYProgress, [0, 0.85], ["52vh", "100vh"]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.85], ["20px", "0px"]);

  // Subtle scale on the video itself for a parallax feel
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);

  // Label fades out as video expands
  const labelOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Overlay dims as video opens
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.7], [0.35, 0]);

  return (
    <>
      {/* Version Téléphone & Tablette (< 1024px) : Vidéo en arrière-plan jouée en boucle */}
      <div className="relative z-0 h-[85vh] min-h-[480px] max-h-[850px] w-full flex flex-col items-center justify-center overflow-hidden bg-neutral-950 px-6 text-center select-none lg:hidden">
        {/* Média en fond : image/GIF ou vidéo */}
        {image ? (
          <img
            src={image}
            alt={label}
            className="absolute inset-0 h-full w-full object-cover z-0 opacity-70 scale-105 pointer-events-none"
            draggable={false}
          />
        ) : (
          <video
            ref={mobileVideoRef}
            src={src}
            autoPlay
            loop
            muted
            playsInline
            poster={poster}
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover z-0 opacity-70 scale-105 pointer-events-none"
          />
        )}

        {/* Overlay sombre avec dégradé cinématique */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/45 to-neutral-950/90 z-10 pointer-events-none" />

        {/* Décorateurs d'angles */}
        <span className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-white/30 rounded-tl z-20" />
        <span className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-white/30 rounded-tr z-20" />
        <span className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-white/30 rounded-bl z-20" />
        <span className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-white/30 rounded-br z-20" />

        {/* Contenu superposé */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 max-w-xl mx-auto flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-amber-400 bg-amber-400/15 px-3.5 py-1.5 rounded-full border border-amber-400/30 backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            {label}
          </div>

          <h2 className="mt-5 font-display font-black text-4xl sm:text-6xl tracking-tight text-white uppercase leading-none">
            Showreel
          </h2>
          <p className="mt-3 text-neutral-300 font-display text-xs sm:text-sm tracking-wide max-w-md">
            Aperçu dynamique de mes créations & réalisations visuelles.
          </p>
        </motion.div>

        {/* Indicateur de défilement mobile & tablette */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-white/70 text-xs font-mono"
        >
          <span className="text-[9px] tracking-widest uppercase text-amber-400/90 font-medium">Fais défiler</span>
          <div className="w-5 h-8 rounded-full border-2 border-white/30 flex justify-center pt-1.5 bg-black/20 backdrop-blur-sm">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-2 bg-amber-400 rounded-full"
            />
          </div>
        </motion.div>
      </div>

      {/* Version Desktop (>= 1024px) : Container sticky qui s'agrandit au scroll */}
      <div
        ref={sectionRef}
        className="relative z-0 h-[250vh] w-full bg-neutral-950 hidden lg:block"
      >
        {/* Sticky container — keeps the video centred on screen while we scroll */}
        <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-neutral-950">

          {/* Animated video wrapper */}
          <motion.div
            style={{ width, height, borderRadius }}
            className="relative overflow-hidden"
          >
            {/* Média : image/GIF si fourni, sinon vidéo */}
            {image ? (
              <motion.img
                src={image}
                alt={label}
                style={{ scale: videoScale }}
                className="h-full w-full object-cover origin-center"
                draggable={false}
              />
            ) : (
              <motion.video
                style={{ scale: videoScale }}
                autoPlay
                loop
                muted
                playsInline
                poster={poster}
                className="h-full w-full object-cover origin-center"
              >
                <source src={src} type="video/mp4" />
              </motion.video>
            )}

            {/* Dark overlay that fades away as video expands */}
            <motion.div
              style={{ opacity: overlayOpacity }}
              className="absolute inset-0 bg-neutral-950"
            />

            {/* Label badge */}
            <motion.div
              style={{ opacity: labelOpacity }}
              className="absolute bottom-5 left-5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-white/70 select-none"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {label}
            </motion.div>

            {/* Corner decorators */}
            <span className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-white/30 rounded-tl" />
            <span className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-white/30 rounded-tr" />
            <span className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-white/30 rounded-bl" />
            <span className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-white/30 rounded-br" />
          </motion.div>

          {/* Scroll hint — fades out quickly */}
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 select-none pointer-events-none"
          >
            <span className="font-mono text-[8px] uppercase tracking-widest text-white/40">Scroll</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              className="w-4 h-4 border border-white/20 rounded-full flex items-center justify-center"
            >
              <span className="w-1 h-1 rounded-full bg-white/40" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
