import React from 'react';
import { GithubRepo, GithubUser, CommitInfo } from '../types';
import SummaryStats from './SummaryStats';
import RepoList from './RepoList';
import RepoGrid from './RepoGrid';
import RepoDetail from './RepoDetail';
import Header from './Header';

interface DashboardProps {
  user: GithubUser | null;
  repos: GithubRepo[];
  selectedRepo: GithubRepo | null;
  commitInfo: CommitInfo | null;
  onSelectRepo: (repo: GithubRepo | null) => void;
  onRefresh: () => void;
  onSignOut: () => void;
  isLoading: boolean;
  isDetailLoading: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  repos,
  selectedRepo,
  commitInfo,
  onSelectRepo,
  onRefresh,
  onSignOut,
  isLoading,
  isDetailLoading
}) => {
  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-200 font-sans">
      <Header user={user} onRefresh={onRefresh} onSignOut={onSignOut} isLoading={isLoading} />
      
      <main className="flex-grow flex overflow-hidden">
        <aside className="w-72 flex-shrink-0 bg-gray-900 border-r border-gray-800 p-4 overflow-y-auto hidden md:block">
            <h2 className="text-lg font-semibold mb-4 text-cyan-400">Projects</h2>
            <RepoList repos={repos} selectedRepo={selectedRepo} onSelectRepo={onSelectRepo} />
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
              <SummaryStats repos={repos} />
              <RepoGrid repos={repos} onSelectRepo={onSelectRepo} />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;