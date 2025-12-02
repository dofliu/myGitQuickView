
type Translation = {
  [key: string]: string;
};

const en: Translation = {
  // AuthScreen
  dashboardTitle: 'GitHub Project Dashboard',
  authScreenPrompt: 'Enter your Personal Access Token to continue.',
  authenticating: 'Authenticating...',
  connectToGithub: 'Connect to GitHub',
  howToGetToken: 'How to get a Personal Access Token:',
  goTo: 'Go to your',
  githubTokenSettings: 'GitHub Token Settings',
  andClickGenerate: 'and click "Generate new token".',
  recommendFineGrained: 'We recommend using a Fine-grained token for better security.',
  option1Title: 'Option 1: Fine-grained token (Recommended)',
  option1Step1: 'Under "Repository access", select "All repositories".',
  option1Step2: 'Under "Permissions" > "Repository permissions", set the following:',
  contentsPermission: 'Contents',
  readOnly: 'Read-only',
  contentsPermissionReason: '(to read commit history)',
  metadataPermission: 'Metadata',
  metadataPermissionReason: '(to list repositories and details)',
  option1Step3: 'Click "Generate token" and copy the key (starts with `ghs_`).',
  option2Title: 'Option 2: Classic token',
  option2Step1: 'Select "Generate new token (classic)".',
  option2Step2: 'Give it a name and set an expiration date.',
  option2Step3: 'Select the `repo` scope. This is required to access private repositories.',
  option2Step4: 'Click "Generate token" and copy the key (starts with `ghp_`).',
  tokenNotice: "Your token is stored only in your browser for this session and is never sent to any server other than GitHub's.",

  // Header
  refreshData: 'Refresh Data',
  signOut: 'Sign Out',

  // Dashboard
  projects: 'Projects',
  welcome: 'Welcome',
  searchProjects: 'Search projects...',
  
  // Contribution Graph
  contributionsInLast3Months: '{count} contributions in the last 3 months',
  contributionsOnDate: '{count} contributions on {date}',
  noContributionsOnDate: 'No contributions on {date}',

  // SummaryStats
  overview: 'Overview',
  totalRepos: 'Total Repositories',
  publicRepos: 'Public Repositories',
  privateRepos: 'Private Repositories',
  topLanguages: 'Top Languages',

  // RepoGrid & RepoCard
  recentProjects: 'Recent Projects',
  noDescription: 'No description available.',
  updated: 'Updated',
  
  // RepoList & RepoCard Tooltips
  privateRepo: 'Private repository',
  pinRepo: 'Pin repository',
  unpinRepo: 'Unpin repository',
  
  // RepoDetail
  backToProjects: 'Back to Projects',
  viewOnGithub: 'View on GitHub',
  lastUpdated: 'Last Updated',
  defaultBranch: 'Default Branch',
  language: 'Language',
  latestUpdate: 'Latest Update',
  commitMessage: 'Commit Message',
  updateTime: 'Update Time',
  probableSource: 'Probable Source (AI Analyzed)',
  noCommitInfo: 'No commit information available.',
  aiSummary: 'AI-Generated Summary',
  noAiSummary: 'Could not generate AI summary.',
  activeBranches: 'Active Branches',
  noOtherBranches: 'No other active branches found.',
  readme: 'Project README',
  noReadme: 'No README found for this project.',

  // AI Chat Panel
  portfolioAdvisor: 'Portfolio Advisor',
  projectAssistant: 'Project Assistant',
  generatingInsight: 'Generating your insight... The AI is analyzing your projects, this may take a moment.',
  chatPlaceholderGlobal: 'Ask a follow-up about your portfolio...',
  chatPlaceholderRepo: 'Ask about {repoName}...',
  sendMessage: 'Send Message',
  
  // AI Task List
  aiTaskList: 'AI Task List',
  chat: 'Chat',
  tasks: 'Tasks',
  generateTasks: 'Generate Tasks',
  generatingTasks: 'AI is generating tasks...',
  tasksForRepo: 'Get AI-suggested next steps for {repoName}.',
  noTasksGenerated: 'No tasks generated yet.',
  completed: 'Completed',
};

const zhTW: Translation = {
  // AuthScreen
  dashboardTitle: 'GitHub 專案儀表板',
  authScreenPrompt: '請輸入您的個人存取權杖以繼續。',
  authenticating: '驗證中...',
  connectToGithub: '連接到 GitHub',
  howToGetToken: '如何取得個人存取權杖：',
  goTo: '前往您的',
  githubTokenSettings: 'GitHub 權杖設定',
  andClickGenerate: '並點擊「產生新權杖」。',
  recommendFineGrained: '為了獲得更好的安全性，我們建議使用細粒度的權杖。',
  option1Title: '選項 1: 細粒度權杖 (建議)',
  option1Step1: '在「儲存庫存取權限」下，選擇「所有儲存庫」。',
  option1Step2: '在「權限」>「儲存庫權限」下，進行以下設定：',
  contentsPermission: '內容',
  readOnly: '唯讀',
  contentsPermissionReason: '(讀取提交歷史記錄)',
  metadataPermission: '元數據',
  metadataPermissionReason: '(列出儲存庫和詳細資訊)',
  option1Step3: '點擊「產生權杖」並複製金鑰 (以 `ghs_` 開頭)。',
  option2Title: '選項 2: 經典權杖',
  option2Step1: '選擇「產生新權杖 (經典)」。',
  option2Step2: '給它一個名稱並設定到期日期。',
  option2Step3: '選擇 `repo` 範圍。這是存取私有儲存庫所必需的。',
  option2Step4: '點擊「產生權杖」並複製金鑰 (以 `ghp_` 開頭)。',
  tokenNotice: '您的權杖僅儲存在您瀏覽器的此會話中，絕不會傳送到 GitHub 以外的任何伺服器。',

  // Header
  refreshData: '重新整理資料',
  signOut: '登出',

  // Dashboard
  projects: '專案',
  welcome: '歡迎',
  searchProjects: '搜尋專案...',
  
  // Contribution Graph
  contributionsInLast3Months: '最近三個月有 {count} 次貢獻',
  contributionsOnDate: '{date} 有 {count} 次貢獻',
  noContributionsOnDate: '{date} 沒有貢獻',


  // SummaryStats
  overview: '總覽',
  totalRepos: '總儲存庫',
  publicRepos: '公開儲存庫',
  privateRepos: '私有儲存庫',
  topLanguages: '主要語言',

  // RepoGrid & RepoCard
  recentProjects: '最近專案',
  noDescription: '無可用描述。',
  updated: '更新於',
  
  // RepoList & RepoCard Tooltips
  privateRepo: '私有儲存庫',
  pinRepo: '釘選儲存庫',
  unpinRepo: '取消釘選儲存庫',

  // RepoDetail
  backToProjects: '返回專案列表',
  viewOnGithub: '在 GitHub 上查看',
  lastUpdated: '最後更新',
  defaultBranch: '預設分支',
  language: '語言',
  latestUpdate: '最新更新',
  commitMessage: '提交訊息',
  updateTime: '更新時間',
  probableSource: '可能來源 (AI 分析)',
  noCommitInfo: '沒有可用的提交資訊。',
  aiSummary: 'AI 生成的摘要',
  noAiSummary: '無法生成 AI 摘要。',
  activeBranches: '進行中的分支',
  noOtherBranches: '找不到其他進行中的分支。',
  readme: '專案 README',
  noReadme: '此專案找不到 README 文件。',
  
  // AI Chat Panel
  portfolioAdvisor: '組合顧問',
  projectAssistant: '專案助理',
  generatingInsight: '正在為您生成洞察... AI 正在分析您的專案，這可能需要一點時間。',
  chatPlaceholderGlobal: '提出關於您作品集的問題...',
  chatPlaceholderRepo: '詢問關於 {repoName} 的問題...',
  sendMessage: '傳送訊息',

  // AI Task List
  aiTaskList: 'AI 任務清單',
  chat: '聊天',
  tasks: '任務',
  generateTasks: '生成任務',
  generatingTasks: 'AI 正在生成任務...',
  tasksForRepo: '為 {repoName} 獲取 AI 建議的後續步驟。',
  noTasksGenerated: '尚未生成任何任務。',
  completed: '已完成',
};

export const translations = {
  en,
  'zh-TW': zhTW,
};

export type TranslationKey = keyof typeof en;
