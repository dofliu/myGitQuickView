import React from 'react';
import { GithubRepo } from '../types';
import { LockIcon } from './icons/LockIcon';

interface RepoListProps {
  repos: GithubRepo[];
  selectedRepo: GithubRepo | null;
  onSelectRepo: (repo: GithubRepo) => void;
}

const RepoList: React.FC<RepoListProps> = ({ repos, selectedRepo, onSelectRepo }) => {
  return (
    <ul className="space-y-1">
      {repos.map(repo => (
        <li key={repo.id}>
          <button
            onClick={() => onSelectRepo(repo)}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 text-sm ${
              selectedRepo?.id === repo.id
                ? 'bg-cyan-500/10 text-cyan-300 font-semibold'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex-1 mr-2">{repo.name}</span>
              {repo.private && (
                <span title="Private repository" className="text-yellow-400/80 flex-shrink-0">
                  <LockIcon className="h-4 w-4" />
                </span>
              )}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default RepoList;