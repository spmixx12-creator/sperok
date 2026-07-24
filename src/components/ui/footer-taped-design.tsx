'use client';

// footer-taped-design.tsx
// Footer « papier scotché » (radu / 21st.dev), recréé pour ce projet :
// - pas de Next.js (next/Image, next/Link) → balises natives,
// - `lucide-react` pour les icônes,
// - contenu & palette adaptés au portfolio de Spérok (ambre / crème).
import type { FC, ReactNode } from 'react';
import { ArrowUpRight, Github, Linkedin, Mail, MapPin, MessageCircle } from 'lucide-react';

// Bande de scotch translucide (coin du papier).
const Tape: FC<{ className?: string }> = ({ className }) => (
  <span
    aria-hidden
    className={`pointer-events-none absolute h-8 w-28 rounded-[2px] bg-amber-200/50 shadow-sm backdrop-blur-[1px] ${className ?? ''}`}
    style={{
      backgroundImage:
        'repeating-linear-gradient(45deg, rgba(255,255,255,.35) 0 6px, rgba(255,255,255,0) 6px 12px)',
      boxShadow: '0 1px 6px rgba(0,0,0,.12)',
    }}
  />
);

interface LinkItem {
  label: string;
  href: string;
  external?: boolean;
  Icon?: ReactNode;
}

const NAV: LinkItem[] = [
  { label: 'Accueil', href: '#hero' },
  { label: 'Aperçus', href: '#apercus' },
  { label: 'À propos', href: '#about' },
  { label: 'Contact', href: '#/contact' },
];

const SOCIAL: LinkItem[] = [
  { label: 'GitHub', href: 'https://github.com', external: true, Icon: <Github className="h-4 w-4" /> },
  { label: 'LinkedIn', href: 'https://linkedin.com', external: true, Icon: <Linkedin className="h-4 w-4" /> },
  { label: 'WhatsApp', href: 'https://wa.me/2290143202240', external: true, Icon: <MessageCircle className="h-4 w-4" /> },
  { label: 'Email', href: 'mailto:koutonsperop@gmail.com', external: true, Icon: <Mail className="h-4 w-4" /> },
];

const LinkRow: FC<{ item: LinkItem }> = ({ item }) => (
  <a
    href={item.href}
    target={item.external ? '_blank' : undefined}
    rel={item.external ? 'noreferrer' : undefined}
    className="group flex items-center gap-2 py-0.5 font-display text-sm text-neutral-600 transition-colors hover:text-neutral-950"
  >
    {item.Icon}
    <span>{item.label}</span>
    <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
  </a>
);

export function Component() {
  return (
    <footer
      id="footer"
      className="relative w-full bg-black px-3 pb-4 pt-3 md:px-6"
    >
      <div className="relative mx-auto w-[96%] max-w-[1600px]">
        {/* Feuille de papier scotchée — compacte (~30% de l'écran) */}
        <div className="relative rounded-[1.5rem] border border-neutral-200 bg-white px-6 py-5 shadow-[0_24px_55px_-35px_rgba(0,0,0,0.35)] md:px-10 md:py-6">
          {/* Scotch aux coins */}
          <Tape className="-top-3 left-8 -rotate-6" />
          <Tape className="-top-3 right-8 rotate-6" />

          {/* Haut : marque + CTA */}
          <div className="flex flex-col gap-3 border-b border-dashed border-neutral-200 pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-amber-600">
                Studio créatif // Bénin
              </span>
              <h2 className="mt-0.5 font-display text-3xl font-black tracking-tight text-neutral-900 md:text-4xl">
                spérok<span className="text-amber-500">.</span>
              </h2>
            </div>

            <a
              href="#/contact"
              className="group inline-flex items-center gap-2.5 self-start rounded-full bg-neutral-900 px-5 py-2.5 font-display text-sm font-semibold text-white transition-colors hover:bg-amber-400 hover:text-neutral-900 md:self-center"
            >
              <span>Désignons ta prochaine identité</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </a>
          </div>

          {/* Colonnes de liens */}
          <div className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-3">
            <div>
              <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-widest text-neutral-400">
                Navigation
              </span>
              {NAV.map((item) => (
                <LinkRow key={item.label} item={item} />
              ))}
            </div>

            <div>
              <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-widest text-neutral-400">
                Réseaux
              </span>
              {SOCIAL.map((item) => (
                <LinkRow key={item.label} item={item} />
              ))}
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-widest text-neutral-400">
                Studio
              </span>
              <p className="flex items-center gap-2 py-0.5 font-display text-sm text-neutral-600">
                <MapPin className="h-4 w-4 text-amber-500" />
                Cotonou, Bénin
              </p>
              <span className="mt-1 inline-flex items-center gap-2 font-mono text-[10px] text-neutral-500">
                <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                Ouvert aux projets
              </span>
            </div>
          </div>

          {/* Bas : copyright */}
          <div className="flex flex-col items-center justify-between gap-2 border-t border-dashed border-neutral-200 pt-3 font-mono text-[9px] uppercase tracking-widest text-neutral-400 md:flex-row">
            <span>© 2026 spérok studio — Tous droits réservés</span>
            <a href="#hero" className="transition-colors hover:text-neutral-900">
              Retour en haut ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Component;
