
import React from 'react';
import { GithubRepo } from '../types';
import RepoCard from './RepoCard';
import { SkeletonRepoGrid } from './Skeleton';
import { useLocalization } from '../contexts/LocalizationContext';

interface RepoGridProps {
  repos: GithubRepo[];
  onSelectRepo: (repo: GithubRepo) => void;
  pinnedRepoIds: number[];
  onTogglePin: (repoId: number) => void;
  selectedForShowcaseIds: number[];
  onToggleShowcase: (repoId: number) => void;
  isLoading?: boolean;
  searchTerm?: string;
}

const RepoGrid: React.FC<RepoGridProps> = ({ repos, onSelectRepo, pinnedRepoIds, onTogglePin, selectedForShowcaseIds, onToggleShowcase, isLoading, searchTerm }) => {
  const { t } = useLocalization();
  
  // Empty state
  if (!isLoading && repos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4">{searchTerm ? '🔍' : '📂'}</div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          {searchTerm ? t('noProjectsFound') : t('noRepositories')}
        </h3>
        <p className="text-gray-500 text-sm">
          {searchTerm ? t('noProjectsFoundHint') : t('noRepositoriesHint')}
        </p>
      </div>
    );
  }
  
  return (
    <div>
        <h2 className="text-2xl font-bold mb-4 text-white">{t('recentProjects')}</h2>
        {isLoading ? (
          <SkeletonRepoGrid />
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
              {repos.map(repo => (
                  <RepoCard 
                      key={repo.id} 
                      repo={repo} 
                      onClick={() => onSelectRepo(repo)}
                      isPinned={pinnedRepoIds.includes(repo.id)}
                      onTogglePin={() => onTogglePin(repo.id)}
                      isSelected={selectedForShowcaseIds.includes(repo.id)}
                      onToggleShowcase={() => onToggleShowcase(repo.id)}
                  />
              ))}
          </div>
        )}
    </div>
  );
};

export default RepoGrid;
