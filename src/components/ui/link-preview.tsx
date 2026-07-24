"use client";

// link-preview.tsx
// Aperçu au survol ET au clic/tap d'un mot (inspiré d'Aceternity UI), adapté à
// ce projet : `motion/react`, sans navigation (le mot ne renvoie nulle part).
// - PC : survol → bulle ; clic → bascule la bulle.
// - Mobile (pas de survol) : tap → affiche la bulle ; nouveau tap → la masque.
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "motion/react";

const cx = (...classes: (string | false | undefined)[]) =>
  classes.filter(Boolean).join(" ");

type LinkPreviewProps = {
  children: React.ReactNode;
  /** Image affichée dans la bulle (si pas de `content`). */
  imageSrc?: string;
  /** Contenu personnalisé de la bulle (prioritaire sur `imageSrc`). */
  content?: React.ReactNode;
  className?: string;
  width?: number;
  height?: number;
};

export const LinkPreview = ({
  children,
  imageSrc,
  content,
  className,
  width = 220,
  height = 140,
}: LinkPreviewProps) => {
  const [open, setOpen] = React.useState(false);

  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);
  const translateX: MotionValue<number> = useSpring(x, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLSpanElement>) => {
    const targetRect = event.currentTarget.getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2;
    x.set(offsetFromCenter);
  };

  const toggle = () => setOpen((o) => !o);

  return (
    // `open` contrôlé : Radix gère l'ouverture au survol (onOpenChange), et on
    // ajoute le clic/tap pour le tactile.
    <HoverCardPrimitive.Root
      openDelay={50}
      closeDelay={100}
      open={open}
      onOpenChange={setOpen}
    >
      <HoverCardPrimitive.Trigger asChild>
        <span
          role="button"
          tabIndex={0}
          onMouseMove={handleMouseMove}
          onClick={(e) => {
            e.preventDefault();
            toggle();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggle();
            }
          }}
          className={cx("cursor-pointer select-none", className)}
        >
          {children}
        </span>
      </HoverCardPrimitive.Trigger>

      <HoverCardPrimitive.Content
        className="z-50 [transform-origin:var(--radix-hover-card-content-transform-origin)]"
        side="top"
        align="center"
        sideOffset={10}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: "spring", stiffness: 260, damping: 20 },
              }}
              exit={{ opacity: 0, y: 20, scale: 0.6 }}
              className="rounded-xl shadow-xl"
              style={{ x: translateX }}
            >
              {content ? (
                content
              ) : (
                <div
                  className="block rounded-xl border-2 border-transparent bg-white p-1 shadow"
                  style={{ fontSize: 0 }}
                >
                  <img
                    src={imageSrc}
                    width={width}
                    height={height}
                    className="rounded-lg object-cover"
                    alt="aperçu"
                    style={{ width, height }}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Root>
  );
};

export default LinkPreview;
