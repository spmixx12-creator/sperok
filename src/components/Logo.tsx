import { useEffect, useState } from 'react';
import logoMask from '../créa/sperok-mask.png';

// Thème de fond de chaque section, dans l'ordre vertical de la page.
// true = fond sombre (logo blanc), false = fond clair (logo noir).
const SECTION_THEMES: { id: string; dark: boolean }[] = [
  { id: 'hero', dark: false },
  { id: 'identity', dark: true },
  { id: 'manifesto', dark: false },
  { id: 'showreel', dark: true },
  { id: 'apercus', dark: true },
  { id: 'morph', dark: false },
  { id: 'about', dark: true },
  { id: 'contact', dark: true },
  { id: 'footer', dark: true },
  // Sections de la page À propos
  { id: 'about-hero', dark: false },
  { id: 'about-intro', dark: false },
  { id: 'about-timeline', dark: false },
  { id: 'about-projects', dark: true },
];

export default function Logo() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Point d'échantillonnage = centre vertical du logo (top-5 + ~16px).
    const sampleY = 36;

    const update = () => {
      for (const { id, dark: isDark } of SECTION_THEMES) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= sampleY && rect.bottom > sampleY) {
          setDark(isDark);
          return;
        }
      }
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <a
      href="#hero"
      onClick={(e) => {
        // Retour à la 1re section de la 1re page, SANS rejouer l'intro/chargement.
        e.preventDefault();
        try {
          sessionStorage.setItem('sperok_entered', '1');
        } catch {
          /* noop */
        }
        if (window.location.hash) window.location.hash = '';
        requestAnimationFrame(() => window.scrollTo({ top: 0 }));
      }}
      aria-label="spérok — retour à l'accueil"
      className="fixed top-5 left-6 z-50 block h-7 w-24 md:h-8 md:w-28 cursor-pointer select-none"
      style={{
        backgroundColor: dark ? '#FAF7F2' : '#111111',
        WebkitMaskImage: `url(${logoMask})`,
        maskImage: `url(${logoMask})`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskPosition: 'left center',
        maskPosition: 'left center',
        transition: 'background-color 0.5s ease',
      }}
    />
  );
}
