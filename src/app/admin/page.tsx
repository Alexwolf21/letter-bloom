"use client";

import React, { useState } from "react";
import styles from "./admin.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { PenLine, Send, Lock, Loader2, Sparkles, CheckCircle } from "lucide-react";
import { verifyAdminPasscode } from "@/app/actions";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [step, setStep] = useState(1); // 1: Login, 2: Input, 3: Preview, 4: Success
  const [loading, setLoading] = useState(false);

  // Form State
  const [feelings, setFeelings] = useState("");
  const [memories, setMemories] = useState("");
  const [notes, setNotes] = useState("");
  const [generatedLetter, setGeneratedLetter] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isValid = await verifyAdminPasscode(password);
      if (isValid) {
        setIsAuthorized(true);
        setStep(2);
      } else {
        alert("Oops! That's not the secret word. 🌸");
      }
    } catch (err) {
      alert("Verification failed. Please check your configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feelings, memories, notes }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setGeneratedLetter(data.letter);
      setStep(3);
    } catch (err) {
      alert("Failed to bloom the letter. Check your Gemini API key! 🥀");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (immediate: boolean = false) => {
    setLoading(true);
    try {
      const response = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          content: generatedLetter,
          immediate: immediate
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setStep(4);
    } catch (err) {
      alert("Failed to schedule the letter. 🥀");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className={styles.adminOverlay}>
        <motion.div 
          className={styles.loginCard}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Lock className={styles.icon} />
          <h2 className="playfair">Admin Access</h2>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Enter the secret word..." 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
            <button type="submit" className={styles.button}>Enter</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <h1 className="playfair">Admin Dashboard</h1>
        <p>Crafting tomorrow&apos;s bloom...</p>
      </header>

      <main className={styles.main}>
        <AnimatePresence mode="wait">
          {step === 2 && (
            <motion.form 
              key="input"
              onSubmit={handleGenerate}
              className={styles.form}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className={styles.inputGroup}>
                <label>How do you feel today?</label>
                <textarea 
                  required
                  placeholder="Warm, excited, missing her..."
                  value={feelings}
                  onChange={(e) => setFeelings(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>A special memory to include?</label>
                <textarea 
                  required
                  placeholder="The way she laughed at dinner..."
                  value={memories}
                  onChange={(e) => setMemories(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Any additional notes/words?</label>
                <textarea 
                  placeholder="I'll see you in 2 days!"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <button type="submit" disabled={loading} className={styles.primaryButton}>
                {loading ? <Loader2 className={styles.spin} /> : <Sparkles size={20} />}
                {loading ? "Blooming..." : "Generate Poetic Letter"}
              </button>
            </motion.form>
          )}

          {step === 3 && (
            <motion.div 
              key="preview"
              className={styles.preview}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="playfair">Preview</h2>
              <div className={styles.letterPreview}>
                <p>{generatedLetter}</p>
              </div>
              <div className={styles.buttonStack}>
                <button onClick={() => setStep(2)} className={styles.secondaryButton}>Edit Seeds</button>
                <div className={styles.buttonGroup}>
                  <button onClick={() => handlePublish(false)} disabled={loading} className={styles.scheduleButton}>
                    {loading ? <Loader2 className={styles.spin} /> : <CheckCircle size={20} />}
                    Schedule for Tomorrow
                  </button>
                  <button onClick={() => handlePublish(true)} disabled={loading} className={styles.primaryButton}>
                    {loading ? <Loader2 className={styles.spin} /> : <Send size={20} />}
                    Bloom Immediately
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="success"
              className={styles.success}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle className={styles.successIcon} />
              <h2 className="playfair">Letter Scheduled!</h2>
              <p>Your bloom will be waiting for her tomorrow morning.</p>
              <button onClick={() => {
                setStep(2);
                setFeelings("");
                setMemories("");
                setNotes("");
              }} className={styles.primaryButton}>Write Another</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
