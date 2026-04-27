"use client";

import React, { useState } from "react";
import MagicBackground from "@/components/MagicBackground";
import MagicSparkles from "@/components/MagicSparkles";
import Scene from "@/components/Scene";
import LetterArchive from "@/components/LetterArchive";
import styles from "@/app/page.module.css";
import { AnimatePresence, motion } from "framer-motion";
import LetterReveal from "@/components/LetterReveal";
import { Lock, Heart, History } from "lucide-react";
import { verifyGirlfriendPasscode } from "@/app/actions";

interface Letter {
  id: string;
  content: string;
  scheduled_for: string;
}

interface ClientHomeProps {
  initialLetter: string | null;
  pastLetters: Letter[];
}

export default function ClientHome({ initialLetter, pastLetters }: ClientHomeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(initialLetter);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const isValid = await verifyGirlfriendPasscode(passcode);
    if (isValid) {
      setIsAuthorized(true);
    } else {
      alert("Oops! Wrong code. 🌸");
    }
    setLoading(false);
  };

  const handleSelectArchive = (letter: Letter) => {
    setSelectedLetter(letter.content);
    setShowArchive(false);
    setIsOpen(true);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const defaultContent = "My love, today is a beautiful day simply because you are in it. I hope this little bloom makes you smile as much as you make me smile every single day. I love you.";

  return (
    <main className={styles.main}>
      <MagicBackground />
      <MagicSparkles />
      
      <div className={styles.container}>
        <div className={styles.sceneWrapper}>
          <Scene isOpen={isOpen} onOpen={handleOpen} />
        </div>

        <div className={styles.uiOverlay}>
          {!isOpen && isAuthorized && (
            <button 
              onClick={() => setShowArchive(true)} 
              className={styles.archiveButton}
            >
              <History size={16} />
              View Past Memories
            </button>
          )}

          <AnimatePresence>
            {isOpen && (
              <LetterReveal 
                content={selectedLetter || defaultContent}
                onClose={() => {
                  setIsOpen(false);
                  setSelectedLetter(initialLetter);
                }} 
              />
            )}
          </AnimatePresence>
        </div>

        {!isOpen && isAuthorized && (
          <motion.header 
            className={styles.header}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <h1 className="playfair">Love Letter Bloom</h1>
            <p>A magical ritual, just for you.</p>
          </motion.header>
        )}
      </div>
      <AnimatePresence>
        {!isAuthorized && (
          <motion.div 
            className={styles.passcodeOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form 
              className={styles.passcodeCard}
              onSubmit={handlePasscodeSubmit}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Heart className={styles.iconBloom} />
              <h2 className="playfair">A Bloom for You</h2>
              <p>Enter our secret passcode to bloom the letter...</p>
              <input 
                type="password" 
                placeholder="Our secret..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className={styles.passcodeField}
              />
              <button 
                type="submit" 
                disabled={loading}
                className={styles.passcodeBtn}
              >
                {loading ? "Authenticating..." : "Unlock with Love"}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
