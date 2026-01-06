
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
  isSelected: boolean;
  onToggleShowcase: () => void;
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

const RepoCard: React.FC<RepoCardProps> = ({ repo, onClick, isPinned, onTogglePin, isSelected, onToggleShowcase }) => {
  const { t } = useLocalization();

  const description = repo.description ? 
    (repo.description.length > 100 ? repo.description.slice(0, 100) + '...' : repo.description)
    : t('noDescription');
  
  const langColor = repo.language ? languageColorMap[repo.language] || 'bg-gray-700 text-gray-300' : 'bg-gray-700 text-gray-300';
  
  const cardClasses = `
    relative bg-gray-800/60 rounded-xl p-5 border
    hover:border-cyan-500/50 cursor-pointer transition-all duration-300 ease-in-out 
    transform hover:-translate-y-1 flex flex-col justify-between h-full group
    ${isSelected ? 'ring-2 ring-cyan-500 border-cyan-500/80 bg-cyan-500/5' : isPinned ? 'border-cyan-500/60 ring-2 ring-cyan-500/10' : 'border-gray-700/80'}
  `;

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePin();
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleShowcase();
  };

  return (
    <div onClick={onClick} className={cardClasses}>
        <div 
            onClick={handleSelectClick}
            className={`absolute -top-2 -left-2 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all z-10 ${
                isSelected ? 'bg-cyan-500 border-cyan-400 text-white' : 'bg-gray-800 border-gray-600 text-transparent hover:border-cyan-500'
            }`}
        >
            {isSelected && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            )}
        </div>

        <div>
            <div className="flex items-start justify-between mb-3 gap-2">
                <h3 className="font-bold text-white text-lg flex-1 break-words leading-tight">{repo.name}</h3>
                <div className="flex items-center flex-shrink-0 gap-1.5">
                    {repo.private && (
                        <span title={t('privateRepo')} className="text-yellow-400/80">
                            <LockIcon className="h-4 w-4" />
                        </span>
                    )}
                    <button onClick={handlePinClick} title={isPinned ? t('unpinRepo') : t('pinRepo')} className={`transition-colors duration-200 p-1 rounded-full ${isPinned ? 'text-cyan-400' : 'text-gray-600 hover:text-gray-400'}`}>
                         <PinIcon className="h-4 w-4" solid={isPinned} />
                    </button>
                </div>
            </div>
            <p className="text-gray-400 text-sm mb-4 h-16 break-words overflow-hidden">{description}</p>
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700/50">
           {repo.language && (
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${langColor}`}>{repo.language}</span>
           )}
           <span className="text-[10px] text-gray-500 font-mono">
               {new Date(repo.pushed_at).toLocaleDateString()}
           </span>
        </div>
    </div>
  );
};

export default RepoCard;
