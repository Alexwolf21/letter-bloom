"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, PerspectiveCamera } from "@react-three/drei";
import FloatingEnvelope from "./FloatingEnvelope";

interface SceneProps {
  isOpen: boolean;
  onOpen: () => void;
  mood?: string;
}

const Scene = ({ isOpen, onOpen, mood }: SceneProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ width: "100%", height: "100%" }} />;

  return (
    <Canvas shadows dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffd700" />
      <spotLight position={[-5, 5, 5]} angle={0.15} penumbra={1} intensity={1} color="#ffb6c1" />

      <Suspense fallback={null}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <FloatingEnvelope isOpen={isOpen} onOpen={onOpen} mood={mood} />
        </Float>
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
};

export default Scene;
