
export interface GithubUser {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
}

export interface GithubOrg {
  login: string;
  avatar_url: string;
  description: string | null;
}

export interface GithubIssue {
  number: number;
  title: string;
  state: 'open' | 'closed';
  html_url: string;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: {
    name: string;
    color: string;
  }[];
  body: string | null;
}

export interface GithubPull {
  number: number;
  title: string;
  state: 'open' | 'closed' | 'merged';
  html_url: string;
  created_at: string;
  updated_at: string;
  merged_at: string | null;
  user: {
    login: string;
    avatar_url: string;
  };
  head: { ref: string };
  base: { ref: string };
  draft: boolean;
}

export interface GithubRepo {
  id: number;
  name:string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
  };
  html_url: string;
  description: string | null;
  pushed_at: string;
  language: string | null;
  default_branch: string;
}

// Added GithubCommit interface to match the structure returned by GitHub REST API for commit details
export interface GithubCommit {
  sha: string;
  commit: {
    message: string;
    author?: {
      date: string;
      name?: string;
    };
  };
}

export interface ProjectSpotlight {
  coreValue: string;
  technicalChallenges: string[];
  keyFeatures: string[];
  techStack: string[];
}

export interface CommitInfo {
    message: string;
    date: string;
    source: string;
    branchName: string;
    aiSummary?: string;
    readme?: string | null;
    spotlight?: ProjectSpotlight; // New: Depth analysis for showcase
}

export interface ContributionDay {
  contributionCount: number;
  date: string;
  weekday: number;
}

export interface ContributionData {
  totalContributions: number;
  weeks: {
    contributionDays: ContributionDay[];
  }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface GithubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

export interface BranchDetails {
  name: string;
  lastCommit: {
    message: string;
    date: string;
  }
}

export interface TaskItem {
  text: string;
  completed: boolean;
}

export type FilterType = 'all' | 'public' | 'private';
