"use client";

// new-button.tsx
// Bouton animé (ripple au clic + ressort à l'appui + léger lift au survol),
// recréé pour ce projet : sans `@base-ui/react` ni `cva` (tokens shadcn absents
// ici), `cn` → helper local `cx`, couleurs de la charte (ambre #F5B419).
import { motion } from "motion/react";
import {
  forwardRef,
  useCallback,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

type Variant = "default" | "outline" | "ghost";
type Ripple = { id: number; x: number; y: number; size: number };

const VARIANTS: Record<Variant, string> = {
  default: "bg-[#F5B419] text-[#191514] hover:bg-[#F5B419]/90 shadow-sm shadow-[#F5B419]/25",
  outline: "border border-[#F5B419]/50 text-[#F5B419] hover:bg-[#F5B419]/10",
  ghost: "text-[#F5B419] hover:bg-[#F5B419]/10",
};

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "ref"> {
  variant?: Variant;
  icon?: ReactNode;
  disableRipple?: boolean;
  children?: ReactNode;
}

let rippleId = 0;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "default", icon, disableRipple = false, className, children, onPointerDown, ...props },
  ref
) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);
      if (disableRipple || e.button !== 0) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size =
        2 *
        Math.max(
          Math.hypot(x, y),
          Math.hypot(rect.width - x, y),
          Math.hypot(x, rect.height - y),
          Math.hypot(rect.width - x, rect.height - y)
        );
      const id = ++rippleId;
      setRipples((c) => [...c, { id, x, y, size }]);
    },
    [disableRipple, onPointerDown]
  );

  return (
    <motion.button
      ref={ref}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.9 }}
      onPointerDown={handlePointerDown}
      className={cx(
        "relative inline-flex cursor-pointer select-none items-center justify-center gap-2 overflow-hidden rounded-lg px-3.5 py-1.5 font-display text-sm font-bold leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B419]/60 disabled:pointer-events-none disabled:opacity-50",
        VARIANTS[variant],
        className
      )}
      {...(props as Record<string, unknown>)}
    >
      {/* Couche de ripple */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
      >
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            initial={{ opacity: 0.25, scale: 0 }}
            animate={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() =>
              setRipples((c) => c.filter((i) => i.id !== r.id))
            }
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
            style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
          />
        ))}
      </span>

      <span className="relative z-10 inline-flex items-center gap-2 [&_svg]:size-4 [&_svg]:shrink-0">
        {icon}
        {children}
      </span>
    </motion.button>
  );
});

Button.displayName = "Button";

export { Button };
export default Button;
