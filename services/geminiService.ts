
import { GoogleGenAI, Type } from "@google/genai";
import { GithubRepo, ChatMessage, TaskItem } from '../types';

export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCommitMessage = async (message: string, language: string): Promise<string> => {
  try {
    const prompt = `Analyze the following git commit message to determine the likely development environment or tool it originated from. Look for keywords like "AI Studio", "Codex", "Claude", "VS Code", "GitHub Desktop", "JetBrains", "Copilot". If you are uncertain, respond with "Unknown". Respond with only the name of the tool or environment. Respond in ${language}.

Commit Message: "${message}"`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });

    const text = response.text.trim();
    return text || "Unknown";
  } catch (error) {
    console.error("Error analyzing commit message with Gemini:", error);
    return "Analysis Failed";
  }
};

export const summarizeProject = async (name: string, description: string, latestCommit: string, readme: string | null, language: string): Promise<string> => {
    try {
        const readmeContext = readme ? `\nProject README (truncated): ${readme.slice(0, 1500)}...` : '';
        
        const prompt = `As a senior software engineer creating a portfolio, write a concise, one-paragraph summary for the following project. Highlight its purpose, key technologies, and potential use case. Base the summary on the project name, description, latest commit message, and the README content provided. Respond in ${language}.

Project Name: ${name}
Description: ${description}
Latest Commit: "${latestCommit}"${readmeContext}

Summary:`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt
        });

        const text = response.text.trim();
        return text || "Could not generate a summary.";
    } catch (error) {
        console.error("Error summarizing project with Gemini:", error);
        return "AI summary generation failed.";
    }
};

export const generateProjectShowcase = async (repo: GithubRepo, readme: string | null, language: string): Promise<string> => {
    try {
        const readmeContext = readme ? `\nREADME Context: ${readme.slice(0, 2000)}` : '';
        const prompt = `You are a professional technical recruiter and career coach. Write a highly professional resume-style summary for the following GitHub project. 

Use the STAR method (Situation, Task, Action, Result) if possible. Focus on:
1. The problem the project solves.
2. The core technical stack used.
3. Key features and engineering achievements.
4. The professional value this project demonstrates.

The response should be formatted in Markdown, suitable for a "Projects" section on a resume or a LinkedIn profile.

Project: ${repo.name}
Description: ${repo.description || 'N/A'}
Language: ${repo.language || 'N/A'}
${readmeContext}

Respond in ${language}.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt
        });

        return response.text.trim() || "Could not generate showcase.";
    } catch (error) {
        console.error("Error generating project showcase:", error);
        return "Failed to generate professional showcase.";
    }
};

export const getPortfolioAnalysis = async (repos: GithubRepo[], language: string): Promise<string> => {
    try {
        const repoSummaries = repos.map(repo => ({
            name: repo.name,
            description: repo.description,
            language: repo.language,
            lastUpdate: repo.pushed_at,
        })).slice(0, 50);

        const prompt = `You are a senior tech career advisor and GitHub expert. I will provide you with a list of my GitHub projects.

Analyze this list to understand my technical skills, primary focus areas (e.g., frontend, backend, data science, mobile), and overall project direction.

Based on your analysis, please provide:
1.  A concise summary of my developer profile and probable career specialization.
2.  A list of 3-5 concrete and actionable suggestions for future projects or technical skills to learn. These suggestions should complement my existing skill set and help my career growth.
3.  A short, actionable to-do list (2-3 items) suggesting next steps for existing projects, especially those that haven't been updated recently.

Format your response in Markdown with clear headings for each section.

Respond in ${language}.

Here is the list of my projects:
${JSON.stringify(repoSummaries, null, 2)}
`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt
        });

        const text = response.text.trim();
        return text || "Could not generate portfolio analysis.";
    } catch (error) {
        console.error("Error generating portfolio analysis:", error);
        return "An error occurred while generating the AI-powered career insight.";
    }
}

export const generateTaskList = async (repo: GithubRepo, latestCommit: string, language: string): Promise<TaskItem[]> => {
    try {
        const prompt = `Based on the following GitHub project details, generate a concise to-do list of 3-5 actionable next steps to improve it. Focus on improving documentation, adding tests, refactoring specific parts, or suggesting a new feature. Respond in ${language}.

Project Name: ${repo.name}
Description: ${repo.description || 'N/A'}
Primary Language: ${repo.language || 'N/A'}
Latest Commit: "${latestCommit}"`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            text: {
                                type: Type.STRING,
                                description: 'The suggested task or to-do item.'
                            },
                        },
                        required: ["text"],
                    },
                },
            },
        });

        const jsonStr = response.text.trim();
        if (!jsonStr) {
            return [];
        }
        
        const parsedTasks: {text: string}[] = JSON.parse(jsonStr);
        return parsedTasks.map(task => ({ ...task, completed: false }));

    } catch (error) {
        console.error("Error generating task list with Gemini:", error);
        return [
            { text: "Failed to generate AI-powered tasks. Check console for details.", completed: false },
        ];
    }
};
