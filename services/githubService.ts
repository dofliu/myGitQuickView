
import { GithubUser, GithubRepo, GithubCommit } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

const githubApiFetch = async <T,>(endpoint: string, token: string): Promise<T> => {
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers: {
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

export const getLatestCommit = async (token: string, owner: string, repo: string): Promise<GithubCommit | null> => {
    try {
        const commits = await githubApiFetch<GithubCommit[]>(`/repos/${owner}/${repo}/commits?per_page=1`, token);
        return commits[0] || null;
    } catch (error) {
        console.error(`Could not fetch commits for ${owner}/${repo}:`, error);
        return null;
    }
};
