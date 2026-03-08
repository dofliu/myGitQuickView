
import { GithubUser, GithubRepo, GithubCommit, ContributionData, GithubBranch } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

const githubApiFetch = async <T,>(endpoint: string, token: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Accept': 'application/vnd.github+json',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.statusText}`);
  }
  return response.json();
};


export const getUser = async (token: string): Promise<GithubUser> => {
  return githubApiFetch<GithubUser>('/user', token);
};

export const getAllRepos = async (token: string): Promise<GithubRepo[]> => {
  const repos: GithubRepo[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const currentRepos = await githubApiFetch<GithubRepo[]>(
      `/user/repos?type=all&per_page=${perPage}&page=${page}&sort=pushed`,
      token
    );
    repos.push(...currentRepos);
    if (currentRepos.length < perPage) {
      break;
    }
    page++;
  }
  return repos;
};

export const getLatestCommit = async (token: string, owner: string, repo: string, branchName?: string): Promise<GithubCommit | null> => {
    try {
        const params = new URLSearchParams({ per_page: '1' });
        if (branchName) {
            params.set('sha', branchName);
        }
        const commits = await githubApiFetch<GithubCommit[]>(`/repos/${owner}/${repo}/commits?${params.toString()}`, token);
        return commits[0] || null;
    } catch (error) {
        console.error(`Could not fetch commits for ${owner}/${repo}${branchName ? ` on branch ${branchName}`: ''}:`, error);
        return null;
    }
};

export const getCommits = async (token: string, owner: string, repo: string, perPage: number = 10): Promise<GithubCommit[]> => {
    try {
        const commits = await githubApiFetch<GithubCommit[]>(
            `/repos/${owner}/${repo}/commits?per_page=${perPage}`, 
            token
        );
        return commits;
    } catch (error) {
        console.error(`Could not fetch commits for ${owner}/${repo}:`, error);
        return [];
    }
};

export const getRepoBranches = async (token: string, owner: string, repo: string): Promise<GithubBranch[]> => {
    try {
        return await githubApiFetch<GithubBranch[]>(`/repos/${owner}/${repo}/branches`, token);
    } catch (error) {
        console.error(`Could not fetch branches for ${owner}/${repo}:`, error);
        return [];
    }
}

export const getReadme = async (token: string, owner: string, repo: string): Promise<string | null> => {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Accept': 'application/vnd.github.raw', // Request raw content
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });
        
        if (!response.ok) {
            return null;
        }
        return await response.text();
    } catch (error) {
        console.error(`Could not fetch README for ${owner}/${repo}:`, error);
        return null;
    }
};

export const getContributionData = async (token: string, username: string): Promise<ContributionData> => {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - 3);

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                weekday
              }
            }
          }
        }
      }
    }
  `;

  const response = await githubApiFetch<{ data: { user: { contributionsCollection: { contributionCalendar: ContributionData } } } }>('/graphql', token, {
    method: 'POST',
    body: JSON.stringify({
      query,
      variables: {
        username,
        from: from.toISOString(),
        to: to.toISOString(),
      },
    }),
  });

  return response.data.user.contributionsCollection.contributionCalendar;
};
