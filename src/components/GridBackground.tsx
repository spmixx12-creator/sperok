import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function GridBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  const mouseXSpring = useSpring(useMotionValue(0), { stiffness: 50, damping: 20 });
  const mouseYSpring = useSpring(useMotionValue(0), { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      mouseXSpring.set(e.clientX - window.innerWidth / 2);
      mouseYSpring.set(e.clientY - window.innerHeight / 2);
    };

    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [mouseXSpring, mouseYSpring]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Base Subtle Paper Grid */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundSize: '40px 40px',
          backgroundImage: `
            linear-gradient(to right, rgba(26, 26, 26, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(26, 26, 26, 0.03) 1px, transparent 1px)
          `,
        }}
      />

      {/* Axis Lines (Center horizontal & vertical) */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-neutral-900/10" />
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-neutral-900/10" />

      {/* Crosshair following cursor */}
      <div 
        className="absolute w-8 h-8 pointer-events-none hidden md:block"
        style={{
          left: mousePos.x - 16,
          top: mousePos.y - 16,
        }}
      >
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-amber-500/30" />
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-amber-500/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-500/40" />
      </div>

      {/* Coordinates indicators in four corners */}
      <div className="absolute top-4 left-4 font-mono text-[10px] text-neutral-400 tracking-wider">
        REF_CANVAS_01 // SECURE
      </div>
      <div className="absolute top-4 right-4 font-mono text-[10px] text-neutral-400 tracking-wider">
        LAT_50.8503 // LON_4.3517
      </div>
      <div className="absolute bottom-20 left-4 font-mono text-[10px] text-neutral-400 tracking-wider">
        ACTIVE_GRID_W: {dimensions.width}px H: {dimensions.height}px
      </div>
      <div className="absolute bottom-20 right-4 font-mono text-[10px] text-neutral-400 tracking-wider">
        M_POS: {mousePos.x}X, {mousePos.y}Y
      </div>
    </div>
  );
}
