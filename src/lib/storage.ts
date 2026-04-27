"use server";

import { supabase } from "./supabase";

export interface Letter {
  id: string;
  content: string;
  scheduled_for: string; // ISO String
  created_at: string;
}

export async function saveLetter(content: string, scheduledFor?: Date) {
  // Default to tomorrow 8 AM if no date is provided
  const targetDate = scheduledFor || (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(8, 0, 0, 0);
    return d;
  })();

  const { data, error } = await supabase
    .from("letters")
    .insert([
      {
        content: content,
        scheduled_for: targetDate.toISOString(),
      }
    ])
    .select();

  if (error) {
    console.error("Supabase Save Error:", error);
    throw new Error("Failed to save letter into database.");
  }

  return data[0];
}

export async function getTodayLetter() {
  const now = new Date().toISOString();

  // Fetch the most recent letter that is NOT in the future
  const { data, error } = await supabase
    .from("letters")
    .select("*")
    .lte("scheduled_for", now)
    .order("scheduled_for", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Supabase Fetch Error:", error);
    return null;
  }

  return data || null;
}

export async function getPastLetters() {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("letters")
    .select("*")
    .lt("scheduled_for", now)
    .order("scheduled_for", { ascending: false });

  if (error) {
    console.error("Supabase Archive Error:", error);
    return [];
  }

  return data || [];
}

export async function deleteOldLetters(days: number = 30) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  
  const { count, error } = await supabase
    .from("letters")
    .delete({ count: "exact" })
    .lt("scheduled_for", cutoff.toISOString());

  if (error) {
    console.error("Housekeeping Error:", error);
    throw error;
  }

  return count;
}
