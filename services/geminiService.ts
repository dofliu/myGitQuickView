
import { GoogleGenAI } from "@google/genai";

// FIX: Aligned with @google/genai coding guidelines.
// The API key is sourced directly from process.env.API_KEY, and the client is initialized once.
// Redundant checks for the API key are removed, assuming it's configured in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCommitMessage = async (message: string): Promise<string> => {
  try {
    const prompt = `Analyze the following git commit message to determine the likely development environment or tool it originated from. Look for keywords like "AI Studio", "Codex", "Claude", "VS Code", "GitHub Desktop", "JetBrains", "Copilot". If you are uncertain, respond with "Unknown". Respond with only the name of the tool or environment.

Commit Message: "${message}"`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    const text = response.text.trim();
    return text || "Unknown";
  } catch (error) {
    console.error("Error analyzing commit message with Gemini:", error);
    return "Analysis Failed";
  }
};
