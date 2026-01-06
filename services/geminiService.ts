
import { GoogleGenAI, Type } from "@google/genai";
import { GithubRepo, TaskItem } from '../types';

// Initialize the Gemini API client using the environment variable API_KEY
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes a commit message to categorize its nature (e.g., Feature, Fix, etc.)
 */
export const analyzeCommitMessage = async (message: string, language: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            // Use gemini-3-flash-preview for simple text categorization
            model: 'gemini-3-flash-preview',
            contents: `Analyze this GitHub commit message and categorize its primary nature (e.g., Feature, Bug Fix, Refactor, Documentation, DevOps, or UI/UX). 
            Message: "${message}"
            Provide ONLY the category name.
            Respond in ${language}.`,
        });
        return response.text.trim() || 'Unknown';
    } catch (error) {
        console.error("Error analyzing commit:", error);
        return 'Unknown';
    }
};

/**
 * Generates a short professional summary of a project based on available metadata.
 */
export const summarizeProject = async (name: string, description: string, lastCommit: string, readme: string | null, language: string): Promise<string> => {
    try {
        const context = `Project: ${name}\nDescription: ${description}\nLast Commit: ${lastCommit}\n${readme ? `README: ${readme.slice(0, 1000)}` : ''}`;
        const response = await ai.models.generateContent({
            // Use gemini-3-flash-preview for concise summarization
            model: 'gemini-3-flash-preview',
            contents: `Provide a concise (2-3 sentences) professional summary of this GitHub project for a portfolio.
            Context:
            ${context}
            Respond in ${language}.`,
        });
        return response.text.trim() || 'No summary available.';
    } catch (error) {
        console.error("Error summarizing project:", error);
        return 'Summary generation failed.';
    }
};

/**
 * Performs a broad analysis of the user's GitHub portfolio to identify core skills and themes.
 */
export const getPortfolioAnalysis = async (repos: GithubRepo[], language: string): Promise<string> => {
    try {
        const repoContext = repos.map(r => `- ${r.name}: ${r.description || 'No description'} (${r.language || 'N/A'})`).slice(0, 30).join('\n');
        const response = await ai.models.generateContent({
            // Use gemini-3-pro-preview for complex reasoning about a portfolio
            model: 'gemini-3-pro-preview',
            contents: `You are a professional technical career consultant. Analyze the following list of GitHub repositories and provide a high-level overview of the developer's skills, specializations, and career trajectory.
            Repositories:
            ${repoContext}
            Provide actionable insights on how to improve this portfolio for job hunting.
            Respond in ${language}.`,
        });
        return response.text.trim() || 'Could not generate portfolio analysis.';
    } catch (error) {
        console.error("Error analyzing portfolio:", error);
        return 'Portfolio analysis failed.';
    }
};

/**
 * Suggests a list of concrete technical next steps for a repository.
 */
export const generateTaskList = async (repo: GithubRepo, lastCommit: string, language: string): Promise<TaskItem[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Suggest 5 concrete technical next steps or tasks for the GitHub project "${repo.name}" based on its description: "${repo.description || 'N/A'}" and its latest commit: "${lastCommit}".
            Respond in ${language}.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            text: { type: Type.STRING, description: 'The task description' },
                            completed: { type: Type.BOOLEAN, description: 'Always false' }
                        },
                        required: ['text', 'completed']
                    }
                }
            }
        });
        
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error generating task list:", error);
        return [];
    }
};

/**
 * Generates a professional project showcase or resume summary for one or more selected projects.
 */
export const generateProjectShowcase = async (repos: GithubRepo[], readmeMap: {[id: number]: string | null}, language: string): Promise<string> => {
    try {
        const isMultiple = repos.length > 1;
        
        let repoContext = "";
        repos.forEach((repo, index) => {
            const readme = readmeMap[repo.id];
            repoContext += `\n--- Project ${index + 1}: ${repo.name} ---\n`;
            repoContext += `Description: ${repo.description || 'N/A'}\n`;
            repoContext += `Language: ${repo.language || 'N/A'}\n`;
            if (readme) repoContext += `README Snippet: ${readme.slice(0, 800)}\n`;
        });

        const prompt = `You are a professional technical recruiter. Write a highly professional ${isMultiple ? 'Experience Section' : 'Resume Summary'} for the following GitHub project(s).

${isMultiple 
    ? "Since multiple projects are selected, synthesize them into a coherent professional theme (e.g., 'Full-stack Developer with focus on AI tools' or 'Data Specialist'). List them as distinct but related achievements." 
    : "Focus deeply on this single project's technical achievements using the STAR method."}

Format the output in clean Markdown with professional headings. Highlight technical skills and results.

Context:
${repoContext}

Respond in ${language}.`;

        const response = await ai.models.generateContent({
            // High-quality content generation task
            model: 'gemini-3-pro-preview',
            contents: prompt
        });

        return response.text.trim() || "Could not generate showcase.";
    } catch (error) {
        console.error("Error generating showcase:", error);
        return "Failed to generate professional showcase.";
    }
};
