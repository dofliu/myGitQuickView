# GitHub Project Dashboard

A web application to organize, view, and analyze all your GitHub projects, including private ones. It features a clean dashboard, real-time data fetching, and an AI-powered analysis to determine the development source of the latest commit.

## Features

-   **Secure Authentication**: Uses a GitHub Personal Access Token (PAT) which is stored only in your browser for the session.
-   **Comprehensive Overview**: At a glance, see the total number of repositories, the public/private split, and a breakdown of the top languages you use.
-   **Real-time Data**: A one-click refresh button fetches the latest status of all your repositories.
-   **Sorted Project List**: The sidebar lists all projects, sorted by the most recently updated, allowing for quick navigation.
-   **Responsive Project Grid**: The main view displays your projects as clean, easy-to-read cards.
-   **Detailed Project View**: Click on any project to see details like the last update time, the default branch, and the latest commit message.
-   **AI-Powered Commit Analysis**: Leverages the Gemini API to analyze the latest commit message and infer the likely development tool or environment it originated from (e.g., AI Studio, VS Code, Claude).

## Setup and Usage

1.  **Get a GitHub Personal Access Token (PAT)**:
    -   Go to your [GitHub Token Settings](https://github.com/settings/tokens).
    -   Click "Generate new token" > "Generate new token (classic)".
    -   Give it a descriptive name (e.g., "Project Dashboard").
    -   Select an expiration date.
    -   **Crucially, you must select the `repo` scope** to allow the application to access both your public and private repositories.
    -   Click "Generate token" and copy the generated key.

2.  **Get a Gemini API Key**:
    -   This application assumes that a Google AI (Gemini) API key is available as an environment variable (`process.env.API_KEY`). You need to obtain one from [Google AI Studio](https://aistudio.google.com/app/apikey).

3.  **Run the Application**:
    -   Open the `index.html` file in your web browser.
    -   Paste your GitHub PAT into the input field and click "Connect to GitHub".
    -   Your dashboard will load with all your repository information.

---

# GitHub 專案儀表板

一個用於組織、查看和分析您所有 GitHub 專案（包含私有專案）的網頁應用程式。它提供了一個簡潔的儀表板、即時數據抓取功能，以及一個由 AI 驅動的分析功能，用以判斷最新提交(commit)的開發來源。

## 功能特性

-   **安全驗證**: 使用 GitHub 個人存取權杖 (PAT)，該權杖僅在當前瀏覽器會話期間儲存，不會傳送到任何伺服器。
-   **全面總覽**: 一目了然地查看您的專案總數、公開/私有專案的數量，以及您最常使用的程式語言分佈。
-   **即時數據**: 只需點擊刷新按鈕，即可獲取所有專案的最新狀態。
-   **排序專案清單**: 側邊欄會列出所有專案，並依照最近更新時間排序，方便快速導航。
-   **響應式專案網格**: 主畫面以清晰、易於閱讀的卡片形式展示您的專案。
-   **詳細專案視圖**: 點擊任何專案即可查看詳細資訊，例如最後更新時間、預設分支以及最新的提交訊息。
-   **AI 驅動的提交分析**: 利用 Gemini API 分析最新的提交訊息，推斷其可能的開發工具或環境來源（例如 AI Studio, VS Code, Claude）。

## 安裝與使用

1.  **取得 GitHub 個人存取權杖 (PAT)**:
    -   前往您的 [GitHub Token 設定頁面](https://github.com/settings/tokens)。
    -   點擊 "Generate new token" > "Generate new token (classic)"。
    -   為權杖取一個描述性的名稱（例如 "Project Dashboard"）。
    -   選擇一個到期日期。
    -   **最關鍵的一步，您必須勾選 `repo` 權限範圍**，以允許應用程式讀取您的公開和私有專案。
    -   點擊 "Generate token" 並複製產生的權杖。

2.  **取得 Gemini API 金鑰**:
    -   本應用程式假設 Google AI (Gemini) 的 API 金鑰已設定為環境變數 (`process.env.API_KEY`)。您需要從 [Google AI Studio](https://aistudio.google.com/app/apikey) 獲取金鑰。

3.  **執行應用程式**:
    -   在您的網頁瀏覽器中打開 `index.html` 檔案。
    -   將您的 GitHub PAT 貼到輸入框中，然後點擊 "Connect to GitHub"。
    -   您的儀表板將會載入並顯示所有專案資訊。
