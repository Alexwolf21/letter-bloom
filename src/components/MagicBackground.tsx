"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./MagicBackground.module.css";

const MagicBackground = () => {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    // Generate random stars on mount
    const newStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 2 + 1,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className={styles.container}>
      {/* Background Gradients */}
      <div className={styles.glow1} />
      <div className={styles.glow2} />
      <div className={styles.glow3} />

      {/* Stars */}
      <div className={styles.starsContainer}>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className={styles.star}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + star.delay,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Atmospheric Fog/Overlay */}
      <div className={styles.overlay} />
    </div>
  );
};

export default MagicBackground;
