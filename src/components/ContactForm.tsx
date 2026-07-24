import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Check, Mail, Sparkles } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', projectType: 'web', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-neutral-200/60 shadow-xl overflow-hidden">
      {/* Decorative Stamp for Success State */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div 
            initial={{ scale: 3, rotate: 45, opacity: 0 }}
            animate={{ scale: 1, rotate: -12, opacity: 1 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm p-6 text-center"
          >
            {/* The postal stamp */}
            <div 
              className="px-6 py-4 border-4 border-dashed border-red-500 rounded-lg text-red-500 font-display font-extrabold text-2xl tracking-widest uppercase transform rotate-[-8deg] mb-4 select-none"
              style={{ boxShadow: '0 0 0 4px #FFFFFF, 0 10px 30px rgba(239, 68, 68, 0.15)' }}
            >
              MERCI ! 💌
              <span className="block text-[10px] font-mono tracking-widest mt-1 text-red-400">
                MESSAGE REÇU // COTONOU_POST
              </span>
            </div>
            
            <h3 className="font-display font-bold text-lg text-neutral-800">
              Votre message est en route !
            </h3>
            <p className="text-xs text-neutral-500 mt-2 max-w-xs leading-relaxed">
              Merci, j'ai bien reçu votre demande. Je l'analyse avec soin et je reviens vers vous sous 48 heures.
            </p>

            <button
              onClick={() => {
                setStatus('idle');
                setFormData({ name: '', email: '', projectType: 'web', message: '' });
              }}
              className="mt-6 px-4 py-2 rounded-full border border-neutral-200 hover:bg-neutral-50 text-xs font-display text-neutral-600 transition-colors"
            >
              Envoyer un autre message
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <span className="font-mono text-[9px] text-amber-600 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5" /> 01 // VOS COORDONNÉES
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="relative">
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-neutral-50/50 border-b-2 border-neutral-200 focus:border-neutral-900 px-3 py-3 text-sm transition-all outline-none rounded-t-lg font-sans placeholder-neutral-400"
                placeholder="Votre nom ou entreprise *"
              />
            </div>
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-neutral-50/50 border-b-2 border-neutral-200 focus:border-neutral-900 px-3 py-3 text-sm transition-all outline-none rounded-t-lg font-sans placeholder-neutral-400"
                placeholder="Votre e-mail *"
              />
            </div>
          </div>
        </div>

        {/* Project category selectors */}
        <div>
          <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest block mb-2">
            02 // NATURE DE VOTRE PROJET
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'web', label: 'Immersif Web' },
              { id: 'brand', label: 'Identité / Brand' },
              { id: 'design', label: 'UX / UI Design' },
            ].map((type) => {
              const isSelected = formData.projectType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, projectType: type.id })}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-display font-medium tracking-tight transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 border-neutral-900 text-white shadow-sm'
                      : 'bg-neutral-50/50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Message */}
        <div>
          <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest block mb-1.5">
            03 // VOTRE BRIEF EN QUELQUES MOTS
          </span>
          <textarea
            id="message"
            required
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-neutral-50/50 border-2 border-neutral-200 focus:border-neutral-900 p-3 text-sm transition-all outline-none rounded-xl font-sans placeholder-neutral-400 resize-none"
            placeholder="Décrivez votre idée, vos objectifs, votre calendrier ou budget... *"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className={`w-full py-4 rounded-xl font-display font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
            status === 'submitting'
              ? 'bg-neutral-200 text-neutral-400 border-neutral-100 cursor-not-allowed'
              : 'bg-neutral-950 hover:bg-neutral-800 text-white shadow-lg shadow-neutral-900/10'
          }`}
        >
          {status === 'submitting' ? (
            <>
              <div className="w-4 h-4 border-2 border-neutral-400 border-t-neutral-800 rounded-full animate-spin" />
              <span>Transmission...</span>
            </>
          ) : (
            <>
              <span>Envoyer le brief</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
