import React, { useState } from 'react';
import { GithubRepo, GithubUser, CommitInfo, ContributionData } from '../types';
import SummaryStats from './SummaryStats';
import RepoList from './RepoList';
import RepoGrid from './RepoGrid';
import RepoDetail from './RepoDetail';
import Header from './Header';
import ContributionGraph from './ContributionGraph';
import { useLocalization } from '../contexts/LocalizationContext';
import { SearchIcon } from './icons/SearchIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import AiChatModal from './AiChatModal';
import AiTaskList from './AiTaskList';

interface DashboardProps {
  user: GithubUser | null;
  repos: GithubRepo[];
  contributionData: ContributionData | null;
  selectedRepo: GithubRepo | null;
  commitInfo: CommitInfo | null;
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
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

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
              onBack={() => onSelectRepo(null)}
              isLoading={isDetailLoading} 
            />
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                   {contributionData && <ContributionGraph data={contributionData} />}
                </div>
                <div className="lg:col-span-1">
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
                <button 
                  onClick={() => setIsAiModalOpen(true)}
                  disabled={!user}
                  className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  <SparklesIcon className="h-5 w-5" />
                  {t('aiInsight')}
                </button>
              </div>
              
              {user && <AiTaskList repos={repos} user={user} />}

              <RepoGrid repos={repos} onSelectRepo={onSelectRepo} pinnedRepoIds={pinnedRepoIds} onTogglePin={onTogglePin}/>
            </>
          )}
        </div>
      </main>
      <AiChatModal 
        isOpen={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)}
        repos={repos}
        user={user}
      />
    </div>
  );
};

export default Dashboard;