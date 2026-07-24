'use client';

// ContactPage.tsx
// Page de contact dédiée (atteinte via le bouton « Désignons ta prochaine
// identité » du footer). Infos de contact + formulaire (envoi via mailto) +
// téléchargement du CV.
import { useLayoutEffect, useState } from 'react';
import { ArrowLeft, Mail, MessageCircle, Phone, Download } from 'lucide-react';
import cvFile from '../créa/Beige Noir Moderne Minimaliste CV (5).png';
import { GradientDots } from './ui/gradient-dots';

const ACCENT = '#F5B419';
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

  // Envoi via WhatsApp : le message est pré-rempli avec les infos de la personne
  // et adressé au numéro de Spéro (le visiteur n'a plus qu'à appuyer sur envoyer).
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

  const field =
    'w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 font-sans text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-[#F5B419]/70 focus:bg-white/[0.06]';

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0a0a0a] text-white font-sans selection:bg-[#F5B419] selection:text-neutral-900">
      {/* Fond : points en dégradé animés */}
      <GradientDots duration={20} />

      {/* Retour */}
      <button
        onClick={onBack}
        className="group fixed top-5 left-6 z-50 flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 font-display text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white hover:text-neutral-900 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Retour</span>
      </button>

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-28 lg:grid-cols-2 lg:gap-16 lg:px-12">
        {/* Colonne gauche : accroche + coordonnées */}
        <div className="flex flex-col">
          <span
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#F5B419]/30 bg-[#F5B419]/10 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: ACCENT }}
          >
            <span className="h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: ACCENT }} />
            Disponible pour vos projets
          </span>

          <h1 className="mt-6 font-display text-6xl font-black uppercase leading-[0.9] tracking-tight md:text-8xl">
            Dites{' '}
            <span style={{ color: ACCENT }}>salut.</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-white/55">
            Vous avez une idée, un projet ou juste envie de discuter design ?
            Je suis à un message de distance.
          </p>

          <div className="mt-10 flex flex-col gap-5">
            <a href={`mailto:${EMAIL}`} className="group flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-colors group-hover:border-[#F5B419]/60">
                <Mail className="h-4 w-4" style={{ color: ACCENT }} />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[10px] uppercase tracking-widest text-white/35">Email</span>
                <span className="block truncate font-display text-sm text-white/90">{EMAIL}</span>
              </span>
            </a>

            <a href="https://wa.me/2290143202240" target="_blank" rel="noreferrer" className="group flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-colors group-hover:border-[#F5B419]/60">
                <MessageCircle className="h-4 w-4" style={{ color: ACCENT }} />
              </span>
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-widest text-white/35">Whatsapp</span>
                <span className="block font-display text-sm text-white/90">+229 01 43 20 22 40</span>
              </span>
            </a>

            <a href="tel:+2290153305895" className="group flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-colors group-hover:border-[#F5B419]/60">
                <Phone className="h-4 w-4" style={{ color: ACCENT }} />
              </span>
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-widest text-white/35">Contact</span>
                <span className="block font-display text-sm text-white/90">+229 01 53 30 58 95</span>
              </span>
            </a>
          </div>
        </div>

        {/* Colonne droite : formulaire */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm md:p-8"
        >
          <input
            type="text"
            required
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Nom complet"
            className={field}
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresse email"
            className={field}
          />
          <input
            type="text"
            value={sujet}
            onChange={(e) => setSujet(e.target.value)}
            placeholder="Sujet"
            className={field}
          />
          <input
            type="text"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Budget (optionnel)"
            className={field}
          />
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Votre message"
            rows={5}
            className={`${field} resize-none`}
          />

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-neutral-900 transition-transform hover:-translate-y-0.5 active:scale-95"
              style={{ backgroundColor: ACCENT }}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Envoyer le message</span>
            </button>
            <a
              href={cvFile}
              download="CV-Spero-Kouton.png"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-white transition-colors hover:border-[#F5B419]/60 hover:text-[#F5B419]"
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
