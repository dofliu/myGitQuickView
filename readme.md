# GitHub Project Dashboard

A web application to organize, view, and analyze all your GitHub projects, including private ones. It features a clean dashboard, real-time data fetching, and an AI-powered analysis to determine the development source of the latest commit.

## Features

### Core Features

- **Secure Authentication**: Uses a GitHub Personal Access Token (PAT) which is stored only in your browser for the session.
- **Comprehensive Overview**: At a glance, see the total number of repositories, the public/private split, and a breakdown of the top languages you use.
- **Real-time Data**: A one-click refresh button fetches the latest status of all your repositories.
- **Sorted Project List**: The sidebar lists all projects, sorted by the most recently updated, allowing for quick navigation.
- **Responsive Project Grid**: The main view displays your projects as clean, easy-to-read cards.
- **Detailed Project View**: Click on any project to see details like the last update time, the default branch, and the latest commit message.
- **AI-Powered Commit Analysis**: Leverages the Gemini API to analyze the latest commit message and infer the likely development tool or environment it originated from (e.g., AI Studio, VS Code, Claude).

### Enhanced Features (2026-03-08)

- **Search & Filter**: Search repositories by name, filter by public/private status.
- **Commit History**: View the last 10 commits for each repository.
- **Error Handling**: Detailed error messages for GitHub API errors (rate limit, invalid token, etc.).
- **Loading Skeletons**: Better loading states with skeleton screens.
- **Empty States**: Friendly messages when no repos or commits found.
- **Theme Toggle**: Dark/Light mode switch.
- **Language Distribution Chart**: Interactive Chart.js doughnut chart for language stats.
- **AI Chat Panel**: Ask questions about your portfolio or specific repositories.
- **AI Task List**: Get AI-suggested next steps for each project.
- **Project Spotlight**: AI-generated project summaries for resumes/portfolios.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Chart.js
- Gemini AI API
- GitHub REST API

## Setup and Usage

1. **Get a GitHub Personal Access Token (PAT)**:
    - Go to your [GitHub Token Settings](https://github.com/settings/tokens).
    - Click "Generate new token" > "Generate new token (classic)".
    - Give it a descriptive name (e.g., "Project Dashboard").
    - Select an expiration date.
    - **Crucially, you must select the `repo` scope** to allow the application to access both your public and private repositories.
    - Click "Generate token" and copy the generated key.

2. **Get a Gemini API Key**:
    - This application assumes that a Google AI (Gemini) API key is available as an environment variable (`process.env.API_KEY`). You need to obtain one from [Google AI Studio](https://aistudio.google.com/app/apikey).

3. **Run the Application Locally**:

    ```bash
    npm install
    npm run dev
    ```

    - Open `http://localhost:3000` in your web browser.
    - Paste your GitHub PAT into the input field and click "Connect to GitHub".

4. **Deploy to Google Cloud Run**:
    - Ensure you have the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) installed and authenticated (`gcloud auth login`).
    - Ensure your target project is set (`gcloud config set project <your-project-id>`).
    - Run the following deployment command from the project root. This command uses the provided `Dockerfile` and sets the `GEMINI_API_KEY` for the build process (which Vite requires to inline the key into the static bundle). It also exposes port 8080.

    ```bash
    gcloud run deploy mygitquickview \
      --source . \
      --project gaiforiae \
      --region us-west1 \
      --set-build-env-vars GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE \
      --allow-unauthenticated \
      --port 8080
    ```

    *(Note: Replace `YOUR_GEMINI_API_KEY_HERE` with your actual Google AI Studio API key.)*

## Project Structure

```
myGitQuickView/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard layout
│   ├── RepoGrid.tsx    # Repository grid view
│   ├── RepoDetail.tsx  # Repository detail view
│   ├── SummaryStats.tsx # Statistics with charts
│   └── ...
├── contexts/           # React contexts
│   ├── LocalizationContext.tsx
│   └── ThemeContext.tsx
├── services/           # API services
│   ├── githubService.ts
│   └── geminiService.ts
├── types.ts            # TypeScript types
├── translations.ts     # i18n translations
└── index.html          # Entry point
```

---

# GitHub 專案儀表板

一個用於組織、查看和分析您所有 GitHub 專案（包含私有專案）的網頁應用程式。它提供了一個簡潔的儀表板、即時數據抓取功能，以及一個由 AI 驅動的分析功能，用以判斷最新提交(commit)的開發來源。

## 功能特色

### 核心功能

- **安全驗證**: 使用 GitHub 個人存取權杖 (PAT)，該權杖僅在當前瀏覽器會話期間儲存，不會傳送到任何伺服器。
- **全面總覽**: 一目了然地查看您的專案總數、公開/私有專案的數量，以及您最常使用的程式語言分佈。
- **即時數據**: 只需點擊刷新按鈕，即可獲取所有專案的最新狀態。
- **排序專案清單**: 側邊欄會列出所有專案，並依照最近更新時間排序，方便快速導航。
- **響應式專案網格**: 主畫面以清晰、易於閱讀的卡片形式展示您的專案。
- **詳細專案視圖**: 點擊任何專案即可查看詳細資訊，例如最後更新時間、預設分支以及最新的提交訊息。
- **AI 驅動的提交分析**: 利用 Gemini API 分析最新的提交訊息，推斷其可能的開發工具或環境來源。

### 進階功能 (2026-03-08)

- **搜尋與篩選**: 依專案名稱搜尋，篩選公開/私有狀態
- **提交歷史**: 顯示每個專案最近 10 筆提交記錄
- **錯誤處理**: 詳細的 GitHub API 錯誤訊息
- **載入骨架**: 更好的載入體驗
- **空狀態設計**: 友善的提示訊息
- **主題切換**: 深色/淺色模式
- **語言分布圖表**: Chart.js 互動式圓餅圖
- **AI 對話面板**: 詢問關於您的作品集或特定專案的問題
- **AI 任務清單**: 取得 AI 建議的後續步驟
- **專案精華**: AI 生成的專案摘要，用於履歷或作品集

## 安裝與使用

1. **取得 GitHub 個人存取權杖 (PAT)**:
   - 前往 [GitHub Token 設定](https://github.com/settings/tokens)
   - 點擊 "Generate new token" > "Generate new token (classic)"
   - 選擇 `repo` 權限範圍
   - 產生並複製權杖

2. **取得 Gemini API 金鑰**:
   - 從 [Google AI Studio](https://aistudio.google.com/app/apikey) 取得

3. **本地啟動應用程式**:

   ```bash
   npm install
   npm run dev
   ```

   - 開啟瀏覽器訪問 `http://localhost:3000`
   - 貼上您的 GitHub PAT 並點擊連接

4. **部署到 Google Cloud Run**:
   - 確保已安裝並登入 [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) (`gcloud auth login`)。
   - 確保已設定目標專案 (`gcloud config set project <your-project-id>`)。
   - 在專案根目錄執行以下指令。此指令會使用專案內的 `Dockerfile` 進行建置，並將 `GEMINI_API_KEY` 作為建置環境變數傳入（這對 Vite 打包為靜態檔案是必要的），同時開放 8080 連接埠。

   ```bash
   gcloud run deploy mygitquickview \
     --source . \
     --project gaiforiae \
     --region us-west1 \
     --set-build-env-vars GEMINI_API_KEY=在這裡填入您的_GEMINI_API_KEY \
     --allow-unauthenticated \
     --port 8080
   ```

   *（注意：請將 `在這裡填入您的_GEMINI_API_KEY` 替換為實際的 Google AI Studio API 金鑰。）*
