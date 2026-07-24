import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import { ArrowUpRight, FolderOpen, Calendar } from 'lucide-react';

interface ProjectShowcaseProps {
  onSelectProject: (project: Project) => void;
}

// Projets d'exemple supprimés. À remplir avec tes vrais projets.
const PROJECTS: Project[] = [];

export default function ProjectShowcase({ onSelectProject }: ProjectShowcaseProps) {
  const filteredProjects = PROJECTS;

  return (
    <div className="w-full">
      {/* État vide : aucun projet à afficher */}
      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/40">
          <FolderOpen className="w-8 h-8 text-neutral-300 mb-4" />
          <p className="font-display font-semibold text-neutral-600">
            Aucun projet pour le moment.
          </p>
          <p className="font-mono text-[11px] text-neutral-400 uppercase tracking-widest mt-2">
            Bientôt disponible
          </p>
        </div>
      )}

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20, delay: idx * 0.05 }}
              onClick={() => onSelectProject(project)}
              className="group cursor-pointer flex flex-col justify-between"
            >
              {/* Media Container with custom tilt & border overlay */}
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/50 shadow-sm mb-5">
                <div 
                  className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${project.accentColor}40 0%, transparent 80%)`
                  }}
                />
                
                {/* Image zoom effect */}
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
                />

                {/* Corner tags and overlays */}
                <div className="absolute top-4 left-4 z-20 flex gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono font-medium tracking-tight shadow-sm">
                    {project.category}
                  </span>
                </div>
                
                <div className="absolute top-4 right-4 z-20">
                  <span className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-neutral-800 shadow-sm opacity-0 md:opacity-100 md:translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>

                {/* Project Year Indicator on bottom right */}
                <div className="absolute bottom-4 right-4 z-20">
                  <span className="px-2.5 py-1 rounded-md bg-neutral-900/80 backdrop-blur-md text-white font-mono text-[9px] tracking-wider">
                    {project.year}
                  </span>
                </div>
              </div>

              {/* Title & Description Info */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-bold text-xl lg:text-2xl tracking-tight text-neutral-900 group-hover:text-amber-600 transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-400">
                    <Calendar className="w-3 h-3" />
                    <span>{project.year}</span>
                  </div>
                </div>

                <p className="text-neutral-500 text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Dynamic Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span 
                      key={tag}
                      className="text-[10px] font-display px-2 py-0.5 rounded bg-neutral-50 border border-neutral-150 text-neutral-500 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 text-neutral-400">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
