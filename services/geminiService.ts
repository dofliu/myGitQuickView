
import { GoogleGenAI } from "@google/genai";
import { GithubRepo, ChatMessage } from '../types';

// FIX: Aligned with @google/genai coding guidelines.
// The API key is sourced directly from process.env.API_KEY, and the client is initialized once.
// Redundant checks for the API key are removed, assuming it's configured in the environment.
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCommitMessage = async (message: string, language: string): Promise<string> => {
  try {
    const prompt = `Analyze the following git commit message to determine the likely development environment or tool it originated from. Look for keywords like "AI Studio", "Codex", "Claude", "VS Code", "GitHub Desktop", "JetBrains", "Copilot". If you are uncertain, respond with "Unknown". Respond with only the name of the tool or environment. Respond in ${language}.

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

export const summarizeProject = async (name: string, description: string, latestCommit: string, language: string): Promise<string> => {
    try {
        const prompt = `As a senior software engineer creating a portfolio, write a concise, one-paragraph summary for the following project. Highlight its purpose, key technologies, and potential use case. Base the summary on the project name, its description, and the latest commit message. Respond in ${language}.

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

export const getPortfolioAnalysis = async (repos: GithubRepo[], language: string): Promise<string> => {
    try {
        const repoSummaries = repos.map(repo => ({
            name: repo.name,
            description: repo.description,
            language: repo.language,
            lastUpdate: repo.pushed_at,
        })).slice(0, 50); // Use the 50 most recently pushed repos

        const prompt = `You are a senior tech career advisor and GitHub expert. I will provide you with a list of my GitHub projects.

Analyze this list to understand my technical skills, primary focus areas (e.g., frontend, backend, data science, mobile), and overall project direction.

Based on your analysis, please provide:
1.  A concise summary of my developer profile and probable career specialization.
2.  A list of 3-5 concrete and actionable suggestions for future projects or technical skills to learn. These suggestions should complement my existing skill set and help my career growth.

Format your response in Markdown with clear headings.

Respond in ${language}.

Here is the list of my projects:
${JSON.stringify(repoSummaries, null, 2)}
`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt
        });

        const text = response.text.trim();
        return text || "Could not generate portfolio analysis.";
    } catch (error) {
        console.error("Error generating portfolio analysis:", error);
        return "An error occurred while generating the AI-powered career insight.";
    }
}

export const getAiTasks = async (repos: GithubRepo[], chatHistory: ChatMessage[], language: string): Promise<string> => {
    try {
        const repoSummaries = repos.map(repo => ({
            name: repo.name,
            lastUpdate: repo.pushed_at,
        })).slice(0, 20);

        const prompt = `You are a friendly and proactive AI project manager assistant integrated into a GitHub dashboard. Your goal is to help the user stay productive and engaged with their projects.

I will provide you with:
1. A list of the user's most recent GitHub repositories, including their last update time.
2. Our previous conversation history.

Based on this information, please generate a short, actionable to-do list (2-4 items max) of what the user could work on next. Your suggestions should be:
- **Proactive**: Identify projects that haven't been updated in a while and suggest a small next step.
- **Contextual**: Refer back to topics from our previous conversation. If we discussed a new feature for a project, remind them about it.
- **Encouraging**: Use a positive and motivational tone.
- **Concise**: Keep each task item brief and to the point.

Format your response as a Markdown list. If there is not enough information or no clear next steps, respond with a single encouraging sentence about reviewing their projects.

Respond in ${language}.

Here is the user's project data:
${JSON.stringify(repoSummaries, null, 2)}

Here is our previous conversation history:
${JSON.stringify(chatHistory, null, 2)}
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error generating AI tasks:", error);
        return "Could not generate task suggestions at this time.";
    }
};
