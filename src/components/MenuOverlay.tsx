import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, Github, Linkedin, MessageCircle, Clock } from 'lucide-react';

interface MenuOverlayProps {
  onScrollToSection: (sectionId: string) => void;
}

export default function MenuOverlay({ onScrollToSection }: MenuOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState('');

  // Update time for the designer metadata clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      try {
        setTime(
          now.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Africa/Cotonou',
          }) + ' WAT'
        );
      } catch (e) {
        // Fallback: manually calculate Cotonou time (UTC+1)
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const cotonouDate = new Date(utc + 3600000);
        setTime(
          cotonouDate.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }) + ' WAT'
        );
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLinkClick = (id: string) => {
    setIsOpen(false);
    // Short timeout to allow menu close animation to finish
    setTimeout(() => {
      onScrollToSection(id);
    }, 300);
  };

  const navLinks = [
    { label: '01 // INTRO', target: 'hero', desc: 'Accueil & Signature' },
    { label: '02 // PROJETS', target: 'apercus', desc: 'Travaux Curatés' },
    { label: '03 // PLAYGROUND', target: 'playground', desc: 'Bac à sable créatif' },
    { label: '04 // CONTACT', target: 'contact', desc: 'Parlons de votre projet' },
  ];

  return (
    <>
      {/* Floating Pill Menu Button at bottom center */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 select-none">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 font-display font-semibold text-xs uppercase tracking-wider border cursor-pointer transition-all ${
            isOpen 
              ? 'bg-neutral-900 border-neutral-800 text-white' 
              : 'bg-amber-400 border-amber-300 text-neutral-900 hover:bg-amber-300'
          }`}
        >
          {isOpen ? (
            <>
              <span>Fermer</span>
              <X className="w-4 h-4 text-amber-400" />
            </>
          ) : (
            <>
              <span>Menu</span>
              <div className="flex flex-col gap-1 w-4 items-end">
                <span className="h-[2px] w-4 bg-neutral-900 rounded" />
                <span className="h-[2px] w-2.5 bg-neutral-900 rounded" />
              </div>
            </>
          )}
        </motion.button>
      </div>

      {/* Fullscreen Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#FAF7F2]/98 backdrop-blur-lg z-30 flex flex-col justify-between p-6 md:p-12 overflow-hidden"
          >
            {/* Top info row */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-mono text-[10px] tracking-widest text-neutral-500">SPÉROK // NAV_CORE</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-500">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>COTONOU: {time}</span>
              </div>
            </div>

            {/* Middle Nav Links */}
            <div className="my-auto max-w-2xl mx-auto w-full py-8">
              <span className="font-mono text-[10px] text-neutral-400 tracking-widest block mb-4">
                SOMMAIRE_SITE
              </span>
              <div className="flex flex-col gap-6 md:gap-10">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.target}
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.08, type: 'spring', stiffness: 120 }}
                  >
                    <button
                      onClick={() => handleLinkClick(link.target)}
                      className="group text-left block w-full relative cursor-pointer"
                    >
                      <div className="flex items-baseline justify-between">
                        <h2 className="font-display font-extrabold text-3xl md:text-5xl lg:text-6xl tracking-tight text-neutral-800 group-hover:text-amber-600 transition-colors">
                          {link.label}
                        </h2>
                        <ArrowRight className="w-5 h-5 md:w-8 md:h-8 text-neutral-300 group-hover:text-amber-500 group-hover:translate-x-2 transition-all" />
                      </div>
                      <span className="font-display text-neutral-400 text-xs md:text-sm tracking-wide block mt-1.5 pl-1">
                        {link.desc}
                      </span>
                      <div className="h-[1px] w-full bg-neutral-200 mt-4 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom Footer Info inside Menu */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center border-t border-neutral-200 pt-6">
              <div className="flex gap-4 font-display text-xs text-neutral-500">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-neutral-900 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-neutral-900 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
                <a 
                  href="mailto:koutonsperop@gmail.com"
                  className="flex items-center gap-1 hover:text-neutral-900 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Email</span>
                </a>
              </div>

              <div className="text-center md:text-right font-mono text-[9px] text-neutral-400">
                <span>© 2026 SPÉROK. TOUS DROITS RÉSERVÉS.</span>
                <span className="block mt-0.5">MADE WITH AMOUR ET DE DESIGN</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
