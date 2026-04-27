"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, History, Heart } from "lucide-react";
import styles from "@/app/page.module.css";

interface Letter {
  id: string;
  content: string;
  scheduled_for: string;
  is_favorite: boolean;
  mood: string;
}

interface LetterArchiveProps {
  letters: Letter[];
  onSelect: (letter: Letter) => void;
  isOpen: boolean;
  onClose: () => void;
}

const LetterArchive = ({ letters, onSelect, isOpen, onClose }: LetterArchiveProps) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      className={styles.archiveOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.archiveContent}>
        <div className={styles.archiveHeader}>
          <div className={styles.archiveTitle}>
            <History size={24} />
            <h2>Past Memories</h2>
          </div>
          <button onClick={onClose} className={styles.closeButton}>Close</button>
        </div>

        <div className={styles.archiveList}>
          {letters.length === 0 ? (
            <p className={styles.emptyMessage}>No past letters yet. Each day will add a new memory here. 🌸</p>
          ) : (
            letters.map((letter) => {
              const date = new Date(letter.scheduled_for).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              });

              return (
                <motion.button
                  key={letter.id}
                  className={styles.archiveItem}
                  whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                  onClick={() => onSelect(letter)}
                >
                  <Calendar size={18} />
                  <span>{date}</span>
                  {letter.is_favorite && (
                    <Heart size={14} fill="currentColor" style={{ marginLeft: "auto", color: "hsl(var(--accent-rose))" }} />
                  )}
                </motion.button>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LetterArchive;
