
import React from 'react';
import { GithubRepo } from '../types';
import RepoCard from './RepoCard';

interface RepoGridProps {
  repos: GithubRepo[];
  onSelectRepo: (repo: GithubRepo) => void;
}

const RepoGrid: React.FC<RepoGridProps> = ({ repos, onSelectRepo }) => {
  return (
    <div>
        <h2 className="text-2xl font-bold mb-4 text-white">Recent Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {repos.map(repo => (
                <RepoCard key={repo.id} repo={repo} onClick={() => onSelectRepo(repo)} />
            ))}
        </div>
    </div>
  );
};

export default RepoGrid;
