"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const HeartParticles = () => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 60,
      y: 50 + (Math.random() - 0.5) * 60,
      size: Math.random() * 20 + 10,
      duration: Math.random() * 2 + 1.5,
      delay: Math.random() * 0.5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 15 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: "50%", y: "50%", scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            x: `${p.x}%`,
            y: `${p.y - 40}%`,
            scale: [0, 1, 0.5],
            rotate: [0, Math.random() * 90 - 45],
          }}
          transition={{ 
            duration: p.duration, 
            delay: p.delay,
            ease: "easeOut",
          }}
          style={{ position: "absolute", color: "hsla(340, 80%, 65%, 0.8)" }}
        >
          <Heart size={p.size} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
};

export default HeartParticles;
