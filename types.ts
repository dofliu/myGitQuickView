
export interface GithubUser {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
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

export interface GithubCommit {
    commit: {
        message: string;
        author: {
            date: string;
        } | null;
    };
}

export interface CommitInfo {
    message: string;
    date: string;
    source: string;
    branchName: string; // New field
    aiSummary?: string;
    readme?: string | null;
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
