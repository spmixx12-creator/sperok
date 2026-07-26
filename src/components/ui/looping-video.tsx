'use client';

// looping-video.tsx
// Vidéo en boucle « sans couture » : la reprise (fin -> début) d'un clip laisse
// souvent une coupure visible. On empile deux copies de la même vidéo (A/B) et,
// juste avant la fin de celle qui joue, on démarre l'autre à 0 en fondu croisé.
// La dissolution masque la discontinuité -> on ne remarque pas la reprise.
// Seule la vidéo active joue (les autres sont en pause) pour économiser les
// ressources.
import { useEffect, useRef, useState } from 'react';

interface LoopingVideoProps {
  src: string;
  active: boolean;
  className?: string;
  /** Durée du fondu de jointure, en secondes. */
  fade?: number;
}

export default function LoopingVideo({ src, active, className = '', fade = 1 }: LoopingVideoProps) {
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const [front, setFront] = useState<'a' | 'b'>('a'); // copie visible
  const busy = useRef(false); // verrou anti double-relais pendant un fondu

  // Lecture / pause selon l'état actif (on garde la position pour éviter un saut).
  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;
    if (active) {
      (front === 'a' ? a : b).play().catch(() => {});
    } else {
      a.pause();
      b.pause();
      busy.current = false;
    }
  }, [active, front]);

  // Relais fin -> début avec fondu croisé.
  const handleTime = (which: 'a' | 'b') => {
    if (!active || busy.current || which !== front) return;
    const cur = which === 'a' ? aRef.current : bRef.current;
    const next = which === 'a' ? bRef.current : aRef.current;
    if (!cur || !next || !Number.isFinite(cur.duration) || cur.duration === 0) return;
    if (cur.currentTime >= cur.duration - fade) {
      busy.current = true;
      next.currentTime = 0;
      next.play().catch(() => {});
      setFront(which === 'a' ? 'b' : 'a');
      window.setTimeout(() => {
        busy.current = false;
      }, fade * 1000);
    }
  };

  const base = 'absolute inset-0 h-full w-full object-cover transition-opacity ease-linear';
  const dur = { transitionDuration: `${fade * 1000}ms` };

  return (
    <div className={className}>
      <video
        ref={aRef}
        src={src}
        muted
        playsInline
        preload="auto"
        onTimeUpdate={() => handleTime('a')}
        className={`${base} ${front === 'a' ? 'opacity-100' : 'opacity-0'}`}
        style={dur}
      />
      <video
        ref={bRef}
        src={src}
        muted
        playsInline
        preload="auto"
        onTimeUpdate={() => handleTime('b')}
        className={`${base} ${front === 'b' ? 'opacity-100' : 'opacity-0'}`}
        style={dur}
      />
    </div>
  );
}
