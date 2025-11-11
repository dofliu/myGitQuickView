
import React from 'react';
import { GithubRepo } from '../types';
import RepoCard from './RepoCard';
import { useLocalization } from '../contexts/LocalizationContext';

interface RepoGridProps {
  repos: GithubRepo[];
  onSelectRepo: (repo: GithubRepo) => void;
  pinnedRepoIds: number[];
  onTogglePin: (repoId: number) => void;
}

const RepoGrid: React.FC<RepoGridProps> = ({ repos, onSelectRepo, pinnedRepoIds, onTogglePin }) => {
  const { t } = useLocalization();
  return (
    <div>
        <h2 className="text-2xl font-bold mb-4 text-white">{t('recentProjects')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {repos.map(repo => (
                <RepoCard 
                    key={repo.id} 
                    repo={repo} 
                    onClick={() => onSelectRepo(repo)}
                    isPinned={pinnedRepoIds.includes(repo.id)}
                    onTogglePin={() => onTogglePin(repo.id)}
                />
            ))}
        </div>
    </div>
  );
};

export default RepoGrid;
