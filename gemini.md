# Gemini API Integration

This document outlines the various features within the GitHub Project Dashboard that are powered by the Google Gemini API.

---

### 1. Commit Source Analysis

-   **Function**: `analyzeCommitMessage` in `services/geminiService.ts`
-   **Model**: `gemini-2.5-flash`
-   **Purpose**: This function performs a quick analysis of a git commit message to infer the likely development tool or environment it originated from (e.g., "VS Code", "AI Studio", "GitHub Desktop"). It provides users with a small but interesting insight into their workflow patterns.

### 2. AI Project Summary

-   **Function**: `summarizeProject` in `services/geminiService.ts`
-   **Model**: `gemini-2.5-flash`
-   **Purpose**: To help users quickly understand a project's purpose, this function generates a concise, one-paragraph summary. It synthesizes the project's name, description, and latest commit message into a portfolio-ready overview.

### 3. AI Portfolio Advisor & Contextual Chat

-   **Functions**: `getPortfolioAnalysis` (for initial analysis) and the `ai.chats.create` stream in `components/AiChatPanel.tsx`
-   **Model**: `gemini-2.5-pro`
-   **Purpose**: This is the core of the AI assistant.
    -   **Global View**: It first performs a comprehensive analysis of the user's top 50 repositories to provide a developer profile summary, career advice, and project suggestions.
    -   **Contextual Chat**: It then powers a persistent, conversational chat experience. The chat is context-aware, using a `systemInstruction` to prime its role as either a high-level "Career Advisor" or a focused "Project Assistant" when a specific repository is selected.

### 4. AI-Generated Task Lists

-   **Function**: `generateTaskList` in `services/geminiService.ts`
-   **Model**: `gemini-2.5-pro`
-   **Purpose**: To help users overcome developer's block or plan their next steps, this function generates a short, actionable to-do list for a selected project. It uses Gemini's JSON mode (`responseMimeType` and `responseSchema`) to ensure the output is structured and can be directly rendered as a checklist.

### 5. AI-Generated Project Goals

-   **Function**: `generateProjectGoals` in `services/geminiService.ts`
-   **Model**: `gemini-2.5-pro`
-   **Purpose**: This feature acts as an AI project manager. It sets 3 high-level, motivational goals for a project, complete with titles and descriptions. This helps users think about the bigger picture and long-term vision for their work. It also leverages JSON mode for structured output.

---

# Gemini API 整合

本文件概述了 GitHub 專案儀表板中由 Google Gemini API 驅動的各項功能。

---

### 1. 提交來源分析

-   **函式**: `analyzeCommitMessage` (位於 `services/geminiService.ts`)
-   **模型**: `gemini-2.5-flash`
-   **目的**: 此函式對 git 提交訊息進行快速分析，以推斷其可能的開發工具或環境來源（例如 "VS Code"、"AI Studio"、"GitHub Desktop"）。它為使用者提供了一個關於他們工作流程模式的小而有趣的洞察。

### 2. AI 專案摘要

-   **函式**: `summarizeProject` (位於 `services/geminiService.ts`)
-   **模型**: `gemini-2.5-flash`
-   **目的**: 為了幫助使用者快速理解專案目的，此函式會生成一段簡潔的摘要。它將專案的名稱、描述和最新的提交訊息合成為一段適合放入個人作品集的概述。

### 3. AI 作品集顧問與情境式聊天

-   **函式**: `getPortfolioAnalysis` (用於初始分析) 以及 `components/AiChatPanel.tsx` 中的 `ai.chats.create` 串流
-   **模型**: `gemini-2.5-pro`
-   **目的**: 這是 AI 助理的核心功能。
    -   **全域視圖**: 它首先對使用者的前 50 個儲存庫進行全面分析，提供開發者畫像總結、職涯建議和專案建議。
    -   **情境式聊天**: 接著，它驅動一個可持續的對話式聊天體驗。這個聊天具有情境感知能力，透過 `systemInstruction` 來設定其角色，當未選擇特定儲存庫時，它扮演高層次的「職涯顧問」，當選擇了特定儲存庫時，則轉變為專注的「專案助理」。

### 4. AI 生成的任務清單

-   **函式**: `generateTaskList` (位於 `services/geminiService.ts`)
-   **模型**: `gemini-2.5-pro`
-   **目的**: 為了幫助使用者克服開發瓶頸或規劃後續步驟，此函式會為選定的專案生成一個簡短、可操作的待辦事項清單。它利用 Gemini 的 JSON 模式（`responseMimeType` 和 `responseSchema`）來確保輸出是結構化的，可以直接渲染成一個清單。

### 5. AI 生成的專案目標

-   **函式**: `generateProjectGoals` (位於 `services/geminiService.ts`)
-   **模型**: `gemini-2.5-pro`
-   **目的**: 此功能扮演 AI 專案經理的角色。它為專案設定 3 個高層次、具激勵性的目標，並附有標題和描述。這有助於使用者思考他們工作的宏觀藍圖和長期願景。此功能同樣利用 JSON 模式以獲得結構化輸出。
