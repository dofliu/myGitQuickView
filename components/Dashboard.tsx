import React, { useState } from 'react';
import { GithubRepo, GithubUser, CommitInfo, ContributionData, BranchDetails } from '../types';
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
  contributionData: ContributionData | null;
  selectedRepo: GithubRepo | null;
  commitInfo: CommitInfo | null;
  branches: BranchDetails[] | null;
  onSelectRepo: (repo: GithubRepo | null) => void;
  onRefresh: () => void;
  onSignOut: () => void;
  isLoading: boolean;
  isDetailLoading: boolean;
  pinnedRepoIds: number[];
  onTogglePin: (repoId: number) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  repos,
  contributionData,
  selectedRepo,
  commitInfo,
  branches,
  onSelectRepo,
  onRefresh,
  onSignOut,
  isLoading,
  isDetailLoading,
  pinnedRepoIds,
  onTogglePin,
  searchTerm,
  onSearchChange,
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
              onBack={() => onSelectRepo(null)}
              isLoading={isDetailLoading} 
            />
          ) : (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                <div className="xl:col-span-2">
                   {contributionData && <ContributionGraph data={contributionData} />}
                </div>
                <div className="xl:col-span-1">
                  <SummaryStats repos={repos} />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
              </div>
              
              <RepoGrid repos={repos} onSelectRepo={onSelectRepo} pinnedRepoIds={pinnedRepoIds} onTogglePin={onTogglePin}/>
            </>
          )}
        </div>
        {/* Desktop AI Panel */}
        <aside className="w-[450px] flex-shrink-0 bg-gray-900/50 border-l border-gray-800 flex-col hidden lg:flex">
            <AiChatPanel
                selectedRepo={selectedRepo}
                repos={repos}
                user={user}
                commitInfo={commitInfo}
            />
        </aside>

        {/* Mobile AI Panel Toggle Button */}
        <div className="lg:hidden fixed bottom-6 right-6 z-20">
            <button
                onClick={() => setIsAiPanelOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110"
                aria-label={t('portfolioAdvisor')}
            >
                <SparklesIcon className="h-6 w-6" />
            </button>
        </div>

        {/* Mobile AI Panel Modal */}
        {isAiPanelOpen && (
            <div className="lg:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm" onClick={() => setIsAiPanelOpen(false)}>
                <div 
                    className="fixed inset-y-0 right-0 w-full max-w-md bg-gray-900 shadow-xl flex flex-col border-l border-gray-800 animate-slide-in"
                    onClick={(e) => e.stopPropagation()}
                >
                    <AiChatPanel
                        selectedRepo={selectedRepo}
                        repos={repos}
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