"use client";

// floating-action-menu.tsx
// Bouton de navigation flottant (chetanverma16 / 21st.dev), recréé pour ce projet :
// - `motion/react` (pas framer-motion),
// - pas de `cn`/Button shadcn → helper `cx` + bouton natif,
// - palette du site (ambre / crème).
import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";

const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

interface FloatingActionMenuOption {
  /** Libellé. Laisser vide pour un bouton à icône seule. */
  label?: string;
  onClick: () => void;
  Icon?: ReactNode;
}

interface FloatingActionMenuProps {
  options: FloatingActionMenuOption[];
  className?: string;
  /** Ancrage vertical du bouton : "bottom" (défaut) ou "top" (haut à droite). */
  position?: "bottom" | "top";
  /** z-index du bouton (le flou passe juste en dessous). Défaut 50. */
  baseZ?: number;
}

export default function FloatingActionMenu({
  options,
  className,
  position = "bottom",
  baseZ = 50,
}: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isTop = position === "top";

  return (
    <>
      {/* Calque de flou (blur) étalé sur tout le site lors de l'ouverture du menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsOpen(false)}
            style={{ zIndex: baseZ - 10 }}
            className="fixed inset-0 bg-neutral-950/40 backdrop-blur-md cursor-pointer"
          />
        )}
      </AnimatePresence>

      <div
        className={cx("fixed right-8", className)}
        style={{
          zIndex: baseZ,
          top: isTop ? "1.5rem" : "calc(100dvh - 5rem)",
          transition: "top 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Navigation"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-300 bg-amber-400 text-neutral-900 shadow-2xl shadow-black/20 transition-colors hover:bg-amber-300 cursor-pointer"
        >
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Plus className="h-6 w-6" />
          </motion.span>
        </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10, y: isTop ? -10 : 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 10, y: isTop ? -10 : 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={cx(
              "absolute right-0 flex max-h-[70vh] flex-col items-end gap-2 overflow-y-auto overflow-x-hidden pr-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              isTop ? "top-16" : "bottom-16",
            )}
          >
            {options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <button
                  onClick={() => {
                    setIsOpen(false);
                    option.onClick();
                  }}
                  className={cx(
                    "group flex items-center gap-2 whitespace-nowrap rounded-xl border border-neutral-200 bg-[#FAF7F2]/95 font-display text-sm font-semibold text-neutral-800 shadow-lg backdrop-blur-md transition-colors hover:border-amber-300 hover:bg-amber-400 hover:text-neutral-900 cursor-pointer",
                    option.label ? "w-full px-4 py-2.5" : "h-10 w-10 justify-center p-0",
                  )}
                  aria-label={option.label}
                >
                  {option.Icon}
                  {option.label && <span>{option.label}</span>}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </>
  );
}
