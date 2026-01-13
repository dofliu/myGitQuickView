
import { GoogleGenAI, Type } from "@google/genai";
import { GithubRepo, TaskItem, ProjectSpotlight } from '../types';

export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCommitMessage = async (message: string, language: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analyze this GitHub commit message and categorize its primary nature (e.g., Feature, Bug Fix, Refactor, Documentation, DevOps, or UI/UX). 
            Message: "${message}"
            Provide ONLY the category name.
            Respond in ${language}.`,
        });
        return response.text.trim() || 'Unknown';
    } catch (error) {
        return 'Unknown';
    }
};

export const summarizeProject = async (name: string, description: string, lastCommit: string, readme: string | null, language: string): Promise<string> => {
    try {
        const context = `Project: ${name}\nDescription: ${description}\nLast Commit: ${lastCommit}\n${readme ? `README: ${readme.slice(0, 1000)}` : ''}`;
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Provide a concise (2-3 sentences) professional summary of this GitHub project for a portfolio.
            Context:
            ${context}
            Respond in ${language}.`,
        });
        return response.text.trim() || 'No summary available.';
    } catch (error) {
        return 'Summary generation failed.';
    }
};

/**
 * Generates a deep technical spotlight for project showcase.
 */
export const generateProjectSpotlight = async (repo: GithubRepo, readme: string | null, language: string): Promise<ProjectSpotlight> => {
    try {
        const context = `Repo: ${repo.name}\nDescription: ${repo.description}\nLanguage: ${repo.language}\nREADME: ${readme ? readme.slice(0, 1500) : 'N/A'}`;
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        coreValue: { type: Type.STRING, description: 'The main problem this project solves or its primary value.' },
                        technicalChallenges: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Likely technical challenges faced.' },
                        keyFeatures: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Top 3-4 features.' },
                        techStack: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Specific libraries or frameworks used.' }
                    },
                    required: ['coreValue', 'technicalChallenges', 'keyFeatures', 'techStack']
                }
            },
            contents: `Analyze this project and provide a professional spotlight for a portfolio showcase. 
            Identify specific frameworks/tools even if not explicitly listed in metadata.
            Context: ${context}
            Respond in ${language}.`
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("Spotlight error:", error);
        return {
            coreValue: "General purpose project.",
            technicalChallenges: ["Configuration management", "Scaling logic"],
            keyFeatures: ["Functional logic implementation"],
            techStack: [repo.language || "Native Code"]
        };
    }
};

export const getPortfolioAnalysis = async (repos: GithubRepo[], language: string): Promise<string> => {
    try {
        const repoContext = repos.map(r => `- ${r.name}: ${r.description || 'No description'} (${r.language || 'N/A'})`).slice(0, 30).join('\n');
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `You are a professional technical career consultant. Analyze the following list of GitHub repositories and provide a high-level overview of the developer's skills, specializations, and career trajectory.
            Repositories:
            ${repoContext}
            Provide actionable insights on how to improve this portfolio for job hunting.
            Respond in ${language}.`,
        });
        return response.text.trim() || 'Could not generate portfolio analysis.';
    } catch (error) {
        return 'Portfolio analysis failed.';
    }
};

export const generateTaskList = async (repo: GithubRepo, lastCommit: string, language: string): Promise<TaskItem[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Suggest 5 concrete technical next steps for "${repo.name}" based on: "${repo.description || 'N/A'}" and commit: "${lastCommit}".
            Respond in ${language}.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            text: { type: Type.STRING },
                            completed: { type: Type.BOOLEAN }
                        },
                        required: ['text', 'completed']
                    }
                }
            }
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
        return [];
    }
};

export const generateProjectShowcase = async (repos: GithubRepo[], readmeMap: {[id: number]: string | null}, language: string): Promise<string> => {
    try {
        const isMultiple = repos.length > 1;
        let repoContext = "";
        repos.forEach((repo, index) => {
            const readme = readmeMap[repo.id];
            repoContext += `\n--- Project ${index + 1}: ${repo.name} ---\nDescription: ${repo.description || 'N/A'}\nLanguage: ${repo.language || 'N/A'}\n`;
            if (readme) repoContext += `README Snippet: ${readme.slice(0, 800)}\n`;
        });
        const prompt = `Write a professional ${isMultiple ? 'Experience Section' : 'Resume Summary'} for the following GitHub project(s). 
        Format in Markdown. Focus on technical results. 
        Context: ${repoContext}
        Respond in ${language}.`;
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt
        });
        return response.text.trim() || "Could not generate showcase.";
    } catch (error) {
        return "Failed to generate professional showcase.";
    }
};
