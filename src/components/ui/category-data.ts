// category-data.ts
// Catégories de création + leurs visuels. Les images proviennent du dossier
// src/Apperçu (chargées par Vite), réparties entre les catégories.

const MODULES = import.meta.glob('../../Apperçu/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
});

const ALL_IMAGES = Object.keys(MODULES)
  .sort()
  .map((key) => MODULES[key] as string);

export interface Category {
  label: string;
  /** Image de couverture (aperçu au survol). */
  cover: string;
  /** Ensemble des visuels de la catégorie. */
  images: string[];
}

// Sélectionne `count` images à partir de `start` (avec bouclage si nécessaire).
function pick(start: number, count: number): string[] {
  if (ALL_IMAGES.length === 0) return [];
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(ALL_IMAGES[(start + i) % ALL_IMAGES.length]);
  }
  return out;
}

function make(label: string, start: number, count = 5): Category {
  const images = pick(start, count);
  return { label, cover: images[0] ?? '', images };
}

export const LEFT_CATEGORIES: Category[] = [
  make('UI / UX Design', 0),
  make('Branding', 2),
  make('Creative Dev', 4),
];

export const RIGHT_CATEGORIES: Category[] = [
  make('Motion Design', 6),
  make('3D / WebGL', 8),
  make('Direction Artistique', 10),
];

export const ALL_CATEGORIES: Category[] = [
  ...LEFT_CATEGORIES,
  ...RIGHT_CATEGORIES,
];

export function getCategory(label: string | null): Category | undefined {
  if (!label) return undefined;
  return ALL_CATEGORIES.find((c) => c.label === label);
}
