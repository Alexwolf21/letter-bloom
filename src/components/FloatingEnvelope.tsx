"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useCursor, Text, Float } from "@react-three/drei";
import * as THREE from "three";

interface FloatingEnvelopeProps {
  isOpen: boolean;
  onOpen: () => void;
  mood?: string;
}

const FloatingEnvelope = ({ isOpen, onOpen, mood = 'peaceful' }: FloatingEnvelopeProps) => {
  const [hovered, setHovered] = useState(false);
  const flapRef = useRef<THREE.Group>(null);
  useCursor(hovered && !isOpen);

  // Mood Colors Configuration
  const moodColors: Record<string, { light: string, pulse: string }> = {
    peaceful: { light: "#4eb4ff", pulse: "#87ceeb" }, // Soft Blue
    passionate: { light: "#ff3e6d", pulse: "#ff1493" }, // Deep Red/Pink
    nostalgic: { light: "#ffcc33", pulse: "#ffd700" }, // Warm Gold
    excited: { light: "#ff69b4", pulse: "#ff00ff" }, // Bright Pink/Magenta
  };

  const currentColors = moodColors[mood] || moodColors.peaceful;

  // Colors
  const envelopeColor = "#fff5f5";
  const innerColor = "#ffe4e1";
  const sealColor = mood === 'passionate' ? "#b22222" : "#d4af37";

  // Use Frame for smooth animation instead of 3rd party libraries to avoid version conflicts
  useFrame((state, delta) => {
    if (flapRef.current) {
      const targetRotation = isOpen ? Math.PI * 0.8 : 0;
      const targetZ = isOpen ? -0.1 : 0.03;
      
      flapRef.current.rotation.x = THREE.MathUtils.lerp(
        flapRef.current.rotation.x,
        targetRotation,
        0.1
      );
      
      flapRef.current.position.z = THREE.MathUtils.lerp(
        flapRef.current.position.z,
        targetZ,
        0.1
      );
    }
  });

  return (
    <group 
      onClick={() => !isOpen && onOpen()}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={1}
    >
      {/* Main Body (Back) */}
      <mesh receiveShadow castShadow>
        <planeGeometry args={[4, 2.8]} />
        <meshStandardMaterial color={envelopeColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Front Flaps (Static) */}
      {/* Bottom Flap */}
      <mesh position={[0, -0.7, 0.01]} rotation={[0, 0, 0]}>
        <planeGeometry args={[4, 1.4]} />
        <meshStandardMaterial color={innerColor} side={THREE.DoubleSide} opacity={0.9} transparent />
      </mesh>
      
      {/* Left Flap */}
      <mesh position={[-1, 0, 0.02]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[2.8, 2.8]} />
        <meshStandardMaterial color={envelopeColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Right Flap */}
      <mesh position={[1, 0, 0.02]} rotation={[0, 0, -Math.PI / 4]}>
        <planeGeometry args={[2.8, 2.8]} />
        <meshStandardMaterial color={envelopeColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Top Flap (Animated with referential lerp) */}
      <group
        ref={flapRef}
        position={[0, 1.4, 0.03]}
      >
        <mesh position={[0, -0.7, 0]} rotation={[0, 0, 0]}>
          <planeGeometry args={[4, 1.4]} />
          <meshStandardMaterial color={isOpen ? innerColor : envelopeColor} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Seal */}
        {!isOpen && (
          <mesh position={[0, -1.4, 0.01]}>
            <circleGeometry args={[0.2, 32]} />
            <meshStandardMaterial color={sealColor} metalness={0.8} roughness={0.2} />
          </mesh>
        )}
      </group>

      {/* Interaction Text */}
      {!isOpen && (
        <Text
          position={[0, -2, 0]}
          fontSize={0.2}
          color="#ffb6c1"
          anchorX="center"
          anchorY="middle"
        >
          {hovered ? "Tap to Bloom 🌸" : "A special letter awaits..."}
        </Text>
      )}

      {/* Inner Glow */}
      {isOpen && (
        <pointLight position={[0, 0, 0.2]} intensity={3} color={currentColors.light} distance={3} />
      )}

      {/* Outer Pulse Glow (Visible when hovered or open) */}
      {(hovered || isOpen) && (
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[4.4, 3.2]} />
          <meshBasicMaterial 
            color={isOpen ? currentColors.pulse : "#ffb6c1"} 
            transparent 
            opacity={0.2} 
          />
        </mesh>
      )}
    </group>
  );
};

export default FloatingEnvelope;
