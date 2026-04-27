"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Heart } from "lucide-react";
import styles from "./LetterReveal.module.css";
import HeartParticles from "./HeartParticles";

interface LetterRevealProps {
  content: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
  mood?: string;
}

const LetterReveal = ({ content, isFavorite, onToggleFavorite, onClose, mood }: LetterRevealProps) => {
  const [displayText, setDisplayText] = useState("");
  const fullText = content || "My love, I couldn't wait to tell you how much you mean to me. Every day with you is a gift...";
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.overlay}>
      <HeartParticles mood={mood} />
      
      <motion.div 
        className={styles.card}
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 120 }}
      >
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={24} />
        </button>

        <div className={styles.paper}>
          <div className={styles.header}>
            <span className={styles.date}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <div className={styles.headerActions}>
              <button 
                className={`${styles.favoriteBtn} ${isFavorite ? styles.isFavorite : ""}`} 
                onClick={onToggleFavorite}
                title={isFavorite ? "Remove from Favorites" : "Save as Favorite"}
              >
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
              </button>
              <h2 className="playfair">Love Letter</h2>
            </div>
          </div>

          <div className={styles.content}>
            <p className={styles.text}>{displayText}<span className={styles.cursor}>|</span></p>
          </div>

          <div className={styles.footer}>
            <p className="playfair">Always yours,</p>
            <p className={styles.signature}>With all my love</p>
          </div>
        </div>
        
        <div className={styles.sparkleContainer}>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className={styles.sparkleIcon} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LetterReveal;
