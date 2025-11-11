
import React from 'react';
import { GithubRepo } from '../types';
import { LockIcon } from './icons/LockIcon';
import { PinIcon } from './icons/PinIcon';
import { useLocalization } from '../contexts/LocalizationContext';

interface RepoCardProps {
  repo: GithubRepo;
  onClick: () => void;
  isPinned: boolean;
  onTogglePin: () => void;
}

const languageColorMap: { [key: string]: string } = {
    'TypeScript': 'bg-blue-500/20 text-blue-300',
    'JavaScript': 'bg-yellow-500/20 text-yellow-300',
    'Python': 'bg-green-500/20 text-green-300',
    'HTML': 'bg-red-500/20 text-red-300',
    'CSS': 'bg-indigo-500/20 text-indigo-300',
    'Shell': 'bg-gray-500/20 text-gray-300',
    'Jupyter Notebook': 'bg-orange-500/20 text-orange-300',
};

const RepoCard: React.FC<RepoCardProps> = ({ repo, onClick, isPinned, onTogglePin }) => {
  const { t } = useLocalization();

  const description = repo.description ? 
    (repo.description.length > 100 ? repo.description.slice(0, 100) + '...' : repo.description)
    : t('noDescription');
  
  const langColor = repo.language ? languageColorMap[repo.language] || 'bg-gray-700 text-gray-300' : 'bg-gray-700 text-gray-300';
  
  const cardClasses = `
    bg-gray-800/60 rounded-xl p-5 border
    hover:border-cyan-500/50 cursor-pointer transition-all duration-300 ease-in-out 
    transform hover:-translate-y-1 flex flex-col justify-between h-full group
    ${isPinned ? 'border-cyan-500/60 ring-2 ring-cyan-500/20' : 'border-gray-700/80'}
  `;

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card's onClick from firing
    onTogglePin();
  };

  return (
    <div onClick={onClick} className={cardClasses}>
        <div>
            <div className="flex items-start justify-between mb-3 gap-2">
                <h3 className="font-bold text-white text-lg flex-1 break-words">{repo.name}</h3>
                <div className="flex items-center flex-shrink-0 gap-2">
                    {repo.private && (
                        <span title={t('privateRepo')} className="text-yellow-400/80">
                            <LockIcon className="h-5 w-5" />
                        </span>
                    )}
                    <button onClick={handlePinClick} title={isPinned ? t('unpinRepo') : t('pinRepo')} className={`transition-colors duration-200 p-1 rounded-full ${isPinned ? 'text-cyan-400' : 'text-gray-600 group-hover:text-gray-400'}`}>
                         <PinIcon className="h-5 w-5" solid={isPinned} />
                    </button>
                </div>
            </div>
            <p className="text-gray-400 text-sm mb-4 h-16 break-words">{description}</p>
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700/50">
           {repo.language && (
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${langColor}`}>{repo.language}</span>
           )}
           <span className="text-xs text-gray-500">
               {t('updated')} {new Date(repo.pushed_at).toLocaleDateString()}
           </span>
        </div>
    </div>
  );
};

export default RepoCard;
