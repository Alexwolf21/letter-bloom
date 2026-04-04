"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useCursor, Text, Float } from "@react-three/drei";
import * as THREE from "three";

interface FloatingEnvelopeProps {
  isOpen: boolean;
  onOpen: () => void;
}

const FloatingEnvelope = ({ isOpen, onOpen }: FloatingEnvelopeProps) => {
  const [hovered, setHovered] = useState(false);
  const flapRef = useRef<THREE.Group>(null);
  useCursor(hovered && !isOpen);

  // Colors
  const envelopeColor = "#fff5f5";
  const innerColor = "#ffe4e1";
  const sealColor = "#d4af37"; // Gold

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
        <pointLight position={[0, 0, 0.2]} intensity={2} color="#ffd700" distance={2} />
      )}

      {/* Outer Pulse Glow (Visible when hovered or open) */}
      {(hovered || isOpen) && (
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[4.4, 3.2]} />
          <meshBasicMaterial 
            color={isOpen ? "#ffd700" : "#ffb6c1"} 
            transparent 
            opacity={0.15} 
          />
        </mesh>
      )}
    </group>
  );
};

export default FloatingEnvelope;
