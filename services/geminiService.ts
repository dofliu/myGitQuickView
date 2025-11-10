
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

export const summarizeProject = async (name: string, description: string, latestCommit: string): Promise<string> => {
    try {
        const prompt = `As a senior software engineer creating a portfolio, write a concise, one-paragraph summary for the following project. Highlight its purpose, key technologies, and potential use case. Base the summary on the project name, its description, and the latest commit message.

Project Name: ${name}
Description: ${description}
Latest Commit: "${latestCommit}"

Summary:`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        const text = response.text.trim();
        return text || "Could not generate a summary.";
    } catch (error) {
        console.error("Error summarizing project with Gemini:", error);
        return "AI summary generation failed.";
    }
};
