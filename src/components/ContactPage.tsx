'use client';

// ContactPage.tsx
// Page de contact cinématique (système « Lumora ») accordée à la charte du
// portfolio :
//   - 4 vidéos plein écran en fondu croisé (1000 ms) + sélecteur en bas.
//   - Overlay « wagon » (PNG) avec balancement train-bob par-dessus les vidéos.
//   - Effet « liquid glass » sur les pilules / le formulaire.
//   - Charte : accent ambre #F5B419, dark #191514, font-display (Space Grotesk)
//     pour les titres/boutons, font-mono pour les labels, voile sombre pour
//     garder tous les éléments bien visibles.
// Le formulaire ouvre WhatsApp pré-rempli. Téléchargement du CV.
import { useLayoutEffect, useState } from 'react';
import { ArrowLeft, Mail, MessageCircle, Phone, Download, Send, MousePointerClick, ChevronDown } from 'lucide-react';
import cvFile from '../Apperçu/Mon CV Designer.pdf';
import logoMask from '../créa/sperok-mask.png';
import LoopingVideo from './ui/looping-video';

const EMAIL = 'koutonsperop@gmail.com';
const WHATSAPP = '2290143202240'; // numéro qui reçoit les messages du formulaire
const ACCENT = '#F5B419';
const DARK = '#191514';

// Overlay « wagon » : cadre transparent placé au-dessus des vidéos.
const WAGON_OVERLAY =
  'https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png';

const VIDEOS = [
  {
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081127_0992a171-d3c6-4978-8213-0ec5df8b6d63.mp4',
    label: 'Golden Hour',
  },
  {
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_092026_dd05b805-ea0f-40b2-8c52-332b88502592.mp4',
    label: 'Still Water',
  },
  {
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081042_df7202bf-bd80-4b2b-bbc6-1f09ba2870e9.mp4',
    label: 'Deep Woods',
  },
  {
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_080959_4cac5234-3573-464e-a5b7-76b94b8a7d61.mp4',
    label: 'Quiet Dawn',
  },
];

interface ContactPageProps {
  onBack: () => void;
}

export default function ContactPage({ onBack }: ContactPageProps) {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const [activeVideo, setActiveVideo] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasSwitched, setHasSwitched] = useState(false); // masque l'indice après le 1er clic

  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [sujet, setSujet] = useState('');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');

  // Fondu croisé : on ignore les clics pendant les 1000 ms de transition.
  const switchVideo = (i: number) => {
    if (i === activeVideo || isTransitioning) return;
    setHasSwitched(true);
    setIsTransitioning(true);
    setActiveVideo(i);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

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
    'w-full rounded-xl border border-white/20 bg-white/[0.07] px-4 py-2.5 font-sans text-sm text-white outline-none transition-colors placeholder:text-white/60 focus:border-[#F5B419]/70 focus:bg-white/[0.12] sm:py-3';


  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-[#191514] font-sans selection:bg-[#F5B419] selection:text-[#191514] lg:h-auto lg:min-h-screen">
      {/* ── Couche vidéo : 4 fonds plein écran en fondu croisé ────────────
          Chaque vidéo boucle « sans couture » (double-buffer + fondu de
          jointure) pour qu'on ne remarque pas la reprise. */}
      {VIDEOS.map((v, i) => (
        <LoopingVideo
          key={v.src}
          src={v.src}
          active={i === activeVideo}
          fade={1}
          className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out ${
            i === activeVideo ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* ── Overlay « wagon » : cadre PNG avec balancement train-bob ─────── */}
      <img
        src={WAGON_OVERLAY}
        alt=""
        aria-hidden="true"
        className="train-bob pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover"
      />

      {/* Voile léger : la lisibilité est portée par les cartes ; la vitre du
          milieu reste visible dans l'écart entre les deux colonnes. */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(180deg, rgba(25,21,20,0.45) 0%, rgba(25,21,20,0.2) 35%, rgba(25,21,20,0.24) 65%, rgba(25,21,20,0.55) 100%)',
        }}
      />

      {/* ── Contenu ──────────────────────────────────────────────────────── */}
      <div className="relative z-[2] flex h-full flex-col px-5 py-4 sm:px-10 sm:py-8 lg:h-auto lg:min-h-screen lg:px-16">
        {/* Navigation */}
        <nav className="flex items-center justify-between">
          <span
            className="block h-7 w-24 select-none md:h-8 md:w-28"
            aria-label="spérok"
            style={{
              backgroundColor: '#FAF7F2',
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
          <button
            onClick={onBack}
            className="liquid-glass flex cursor-pointer items-center gap-2.5 rounded-full px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-white transition-colors hover:text-[#F5B419]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour</span>
          </button>
        </nav>

        {/* Formulaire seul, bien centré dans la vitre du wagon (« Dites salut »
            et les coordonnées sont descendus dans la console du bas). */}
        <main className="flex min-h-0 flex-1 overflow-y-auto py-2 [scrollbar-width:none] lg:py-8">
          <form
            onSubmit={handleSubmit}
            className="liquid-glass m-auto flex w-full max-w-lg flex-col gap-2.5 rounded-2xl p-4 sm:gap-3.5 sm:rounded-3xl sm:p-6 md:p-8"
          >
            <h2 className="font-display text-xl font-black uppercase tracking-tight text-white sm:text-2xl md:text-3xl">
              Écrivez-moi
            </h2>
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
            <div className="flex flex-row gap-2.5 sm:gap-3.5">
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
            </div>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Votre message"
              rows={3}
              className={`${field} resize-none`}
            />

            <div className="mt-1 flex flex-row gap-2.5 sm:gap-3">
              <button
                type="submit"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 font-display text-xs font-bold uppercase tracking-wider sm:px-6 sm:py-3.5 transition-transform hover:-translate-y-0.5 active:scale-95"
                style={{ backgroundColor: ACCENT, color: DARK, borderColor: ACCENT }}
              >
                <Send className="h-4 w-4" />
                <span>Envoyer le message</span>
              </button>
              <a
                href={cvFile}
                download="CV-Spero-Kouton.pdf"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-4 py-3 font-display text-xs font-bold uppercase tracking-wider sm:px-6 sm:py-3.5 text-white backdrop-blur-md transition-colors hover:border-[#F5B419]/60 hover:text-[#F5B419]"
              >
                <Download className="h-4 w-4" />
                <span>CV</span>
              </a>
            </div>
          </form>
        </main>

        {/* ── Bas (console du wagon) : « Dites salut » + coordonnées, puis les
            ambiances juste en dessous. ── */}
        <footer className="flex flex-col gap-3 border-t border-white/15 pt-3 sm:gap-4 sm:pt-4">
          {/* Accroche + coordonnées */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-white sm:text-[10px]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: ACCENT }} />
                Disponible
              </span>
              <h1 className="font-display text-2xl font-black uppercase leading-none tracking-tight text-white sm:text-3xl">
                Dites <span style={{ color: ACCENT }}>salut.</span>
              </h1>
            </div>

            {/* Coordonnées compactes (icônes seules sur mobile, + texte dès sm) */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-2 transition-colors hover:bg-white/[0.1] sm:px-3 sm:py-1.5"
              >
                <Mail className="h-4 w-4 shrink-0" style={{ color: ACCENT }} />
                <span className="hidden font-display text-xs font-semibold text-white sm:inline">{EMAIL}</span>
              </a>
              <a
                href="https://wa.me/2290143202240"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-2 transition-colors hover:bg-white/[0.1] sm:px-3 sm:py-1.5"
              >
                <MessageCircle className="h-4 w-4 shrink-0" style={{ color: ACCENT }} />
                <span className="hidden font-display text-xs font-semibold text-white sm:inline">+229 01 43 20 22 40</span>
              </a>
              <a
                href="tel:+2290153305895"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-2 transition-colors hover:bg-white/[0.1] sm:px-3 sm:py-1.5"
              >
                <Phone className="h-4 w-4 shrink-0" style={{ color: ACCENT }} />
                <span className="hidden font-display text-xs font-semibold text-white sm:inline">+229 01 53 30 58 95</span>
              </a>
            </div>
          </div>

          {/* Ambiances (options) — juste sous « Dites salut » */}
          <div className="flex flex-col gap-2 border-t border-white/10 pt-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-2">
              {/* Indice interactif : inviter à changer d'ambiance (disparaît au 1er clic) */}
              <div
                className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#F5B419] transition-all duration-500 ${
                  hasSwitched ? 'pointer-events-none translate-y-1 opacity-0' : 'opacity-100'
                }`}
              >
                <MousePointerClick className="h-3.5 w-3.5 animate-pulse" />
                <span>Cliquez pour voyager d'un décor à l'autre</span>
                <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {VIDEOS.map((v, i) => (
                  <button
                    key={v.label}
                    onClick={() => switchVideo(i)}
                    className={`border-b-2 pb-1 font-mono text-xs uppercase tracking-wider transition-all duration-300 ${
                      i === activeVideo
                        ? 'border-[#F5B419] text-[#F5B419]'
                        : `border-transparent text-white/55 hover:text-white/90 ${
                            hasSwitched ? '' : 'animate-pulse'
                          }`
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
            <span className="hidden font-mono text-[10px] uppercase tracking-widest text-white/60 sm:block">
              Portfolio · Designer Spéro.K · Bénin
            </span>
          </div>
        </footer>
      </div>
    </section>
  );
}
