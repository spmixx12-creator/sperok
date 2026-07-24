"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useScroll } from "motion/react";
import type { MotionValue } from "motion/react";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";

// scroll-model.tsx
// Modèle 3D (public/scene.glb) : position FIXE (ancré en bas, grande échelle
// pour occuper la section, ne se déplace pas) mais RÉAGIT au scroll via une
// rotation dos → 3/4 face. Rendu WebGL transparent en calque.

// Angles clés (axe Y, centre du modèle) : dos (180°) → 3/4 face (45°).
const BACK = Math.PI;
const THREE_QUARTER = Math.PI / 4;

const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

const MODEL_URL = "/scene.glb";

function Model({ progress }: { progress: MotionValue<number> }) {
  const { scene } = useGLTF(MODEL_URL);
  const outer = useRef<THREE.Group>(null); // position + échelle FIXES
  const spin = useRef<THREE.Group>(null); // rotation pilotée par le scroll

  // Recentre le modèle, l'agrandit pour occuper la section et l'ancre EN BAS.
  // Position et échelle définies une seule fois → il ne se déplace pas.
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    scene.position.set(-center.x, -center.y, -center.z);

    // Desktop : inchangé (grand, ancré en bas y=-3).
    // Téléphone / tablette (< 1024px) : légèrement remonté + un peu plus petit
    // → le modèle est visible EN ENTIER.
    const apply = () => {
      if (!outer.current) return;
      const small = window.innerWidth < 1024;
      outer.current.scale.setScalar((small ? 11 : 13) / maxAxis);
      outer.current.position.set(0, small ? -1.6 : -3, 0);
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [scene]);

  // Réagit au scroll : rotation dos → 3/4 face (aucun déplacement de position).
  useFrame(() => {
    if (!spin.current) return;
    const p = progress.get();
    spin.current.rotation.y = BACK + p * (THREE_QUARTER - BACK);
  });

  return (
    <group ref={outer}>
      <group ref={spin}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_URL);

export function ScrollModel3D({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <div
      ref={ref}
      className={cx(
        "pointer-events-none absolute inset-0 z-10 overflow-hidden",
        className,
      )}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, 11.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.9} />
        <hemisphereLight args={["#ffffff", "#20140a", 0.6]} />
        <directionalLight position={[5, 6, 5]} intensity={1.4} />
        <directionalLight position={[-6, 2, -4]} intensity={0.6} color="#F5B419" />
        <Suspense fallback={null}>
          <Model progress={scrollYProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
