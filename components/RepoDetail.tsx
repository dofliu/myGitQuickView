import React from 'react';
import { GithubRepo, CommitInfo, BranchDetails, GoalItem } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import { SparklesIcon } from './icons/SparklesIcon';

interface RepoDetailProps {
  repo: GithubRepo;
  commitInfo: CommitInfo | null;
  branches: BranchDetails[] | null;
  goals: GoalItem[] | null;
  onBack: () => void;
  isLoading: boolean;
  isGeneratingGoals: boolean;
  onGenerateGoals: () => void;
  onToggleGoal: (index: number) => void;
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-md text-white font-medium">{value}</p>
    </div>
);

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin h-6 w-6 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const RepoDetail: React.FC<RepoDetailProps> = ({ repo, commitInfo, branches, goals, onBack, isLoading, isGeneratingGoals, onGenerateGoals, onToggleGoal }) => {
    const { t } = useLocalization();
    
    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <button onClick={onBack} className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 mb-6 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {t('backToProjects')}
                </button>

                <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-700">
                        <div>
                            <h2 className="text-3xl font-bold text-white break-words">{repo.name}</h2>
                            <p className="text-gray-400 mt-1 break-words">{repo.description || t('noDescription')}</p>
                        </div>
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" 
                        className="mt-4 md:mt-0 flex-shrink-0 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-200 text-sm">
                            {t('viewOnGithub')}
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <DetailItem label={t('lastUpdated')} value={new Date(repo.pushed_at).toLocaleString()} />
                        <DetailItem label={t('defaultBranch')} value={repo.default_branch} />
                        <DetailItem label={t('language')} value={repo.language || 'N/A'} />
                    </div>
                </div>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">{t('latestUpdate')}</h3>
                {isLoading ? (
                    <div className="flex items-center justify-center h-24"><LoadingSpinner /></div>
                ) : commitInfo ? (
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-400">{t('commitMessage')}</p>
                            <p className="text-md text-white bg-gray-900/60 p-3 rounded-md font-mono text-sm whitespace-pre-wrap break-words">{commitInfo.message}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DetailItem label={t('updateTime')} value={new Date(commitInfo.date).toLocaleString()} />
                            <DetailItem label={t('probableSource')} value={
                                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full font-medium">{commitInfo.source}</span>
                            } />
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-400">{t('noCommitInfo')}</p>
                )}
            </div>

             <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">{t('activeBranches')}</h3>
                {isLoading ? (
                    <div className="flex items-center justify-center h-20"><LoadingSpinner /></div>
                ) : branches && branches.length > 0 ? (
                    <ul className="space-y-4">
                        {branches.map(branch => (
                            <li key={branch.name} className="bg-gray-900/60 p-4 rounded-lg border border-gray-700/50">
                                <div className="flex justify-between items-start mb-2 gap-4">
                                    <p className="text-md text-white font-bold font-mono break-all">{branch.name}</p>
                                    <p className="text-xs text-gray-400 flex-shrink-0">{new Date(branch.lastCommit.date).toLocaleDateString()}</p>
                                </div>
                                <p className="text-sm text-gray-300 font-mono bg-gray-800/50 p-2 rounded truncate" title={branch.lastCommit.message}>
                                    {branch.lastCommit.message.split('\n')[0]}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">{t('noOtherBranches')}</p>
                )}
            </div>

            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">{t('aiSummary')}</h3>
                 {isLoading ? (
                    <div className="flex items-center justify-center h-20"><LoadingSpinner /></div>
                ) : commitInfo?.aiSummary ? (
                    <p className="text-gray-300 leading-relaxed">{commitInfo.aiSummary}</p>
                ) : (
                    <p className="text-gray-500">{t('noAiSummary')}</p>
                )}
            </div>
            
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">{t('aiGoals')}</h3>
                {isGeneratingGoals ? (
                     <div className="flex items-center justify-center h-24"><LoadingSpinner /></div>
                ) : goals && goals.length > 0 ? (
                    <ul className="space-y-4">
                        {goals.map((goal, index) => (
                            <li key={index} className="flex items-start bg-gray-900/50 p-4 rounded-lg transition-colors hover:bg-gray-900">
                                <input
                                    type="checkbox"
                                    id={`goal-${index}`}
                                    checked={goal.completed}
                                    onChange={() => onToggleGoal(index)}
                                    className="h-5 w-5 rounded border-gray-600 text-cyan-500 bg-gray-800 focus:ring-cyan-600 cursor-pointer mt-1 flex-shrink-0"
                                />
                                <div className="ml-4">
                                    <label htmlFor={`goal-${index}`} className={`font-semibold ${goal.completed ? 'text-gray-500 line-through' : 'text-white'} cursor-pointer`}>
                                        {goal.title}
                                    </label>
                                    <p className={`text-sm ${goal.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                                        {goal.description}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-gray-400 mb-4">{t('noGoalsGenerated')}</p>
                        <button
                            onClick={onGenerateGoals}
                            disabled={isGeneratingGoals}
                            className="flex items-center gap-2 mx-auto bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                        >
                            <SparklesIcon className="h-5 w-5"/>
                            {t('generateGoals')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RepoDetail;
