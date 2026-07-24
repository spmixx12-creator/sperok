'use client';

// ContactPage.tsx
// Page de contact « Dites salut » : décor de ciel selon l'heure au Bénin
// (jour clair + nuages / après-midi ambre + rayons de soleil / nuit noire +
// nuages + étoiles) avec globe rotatif. Le thème (texte, champs) s'adapte au
// fond du moment. Formulaire -> envoi WhatsApp pré-rempli. Téléchargement CV.
import { useLayoutEffect, useState } from 'react';
import { ArrowLeft, Mail, MessageCircle, Phone, Download } from 'lucide-react';
import cvFile from '../créa/Beige Noir Moderne Minimaliste CV (5).png';
import { ContactSky, getBeninPeriod, SKY_BG } from './ui/contact-sky';

const EMAIL = 'koutonsperop@gmail.com';
const WHATSAPP = '2290143202240'; // numéro qui reçoit les messages du formulaire

interface ContactPageProps {
  onBack: () => void;
}

export default function ContactPage({ onBack }: ContactPageProps) {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [sujet, setSujet] = useState('');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');

  // Thème selon l'heure au Bénin.
  const period = getBeninPeriod();
  const isDark = period === 'night';
  const accent = period === 'afternoon' ? '#191514' : '#F5B419';
  const accentText = period === 'afternoon' ? '#ffffff' : '#191514';
  const highlight = period === 'afternoon' ? '#ffffff' : '#F5B419';
  const textMain = isDark ? 'text-white' : 'text-neutral-900';
  const textMuted = isDark ? 'text-white/60' : 'text-neutral-700';
  const textLabel = isDark ? 'text-white/40' : 'text-neutral-500';
  const chip = isDark ? 'border-white/15 bg-white/5' : 'border-black/10 bg-black/5';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      '✨ Nouveau message — Portfolio',
      `Nom : ${nom}`,
      `Email : ${email}`,
      sujet ? `Sujet : ${sujet}` : null,
      budget ? `Budget : ${budget}` : null,
      '',
      message,
    ]
      .filter((l) => l !== null)
      .join('\n');
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines)}`, '_blank');
  };

  const field = `w-full rounded-xl border px-4 py-3 font-sans text-sm outline-none transition-colors ${
    isDark
      ? 'border-white/15 bg-white/[0.05] text-white placeholder:text-white/40 focus:border-[#F5B419]/70 focus:bg-white/[0.08]'
      : 'border-black/15 bg-white/55 text-neutral-900 placeholder:text-neutral-500 focus:border-neutral-800/70 focus:bg-white/80'
  }`;

  return (
    <div
      className={`relative min-h-screen w-full overflow-x-hidden font-sans selection:bg-[#F5B419] selection:text-neutral-900 ${textMain}`}
      style={{ backgroundColor: SKY_BG[period] }}
    >
      {/* Décor : ciel du moment (Bénin) + globe */}
      <ContactSky period={period} />

      {/* Retour */}
      <button
        onClick={onBack}
        className={`group fixed top-5 left-6 z-50 flex cursor-pointer items-center gap-2.5 rounded-full border px-4 py-2.5 font-display text-sm font-semibold backdrop-blur-md transition-colors ${
          isDark
            ? 'border-white/15 bg-white/10 text-white hover:bg-white hover:text-neutral-900'
            : 'border-black/15 bg-black/5 text-neutral-900 hover:bg-neutral-900 hover:text-white'
        }`}
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Retour</span>
      </button>

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-28 lg:grid-cols-2 lg:gap-16 lg:px-12">
        {/* Colonne gauche : accroche + coordonnées */}
        <div className="flex flex-col">
          <span
            className="inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: accent, borderColor: `${accent}55`, backgroundColor: `${accent}1a` }}
          >
            <span className="h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: accent }} />
            Disponible pour vos projets
          </span>

          <h1 className="mt-6 font-display text-6xl font-black uppercase leading-[0.9] tracking-tight md:text-8xl">
            Dites <span style={{ color: highlight }}>salut.</span>
          </h1>

          <p className={`mt-6 max-w-md text-base leading-relaxed ${textMuted}`}>
            Vous avez une idée, un projet ou juste envie de discuter design ?
            Je suis à un message de distance.
          </p>

          <div className="mt-10 flex flex-col gap-5">
            <a href={`mailto:${EMAIL}`} className="group flex items-center gap-4">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${chip}`}>
                <Mail className="h-4 w-4" style={{ color: accent }} />
              </span>
              <span className="min-w-0">
                <span className={`block font-mono text-[10px] uppercase tracking-widest ${textLabel}`}>Email</span>
                <span className={`block truncate font-display text-sm ${textMain}`}>{EMAIL}</span>
              </span>
            </a>

            <a href="https://wa.me/2290143202240" target="_blank" rel="noreferrer" className="group flex items-center gap-4">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${chip}`}>
                <MessageCircle className="h-4 w-4" style={{ color: accent }} />
              </span>
              <span>
                <span className={`block font-mono text-[10px] uppercase tracking-widest ${textLabel}`}>Whatsapp</span>
                <span className={`block font-display text-sm ${textMain}`}>+229 01 43 20 22 40</span>
              </span>
            </a>

            <a href="tel:+2290153305895" className="group flex items-center gap-4">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${chip}`}>
                <Phone className="h-4 w-4" style={{ color: accent }} />
              </span>
              <span>
                <span className={`block font-mono text-[10px] uppercase tracking-widest ${textLabel}`}>Contact</span>
                <span className={`block font-display text-sm ${textMain}`}>+229 01 53 30 58 95</span>
              </span>
            </a>
          </div>
        </div>

        {/* Colonne droite : formulaire */}
        <form
          onSubmit={handleSubmit}
          className={`flex flex-col gap-4 rounded-2xl border p-6 backdrop-blur-md md:p-8 ${
            isDark ? 'border-white/10 bg-white/[0.04]' : 'border-black/10 bg-white/45'
          }`}
        >
          <input type="text" required value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom complet" className={field} />
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Adresse email" className={field} />
          <input type="text" value={sujet} onChange={(e) => setSujet(e.target.value)} placeholder="Sujet" className={field} />
          <input type="text" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Budget (optionnel)" className={field} />
          <textarea required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Votre message" rows={5} className={`${field} resize-none`} />

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider transition-transform hover:-translate-y-0.5 active:scale-95"
              style={{ backgroundColor: accent, color: accentText }}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Envoyer le message</span>
            </button>
            <a
              href={cvFile}
              download="CV-Spero-Kouton.png"
              className={`flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider transition-colors ${
                isDark
                  ? 'border-white/20 text-white hover:border-[#F5B419]/60 hover:text-[#F5B419]'
                  : 'border-black/20 text-neutral-900 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <Download className="h-4 w-4" />
              <span>Télécharger CV</span>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
