"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkle } from "lucide-react";

const MagicSparkles = () => {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; delay: number; scale: number }[]>([]);

  useEffect(() => {
    // Generate constant gentle sparkles
    const newSparkles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 80,
      y: 50 + (Math.random() - 0.5) * 80,
      delay: Math.random() * 5,
      scale: Math.random() * 0.5 + 0.3,
    }));
    setSparkles(newSparkles);
  }, []);

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", pointerEvents: "none", zIndex: 12 }}>
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="magic-sparkle"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.4, 0],
            scale: [0, s.scale, 0],
            y: "-100px",
          }}
          transition={{ 
            duration: 4, 
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ 
            position: "absolute", 
            left: `${s.x}%`, 
            top: `${s.y}%`,
            color: "hsl(45, 100%, 75%)",
            filter: "blur(0.5px)",
          }}
        >
          <Sparkle size={20} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
};

export default MagicSparkles;
