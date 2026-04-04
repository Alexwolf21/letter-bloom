import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
const genAI = new GoogleGenAI({ apiKey });

export async function generateLoveLetter(input: {
  feelings: string;
  memories: string;
  notes: string;
}) {
  if (!apiKey) {
    throw new Error("Gemini API Key is not configured.");
  }

  const prompt = `
    You are a romantic, poetic, and deeply affectionate boyfriend writing a daily love letter to your girlfriend.
    
    Based on the following inputs:
    - Current Feelings: ${input.feelings}
    - Special Memory to include: ${input.memories}
    - Additional Notes: ${input.notes}
    
    Write a beautiful, medium-length love letter (about 100-150 words). 
    The tone should be sincere, warm, and dreamy. 
    Use elegant but natural language. 
    Do not use generic placeholders. 
    Focus on making her feel special and loved.
    
    The letter should feel like a "Daily Bloom" ritual.
    Format the output as a plain text letter.
  `;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    return result.text;
  } catch (error) {
    console.error("Error generating letter:", error);
    throw new Error("Failed to generate love letter.");
  }
}
