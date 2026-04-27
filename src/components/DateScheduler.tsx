"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Check, X, Send, User, ChevronRight } from "lucide-react";
import styles from "./DateScheduler.module.css";

interface DateRequest {
  id: string;
  scheduled_at: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_by: 'bf' | 'gf';
  rejection_reason?: string;
  created_at: string;
}

interface DateSchedulerProps {
  userRole: 'bf' | 'gf';
  isOpen: boolean;
  onClose: () => void;
}

const DateScheduler = ({ userRole, isOpen, onClose }: DateSchedulerProps) => {
  const [activeTab, setActiveTab] = useState<'new' | 'list'>('list');
  const [dates, setDates] = useState<DateRequest[]>([]);
  const [loading, setLoading] = useState(false);
  
  // New Date Form
  const [scheduledAt, setScheduledAt] = useState("");
  const [description, setDescription] = useState("");
  
  // Rejection Form
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (isOpen) fetchDates();
  }, [isOpen]);

  const fetchDates = async () => {
    try {
      const res = await fetch("/api/dates");
      const data = await res.json();
      setDates(data);
    } catch (err) {
      console.error("Failed to fetch dates");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert local datetime-local value to UTC ISO string
      const localDate = new Date(scheduledAt);
      const utcDate = localDate.toISOString();

      const res = await fetch("/api/dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduledAt: utcDate, description, createdBy: userRole }),
      });
      if (res.ok) {
        setScheduledAt("");
        setDescription("");
        setActiveTab('list');
        fetchDates();
      }
    } catch (err) {
      alert("Failed to propose date.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected', reason?: string) => {
    try {
      const res = await fetch(`/api/dates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reason }),
      });
      if (res.ok) {
        setRejectingId(null);
        setRejectionReason("");
        fetchDates();
      }
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.title}>
            <Calendar className={styles.titleIcon} />
            <h2>Date Scheduler</h2>
          </div>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>

        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'list' ? styles.activeTab : ""}`}
            onClick={() => setActiveTab('list')}
          >
            Our Schedule
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'new' ? styles.activeTab : ""}`}
            onClick={() => setActiveTab('new')}
          >
            Propose New Date
          </button>
        </div>

        <div className={styles.content}>
          <AnimatePresence mode="wait">
            {activeTab === 'new' ? (
              <motion.form 
                key="new"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={styles.form}
              >
                <div className={styles.inputGroup}>
                  <label>When is our date?</label>
                  <input 
                    type="datetime-local" 
                    required 
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>What are we doing?</label>
                  <textarea 
                    required 
                    placeholder="Movie night, dinner, a long walk..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={styles.textarea}
                  />
                </div>
                <button type="submit" disabled={loading} className={styles.submitBtn}>
                  {loading ? "Sending..." : "Send Proposal"}
                  <Send size={16} />
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={styles.list}
              >
                {dates.length === 0 ? (
                  <div className={styles.empty}>
                    <Clock size={40} />
                    <p>No dates scheduled yet. Propose one!</p>
                  </div>
                ) : (
                  dates.map(date => (
                    <div key={date.id} className={`${styles.dateCard} ${styles[date.status]}`}>
                      <div className={styles.dateCardHeader}>
                        <div className={styles.dateTime}>
                          <Calendar size={14} />
                          {new Date(date.scheduled_at).toLocaleString([], { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        <span className={`${styles.badge} ${styles[`badge_${date.status}`]}`}>
                          {date.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className={styles.dateDesc}>{date.description}</p>
                      
                      <div className={styles.dateCardFooter}>
                        <div className={styles.proposer}>
                          <User size={14} />
                          Proposed by {date.created_by === userRole ? "You" : (userRole === 'bf' ? "Her" : "Him")}
                        </div>
                        
                        {date.status === 'pending' && date.created_by !== userRole && (
                          <div className={styles.actions}>
                            <button 
                              onClick={() => handleUpdateStatus(date.id, 'approved')}
                              className={styles.approveBtn}
                            >
                              <Check size={16} /> Approve
                            </button>
                            <button 
                              onClick={() => setRejectingId(date.id)}
                              className={styles.rejectBtn}
                            >
                              <X size={16} /> Reject
                            </button>
                          </div>
                        )}
                      </div>

                      {rejectingId === date.id && (
                        <div className={styles.rejectionForm}>
                          <textarea 
                            placeholder="Reason for postponing? (Optional)"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                          />
                          <div className={styles.rejectionActions}>
                            <button onClick={() => setRejectingId(null)}>Cancel</button>
                            <button 
                              className={styles.confirmRejectBtn}
                              onClick={() => handleUpdateStatus(date.id, 'rejected', rejectionReason)}
                            >
                              Confirm Rejection
                            </button>
                          </div>
                        </div>
                      )}

                      {date.status === 'rejected' && date.rejection_reason && (
                        <div className={styles.reasonBox}>
                          <strong>Reason:</strong> {date.rejection_reason}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default DateScheduler;
