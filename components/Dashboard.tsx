import React, { useState } from 'react';
import { GithubRepo, GithubUser, CommitInfo, ContributionData, BranchDetails, GoalItem } from '../types';
import SummaryStats from './SummaryStats';
import RepoList from './RepoList';
import RepoGrid from './RepoGrid';
import RepoDetail from './RepoDetail';
import Header from './Header';
import ContributionGraph from './ContributionGraph';
import { useLocalization } from '../contexts/LocalizationContext';
import { SearchIcon } from './icons/SearchIcon';
import AiChatPanel from './AiChatPanel';
import { SparklesIcon } from './icons/SparklesIcon';

interface DashboardProps {
  user: GithubUser | null;
  repos: GithubRepo[];
  allRepos: GithubRepo[];
  contributionData: ContributionData | null;
  selectedRepo: GithubRepo | null;
  commitInfo: CommitInfo | null;
  branches: BranchDetails[] | null;
  goals: GoalItem[] | null;
  onSelectRepo: (repo: GithubRepo | null) => void;
  onRefresh: () => void;
  onSignOut: () => void;
  isLoading: boolean;
  isDetailLoading: boolean;
  pinnedRepoIds: number[];
  onTogglePin: (repoId: number) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  languageFilter: string;
  onLanguageFilterChange: (language: string) => void;
  visibilityFilter: 'all' | 'public' | 'private';
  onVisibilityFilterChange: (filter: 'all' | 'public' | 'private') => void;
  allLanguages: string[];
  isGeneratingGoals: boolean;
  onGenerateGoals: () => void;
  onToggleGoal: (index: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  repos,
  allRepos,
  contributionData,
  selectedRepo,
  commitInfo,
  branches,
  goals,
  onSelectRepo,
  onRefresh,
  onSignOut,
  isLoading,
  isDetailLoading,
  pinnedRepoIds,
  onTogglePin,
  searchTerm,
  onSearchChange,
  languageFilter,
  onLanguageFilterChange,
  visibilityFilter,
  onVisibilityFilterChange,
  allLanguages,
  isGeneratingGoals,
  onGenerateGoals,
  onToggleGoal,
}) => {
  const { t } = useLocalization();
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-200 font-sans">
      <Header user={user} onRefresh={onRefresh} onSignOut={onSignOut} isLoading={isLoading} />
      
      <main className="flex-grow flex overflow-hidden">
        <aside className="w-72 flex-shrink-0 bg-gray-900 border-r border-gray-800 p-4 overflow-y-auto hidden md:block">
            <h2 className="text-lg font-semibold mb-4 text-cyan-400">{t('projects')}</h2>
            <RepoList repos={repos} selectedRepo={selectedRepo} onSelectRepo={onSelectRepo} pinnedRepoIds={pinnedRepoIds} onTogglePin={onTogglePin} />
        </aside>

        <div className="flex-grow p-6 overflow-y-auto min-w-0">
          {selectedRepo ? (
            <RepoDetail 
              repo={selectedRepo} 
              commitInfo={commitInfo}
              branches={branches}
              goals={goals}
              onBack={() => onSelectRepo(null)}
              isLoading={isDetailLoading}
              isGeneratingGoals={isGeneratingGoals}
              onGenerateGoals={onGenerateGoals}
              onToggleGoal={onToggleGoal}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                <div className="xl:col-span-2">
                   {contributionData && <ContributionGraph data={contributionData} />}
                </div>
                <div className="xl:col-span-1">
                  <SummaryStats repos={allRepos} />
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder={t('searchProjects')}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
                  />
                </div>
                <div className="flex-shrink-0 flex items-center gap-2 flex-wrap">
                  <select
                    value={languageFilter}
                    onChange={(e) => onLanguageFilterChange(e.target.value)}
                    className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                  >
                    <option value="all">{t('allLanguages')}</option>
                    {allLanguages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-1 flex">
                    {(['all', 'public', 'private'] as const).map(type => (
                        <button
                          key={type}
                          onClick={() => onVisibilityFilterChange(type)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${visibilityFilter === type ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}
                        >
                          {t(type as 'all' | 'public' | 'private')} 
                        </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <RepoGrid repos={repos} onSelectRepo={onSelectRepo} pinnedRepoIds={pinnedRepoIds} onTogglePin={onTogglePin}/>
            </>
          )}
        </div>
       
        {/* AI Panel Toggle Button */}
        <div className="fixed bottom-6 right-6 z-20">
            <button
                onClick={() => setIsAiPanelOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110"
                aria-label={t('portfolioAdvisor')}
            >
                <SparklesIcon className="h-6 w-6" />
            </button>
        </div>

        {/* AI Panel Modal */}
        {isAiPanelOpen && (
            <div className="fixed inset-0 bg-black/60 z-30 backdrop-blur-sm" onClick={() => setIsAiPanelOpen(false)}>
                <div 
                    className="fixed inset-y-0 right-0 w-full max-w-md bg-gray-900 shadow-xl flex flex-col border-l border-gray-800 animate-slide-in"
                    onClick={(e) => e.stopPropagation()}
                >
                    <AiChatPanel
                        selectedRepo={selectedRepo}
                        repos={allRepos}
                        user={user}
                        commitInfo={commitInfo}
                        onClose={() => setIsAiPanelOpen(false)}
                    />
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;