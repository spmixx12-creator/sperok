import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Layers, Terminal, Sparkles, Figma, Cpu, Compass, Play, Aperture } from 'lucide-react';

interface BadgeItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  x: string;
  y: string;
}

export default function FloatingBadges() {
  const containerRef = useRef<HTMLDivElement>(null);

  const BADGES: BadgeItem[] = [
    {
      id: 'figma',
      label: 'Figma',
      icon: <Layers className="w-4 h-4" />,
      color: '#F24E1E',
      bgColor: 'rgba(242, 78, 30, 0.08)',
      borderColor: 'rgba(242, 78, 30, 0.3)',
      x: '15%',
      y: '20%',
    },
    {
      id: 'react',
      label: 'React & TS',
      icon: <Cpu className="w-4 h-4" />,
      color: '#61DAFB',
      bgColor: 'rgba(97, 218, 251, 0.08)',
      borderColor: 'rgba(97, 218, 251, 0.3)',
      x: '70%',
      y: '25%',
    },
    {
      id: 'motion',
      label: 'Motion Graphics',
      icon: <Play className="w-4 h-4" />,
      color: '#FF007F',
      bgColor: 'rgba(255, 0, 127, 0.08)',
      borderColor: 'rgba(255, 0, 127, 0.3)',
      x: '45%',
      y: '15%',
    },
    {
      id: 'three3d',
      label: 'Spline & 3D',
      icon: <Aperture className="w-4 h-4" />,
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.08)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      x: '25%',
      y: '65%',
    },
    {
      id: 'creative-dev',
      label: 'Creative Coding',
      icon: <Terminal className="w-4 h-4" />,
      color: '#FBBF24',
      bgColor: 'rgba(251, 191, 36, 0.08)',
      borderColor: 'rgba(251, 191, 36, 0.3)',
      x: '60%',
      y: '70%',
    },
    {
      id: 'ux-arch',
      label: 'UX Architecture',
      icon: <Compass className="w-4 h-4" />,
      color: '#A855F7',
      bgColor: 'rgba(168, 85, 247, 0.08)',
      borderColor: 'rgba(168, 85, 247, 0.3)',
      x: '75%',
      y: '60%',
    },
    {
      id: 'branding',
      label: 'Visual Brand Systems',
      icon: <Sparkles className="w-4 h-4" />,
      color: '#EC4899',
      bgColor: 'rgba(236, 72, 153, 0.08)',
      borderColor: 'rgba(236, 72, 153, 0.3)',
      x: '40%',
      y: '45%',
    },
  ];

  return (
    <div 
      ref={containerRef}
      className="relative h-[420px] w-full rounded-3xl bg-neutral-900 border border-neutral-800/80 overflow-hidden shadow-2xl p-6 flex flex-col justify-between"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px',
      }}
    >
      {/* Dynamic graphic waves (decorations) */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <path d="M-100,150 Q150,300 400,100 T900,200 T1400,150" fill="none" stroke="white" strokeWidth="3" />
        <path d="M-100,220 Q200,100 500,250 T1100,100 T1600,220" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="6,6" />
      </svg>

      {/* Grid Status Header */}
      <div className="flex items-center justify-between z-10 select-none">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[10px] text-neutral-400 tracking-wider">WORKSPACE_SANDBOX // LIVE</span>
        </div>
        <span className="font-mono text-[10px] text-neutral-500">DRAG_ANY_TAG</span>
      </div>

      {/* Floating Sandbox Tags */}
      <div className="absolute inset-0 z-20">
        {BADGES.map((badge) => (
          <motion.div
            key={badge.id}
            drag
            dragConstraints={containerRef}
            dragElastic={0.1}
            dragMomentum={true}
            whileDrag={{ scale: 1.08, zIndex: 50 }}
            whileHover={{ scale: 1.04 }}
            initial={{ left: badge.x, top: badge.y, opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="absolute px-4 py-2.5 rounded-full flex items-center gap-2.5 cursor-grab active:cursor-grabbing shadow-lg select-none backdrop-blur-md border"
            style={{
              backgroundColor: badge.bgColor,
              borderColor: badge.borderColor,
              color: '#FFFFFF',
              boxShadow: `0 8px 30px -10px ${badge.color}20`,
            }}
          >
            <div 
              className="p-1 rounded-full flex items-center justify-center"
              style={{ color: badge.color, backgroundColor: `${badge.color}15` }}
            >
              {badge.icon}
            </div>
            <span className="font-display font-medium text-xs tracking-tight">{badge.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Decorative center grid point */}
      <div className="mx-auto text-center z-10 max-w-sm pointer-events-none select-none my-auto">
        <p className="font-mono text-[11px] text-neutral-500 uppercase tracking-widest mb-1">
          Stack Interactif
        </p>
        <p className="font-sans text-neutral-400 text-xs">
          Prenez n'importe quel badge et glissez-le pour composer ma stack technique ou configurer votre vision.
        </p>
      </div>

      {/* Bottom info */}
      <div className="flex items-center justify-between font-mono text-[9px] text-neutral-500 z-10 select-none">
        <span>BOUNDARIES: DETECTED_CANVAS_CONTAINER</span>
        <span>STRENGTH: STIFF_SPRING_12</span>
      </div>
    </div>
  );
}
