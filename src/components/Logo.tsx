import logoMask from '../créa/sperok-mask.png';

// Logo « spérok » persistant (accueil + page À propos).
// Même effet que sur la page Réalisations : remplissage blanc + mix-blend-mode
// « difference » → le logo s'inverse tout seul selon le fond (sombre → blanc,
// clair → noir), sans détection de section au scroll.
export default function Logo() {
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
        backgroundColor: '#ffffff',
        mixBlendMode: 'difference',
        WebkitMaskImage: `url(${logoMask})`,
        maskImage: `url(${logoMask})`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskPosition: 'left center',
        maskPosition: 'left center',
      }}
    />
  );
}
