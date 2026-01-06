
import React, { useState, useEffect, useCallback } from 'react';
import { GithubRepo, GithubUser, CommitInfo, ContributionData, BranchDetails, FilterType } from './types';
import { getAllRepos, getUser, getLatestCommit, getContributionData, getRepoBranches, getReadme } from './services/githubService';
import { analyzeCommitMessage, summarizeProject } from './services/geminiService';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import { LocalizationProvider, useLocalization } from './contexts/LocalizationContext';

const AppContent: React.FC = () => {
  const [pat, setPat] = useState<string | null>(null);
  const [user, setUser] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [contributionData, setContributionData] = useState<ContributionData | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<GithubRepo | null>(null);
  const [selectedForShowcaseIds, setSelectedForShowcaseIds] = useState<number[]>([]); // New Multi-selection state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');

  const { language } = useLocalization();

  const [commitCache, setCommitCache] = useState<{[repoId: number]: {[lang: string]: CommitInfo}}>(() => {
    const savedCache = localStorage.getItem('commitCache');
    return savedCache ? JSON.parse(savedCache) : {};
  });
  
  const [branchCache, setBranchCache] = useState<{[repoId: number]: BranchDetails[]}>({});

  const [pinnedRepoIds, setPinnedRepoIds] = useState<number[]>(() => {
    const savedPins = localStorage.getItem('pinnedRepos');
    return savedPins ? JSON.parse(savedPins) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('commitCache', JSON.stringify(commitCache));
  }, [commitCache]);

  const togglePinRepo = (repoId: number) => {
    const newPinnedIds = pinnedRepoIds.includes(repoId)
      ? pinnedRepoIds.filter(id => id !== repoId)
      : [...pinnedRepoIds, repoId];
    setPinnedRepoIds(newPinnedIds);
    localStorage.setItem('pinnedRepos', JSON.stringify(newPinnedIds));
  };

  const toggleShowcaseSelection = (repoId: number) => {
    setSelectedForShowcaseIds(prev => 
      prev.includes(repoId) ? prev.filter(id => id !== repoId) : [...prev, repoId]
    );
  };

  const handleSignOut = () => {
    setPat(null);
    setUser(null);
    setRepos([]);
    setContributionData(null);
    setSelectedRepo(null);
    setSelectedForShowcaseIds([]);
    setError(null);
    setFilterType('all');
  };

  const fetchData = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await getUser(token);
      setUser(userData);
      const [repoData, contribData] = await Promise.all([
        getAllRepos(token),
        getContributionData(token, userData.login)
      ]);
      repoData.sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());
      setRepos(repoData);
      setContributionData(contribData);
    } catch (err) {
      setError('Failed to fetch data. Please check your Personal Access Token and permissions.');
      handleSignOut();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSetPat = (token: string) => {
    setPat(token);
    fetchData(token);
  };
  
  const handleRefresh = () => {
    if (pat) {
      fetchData(pat);
      setSelectedRepo(null);
      setSelectedForShowcaseIds([]);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      if (selectedRepo && pat) {
        const cachedCommit = commitCache[selectedRepo.id]?.[language];
        const cachedBranches = branchCache[selectedRepo.id];

        if (cachedCommit && cachedBranches && cachedCommit.readme !== undefined) {
          setIsDetailLoading(false);
          return;
        }

        setIsDetailLoading(true);
        try {
          const branchesData = await getRepoBranches(pat, selectedRepo.owner.login, selectedRepo.name);
          const branchDetailPromises = branchesData.map(async (branch) => {
            const branchCommit = await getLatestCommit(pat, selectedRepo.owner.login, selectedRepo.name, branch.name);
            return {
              name: branch.name,
              lastCommit: {
                message: branchCommit?.commit.message || 'No commit message found.',
                date: branchCommit?.commit.author?.date || new Date(0).toISOString(),
              }
            } as BranchDetails;
          });

          const allBranchDetails = await Promise.all(branchDetailPromises);
          allBranchDetails.sort((a, b) => new Date(b.lastCommit.date).getTime() - new Date(a.lastCommit.date).getTime());
          
          const latestBranch = allBranchDetails[0];
          const readmeContent = await getReadme(pat, selectedRepo.owner.login, selectedRepo.name);

          const [source, summary] = await Promise.all([
            analyzeCommitMessage(latestBranch.lastCommit.message, language),
            summarizeProject(selectedRepo.name, selectedRepo.description || '', latestBranch.lastCommit.message, readmeContent, language)
          ]);

          const commitData: CommitInfo = {
            message: latestBranch.lastCommit.message,
            date: latestBranch.lastCommit.date,
            source: source,
            branchName: latestBranch.name,
            aiSummary: summary,
            readme: readmeContent,
          };

          setCommitCache(prev => ({ 
            ...prev, 
            [selectedRepo.id]: { ...prev[selectedRepo.id], [language]: commitData } 
          }));
          
          setBranchCache(prev => ({
            ...prev,
            [selectedRepo.id]: allBranchDetails
          }));

        } catch (err) {
          console.error("Failed to fetch repository details:", err);
          const errorCommitData: CommitInfo = { 
            message: 'Could not fetch latest commit information.', 
            date: new Date().toISOString(), 
            source: 'Unknown', 
            branchName: 'Unknown',
            aiSummary: 'Analysis failed due to an error fetching commit data.',
            readme: null
          };
          setCommitCache(prev => ({
            ...prev,
            [selectedRepo.id]: { ...prev[selectedRepo.id], [language]: errorCommitData }
          }));
          setBranchCache(prev => ({ ...prev, [selectedRepo.id]: [] }));
        } finally {
          setIsDetailLoading(false);
        }
      }
    };
    fetchDetails();
  }, [selectedRepo, pat, language]);

  if (!pat || error) {
    return <AuthScreen onSetPat={handleSetPat} error={error} isLoading={isLoading} />;
  }

  const filteredRepos = repos.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filterType === 'all' ? true :
      filterType === 'private' ? repo.private :
      !repo.private; 
    return matchesSearch && matchesFilter;
  });

  const sortedRepos = [...filteredRepos].sort((a, b) => {
    const aIsPinned = pinnedRepoIds.includes(a.id);
    const bIsPinned = pinnedRepoIds.includes(b.id);
    if (aIsPinned && !bIsPinned) return -1;
    if (!aIsPinned && bIsPinned) return 1;
    return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
  });
  
  const currentCommitInfo = selectedRepo ? commitCache[selectedRepo.id]?.[language] : null;
  const currentBranches = selectedRepo ? branchCache[selectedRepo.id] : null;

  return (
    <Dashboard
      user={user}
      repos={sortedRepos}
      allReposCount={repos}
      contributionData={contributionData}
      selectedRepo={selectedRepo}
      selectedForShowcaseIds={selectedForShowcaseIds}
      commitInfo={currentCommitInfo}
      branches={currentBranches}
      onSelectRepo={setSelectedRepo}
      onToggleShowcaseSelection={toggleShowcaseSelection}
      onRefresh={handleRefresh}
      onSignOut={handleSignOut}
      isLoading={isLoading}
      isDetailLoading={isDetailLoading}
      pinnedRepoIds={pinnedRepoIds}
      onTogglePin={togglePinRepo}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      filterType={filterType}
      onFilterChange={setFilterType}
    />
  );
};

const App: React.FC = () => (
  <LocalizationProvider>
    <AppContent />
  </LocalizationProvider>
)

export default App;
