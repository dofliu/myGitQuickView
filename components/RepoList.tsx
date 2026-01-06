
import React from 'react';
import { GithubRepo } from '../types';
import { LockIcon } from './icons/LockIcon';
import { PinIcon } from './icons/PinIcon';
import { useLocalization } from '../contexts/LocalizationContext';

interface RepoListProps {
  repos: GithubRepo[];
  selectedRepo: GithubRepo | null;
  onSelectRepo: (repo: GithubRepo) => void;
  pinnedRepoIds: number[];
  onTogglePin: (repoId: number) => void;
  selectedForShowcaseIds: number[];
  onToggleShowcase: (repoId: number) => void;
}

const RepoList: React.FC<RepoListProps> = ({ repos, selectedRepo, onSelectRepo, pinnedRepoIds, onTogglePin, selectedForShowcaseIds, onToggleShowcase }) => {
  const { t } = useLocalization();
  return (
    <ul className="space-y-1">
      {repos.map(repo => {
        const isPinned = pinnedRepoIds.includes(repo.id);
        const isSelected = selectedForShowcaseIds.includes(repo.id);
        
        return (
            <li key={repo.id} className="group flex items-center">
                <div className="flex items-center pl-2">
                    <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => onToggleShowcase(repo.id)}
                        className="h-3.5 w-3.5 rounded border-gray-600 text-cyan-500 bg-gray-800 focus:ring-cyan-500 cursor-pointer"
                    />
                </div>
                <button
                    onClick={() => onSelectRepo(repo)}
                    className={`flex-grow text-left pl-3 pr-2 py-2 rounded-l-md transition-colors duration-200 text-sm flex items-center justify-between ${
                    selectedRepo?.id === repo.id
                        ? 'bg-cyan-500/10 text-cyan-300 font-semibold'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                    <span className="flex-1 mr-2 truncate">{repo.name}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {repo.private && (
                            <span title={t('privateRepo')} className="text-yellow-400/80">
                                <LockIcon className="h-3.5 w-3.5" />
                            </span>
                        )}
                         {isPinned && <PinIcon className="h-3.5 w-3.5 text-cyan-400" solid />}
                    </div>
                </button>
                 <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(repo.id);
                    }}
                    title={isPinned ? t('unpinRepo') : t('pinRepo')}
                    className={`p-2 rounded-r-md transition-colors duration-200 ${
                         selectedRepo?.id === repo.id ? 'bg-cyan-500/10' : ''
                    } ${isPinned ? 'text-cyan-400' : 'text-gray-600 group-hover:text-gray-400 group-hover:bg-gray-800'}`}
                >
                   <PinIcon className="h-3.5 w-3.5" solid={isPinned} />
                </button>
            </li>
        );
      })}
    </ul>
  );
};

export default RepoList;
