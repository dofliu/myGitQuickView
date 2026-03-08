
import React, { useState, useMemo } from 'react';
import { GithubRepo } from '../types';
import RepoCard from './RepoCard';
import { SkeletonRepoGrid } from './Skeleton';
import { useLocalization } from '../contexts/LocalizationContext';

const PAGE_SIZE = 12;

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
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(repos.length / PAGE_SIZE);
  
  const paginatedRepos = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return repos.slice(start, start + PAGE_SIZE);
  }, [repos, currentPage]);
  
  // Reset to page 1 when repos change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [repos.length]);
  
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
  
  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5; // Show up to 5 page numbers
    
    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  return (
    <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">{t('recentProjects')}</h2>
          {totalPages > 1 && (
            <span className="text-sm text-gray-400">
              {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, repos.length)} / {repos.length}
            </span>
          )}
        </div>
        {isLoading ? (
          <SkeletonRepoGrid />
        ) : (
          <>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
                {paginatedRepos.map(repo => (
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
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                >
                  ←
                </button>
                {renderPageNumbers().map((page, idx) => (
                  typeof page === 'number' ? (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded ${currentPage === page ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                    >
                      {page}
                    </button>
                  ) : (
                    <span key={idx} className="px-2 text-gray-500">...</span>
                  )
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
    </div>
  );
};

export default RepoGrid;
