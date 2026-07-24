"use client";

import React, { useEffect, useRef, useState, type FC } from "react";

// reveal-images.tsx
// Liste de services : au survol d'un libellé, deux visuels se révèlent (empilés)
// en haut à droite. Adapté pour ce projet : `cn` → helper `cx`, tokens shadcn
// (foreground / background / muted) → couleurs concrètes.
// Visuels tirés des dossiers correspondant à chaque service.

const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

// Visuels locaux par catégorie de service (chargés par Vite).
const BRANDING_MODULES = import.meta.glob(
  "../../Apperçu/Branding/*.{png,jpg,jpeg,webp}",
  { eager: true, import: "default" },
);
const SOCIAL_MODULES = import.meta.glob(
  "../../Apperçu/Social Media/*.{png,jpg,jpeg,webp}",
  { eager: true, import: "default" },
);
const WEB_MODULES = import.meta.glob("../../créa/*-site.png", {
  eager: true,
  import: "default",
});

// Renvoie les visuels d'un dossier, triés, éventuellement filtrés par sous-chaîne.
const pick = (
  modules: Record<string, unknown>,
  filter?: string,
): string[] => {
  let keys = Object.keys(modules).sort();
  if (filter) {
    const matched = keys.filter((k) => k.toLowerCase().includes(filter));
    if (matched.length) keys = matched;
  }
  return keys.map((k) => modules[k] as string);
};

const BRANDING_IMAGES = pick(BRANDING_MODULES, "branding_");
const WEB_IMAGES = pick(WEB_MODULES);
const SOCIAL_IMAGES = pick(SOCIAL_MODULES);

// Deux visuels (tuple) à partir d'une liste, avec repli si trop courte.
const pair = (images: string[]): [ImageSource, ImageSource] => {
  const a = images[0] ?? "";
  const b = images[1] ?? images[0] ?? "";
  return [
    { src: a, alt: "" },
    { src: b, alt: "" },
  ];
};

interface ImageSource {
  src: string;
  alt: string;
}

interface ShowImageListItemProps {
  text: string;
  images: [ImageSource, ImageSource];
}

interface RevealItemProps extends ShowImageListItemProps {
  open: boolean;
  onToggle: () => void;
  /** true = appareil tactile (téléphone/tablette) : la catégorie devient cliquable. */
  interactive: boolean;
}

const RevealImageListItem: FC<RevealItemProps> = ({ text, images, open, onToggle, interactive }) => {
  // PC : effet au SURVOL uniquement (pas de clic).
  // Téléphone/tablette (interactive) : même effet déclenché au CLIC via l'état
  // `open` (miroir du hover grâce à la variante `group-data-[open=true]`).
  const container = "absolute right-8 -top-1 z-40 h-20 w-16";
  const effect =
    "relative duration-500 delay-100 shadow-none group-hover:shadow-xl group-data-[open=true]:shadow-xl scale-0 group-hover:scale-100 group-data-[open=true]:scale-100 opacity-0 group-hover:opacity-100 group-data-[open=true]:opacity-100 group-hover:w-full group-hover:h-full group-data-[open=true]:w-full group-data-[open=true]:h-full w-16 h-16 overflow-hidden transition-all rounded-md";

  const interactiveProps = interactive
    ? {
        role: "button" as const,
        tabIndex: 0,
        onClick: onToggle,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        },
      }
    : {};

  return (
    <div
      data-open={open}
      {...interactiveProps}
      className={cx(
        "group relative h-fit w-fit select-none overflow-visible py-1 md:py-1.5",
        interactive && "cursor-pointer",
      )}
    >
      <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white transition-all duration-500 group-hover:opacity-40 group-data-[open=true]:opacity-40">
        {text}
      </h1>
      <div className={container}>
        <div className={effect}>
          <img
            alt={images[1].alt}
            src={images[1].src}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <div
        className={cx(
          container,
          "translate-x-0 translate-y-0 rotate-0 transition-all delay-150 duration-500 group-hover:translate-x-6 group-hover:translate-y-6 group-hover:rotate-12 group-data-[open=true]:translate-x-6 group-data-[open=true]:translate-y-6 group-data-[open=true]:rotate-12",
        )}
      >
        <div className={cx(effect, "duration-200")}>
          <img
            alt={images[0].alt}
            src={images[0].src}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

// Services présentés (2 visuels chacun).
const SERVICES: ShowImageListItemProps[] = [
  { text: "Branding", images: pair(BRANDING_IMAGES) },
  { text: "Web design", images: pair(WEB_IMAGES) },
  { text: "Social media", images: pair(SOCIAL_IMAGES) },
];

function RevealImageList() {
  // Index de la catégorie ouverte (une seule à la fois). null = aucune.
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Nettoyage du minuteur au démontage.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Clic actif sur TOUS les appareils (PC inclus), en plus du survol.
  const handleToggle = (index: number) => {
    setOpenIndex((current) => {
      const next = current === index ? null : index;
      if (timerRef.current) clearTimeout(timerRef.current);
      // L'effet s'annule automatiquement 3 s après le clic d'ouverture.
      if (next !== null) {
        timerRef.current = setTimeout(() => setOpenIndex(null), 3000);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-0 px-2">
      {SERVICES.map((item, index) => (
        <RevealImageListItem
          key={index}
          text={item.text}
          images={item.images}
          interactive
          open={openIndex === index}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
}

export { RevealImageList };
