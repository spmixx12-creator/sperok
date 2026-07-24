import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { X, ExternalLink, Calendar, Briefcase, ClipboardList, Layers } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/40 backdrop-blur-md flex items-center justify-end p-0 md:p-4">
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-zoom-out" onClick={onClose} />

      {/* Slide-out case study card */}
      <motion.div
        initial={{ x: '100%', opacity: 0.9 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 180 }}
        className="relative w-full md:max-w-3xl h-full md:h-[calc(100vh-32px)] bg-[#FAF7F2] text-neutral-900 rounded-none md:rounded-2xl shadow-2xl flex flex-col z-10 overflow-hidden"
      >
        {/* Modal Header Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-neutral-200/50 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: project.accentColor }}
            />
            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
              Projet_Etude_Cas // {project.id}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {project.link && (
              <a 
                href="#live-demo"
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Redirection vers une maquette interactive de : ${project.title}`);
                }}
                className="flex items-center gap-1 text-xs font-display font-medium text-neutral-700 hover:text-amber-600 bg-neutral-100 hover:bg-neutral-200/50 px-3 py-1.5 rounded-full transition-all"
              >
                <span>Live View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Cover Hero Banner */}
          <div className="relative aspect-[16/9] w-full bg-neutral-100 border-b border-neutral-200/40">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent pointer-events-none" />
            
            {/* Overlay large displays */}
            <div className="absolute bottom-6 left-6 right-6 text-white z-10">
              <span className="px-3 py-1 text-[9px] font-mono tracking-wider uppercase bg-white/20 backdrop-blur-md rounded-md">
                {project.category}
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 tracking-tight">
                {project.title}
              </h2>
            </div>
          </div>

          {/* Core metadata details block */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-b border-neutral-200/60 mb-8">
              <div>
                <span className="flex items-center gap-1.5 font-mono text-[9px] text-neutral-400 uppercase tracking-widest mb-1">
                  <Calendar className="w-3 h-3 text-neutral-400" /> Année
                </span>
                <p className="font-display font-semibold text-sm text-neutral-800">
                  {project.year}
                </p>
              </div>

              <div>
                <span className="flex items-center gap-1.5 font-mono text-[9px] text-neutral-400 uppercase tracking-widest mb-1">
                  <Briefcase className="w-3 h-3 text-neutral-400" /> Client
                </span>
                <p className="font-display font-semibold text-sm text-neutral-800">
                  {project.client}
                </p>
              </div>

              <div className="col-span-2">
                <span className="flex items-center gap-1.5 font-mono text-[9px] text-neutral-400 uppercase tracking-widest mb-1">
                  <ClipboardList className="w-3 h-3 text-neutral-400" /> Domaines d'intervention
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.scope.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200/60 text-[10px] font-display text-neutral-600 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Case Study Sections */}
            <div className="space-y-8">
              {/* Le Brief */}
              <div>
                <h3 className="font-display font-bold text-lg text-neutral-900 mb-2.5">
                  Le Brief
                </h3>
                <p className="text-neutral-600 text-sm md:text-base leading-relaxed">
                  {project.longDescription}
                </p>
              </div>

              {/* L'approche & Direction Artistique */}
              <div>
                <h3 className="font-display font-bold text-lg text-neutral-900 mb-2.5">
                  Approche & Solution
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                  En analysant les points de friction de la marque, nous avons conçu une stratégie centrée sur un design fort et épuré. En supprimant tout le bruit visuel inutile et en intégrant des animations interactives d'une grande fluidité, nous renforçons l'immersion sans compromettre l'accessibilité.
                </p>

                {/* Sub-block graphic layout */}
                <div className="p-5 rounded-2xl bg-white border border-neutral-200/50 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                  <div>
                    <h4 className="font-display font-semibold text-xs text-neutral-800 uppercase tracking-wide">
                      Identité Technique & Esthétique
                    </h4>
                    <p className="text-xs text-neutral-500 mt-1">
                      Construit avec React 19, Tailwind CSS v4 et des courbes d'animation personnalisées.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-mono border border-amber-200/30 font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Le Résultat */}
              <div className="border-t border-neutral-200/50 pt-6">
                <h3 className="font-display font-bold text-lg text-neutral-900 mb-2.5">
                  Résultats & Impact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-4">
                  <div className="bg-white p-4 rounded-xl border border-neutral-200/40">
                    <p className="font-display font-bold text-2xl text-amber-600">+140%</p>
                    <p className="text-[11px] text-neutral-500 mt-1 uppercase tracking-wider font-mono">D'engagement utilisateur</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-neutral-200/40">
                    <p className="font-display font-bold text-2xl text-amber-600">-0.4s</p>
                    <p className="text-[11px] text-neutral-500 mt-1 uppercase tracking-wider font-mono">De temps de chargement (FCP)</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-neutral-200/40">
                    <p className="font-display font-bold text-2xl text-amber-600">100%</p>
                    <p className="text-[11px] text-neutral-500 mt-1 uppercase tracking-wider font-mono">Satisfaction client</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky footer for navigation / contact */}
        <div className="px-6 py-4 bg-white border-t border-neutral-200/50 flex items-center justify-between text-xs text-neutral-500 font-mono">
          <span>SPÉROK_EST_2026</span>
          <button 
            onClick={onClose}
            className="hover:text-amber-600 transition-colors font-medium flex items-center gap-1"
          >
            Fermer l'étude [X]
          </button>
        </div>
      </motion.div>
    </div>
  );
}
