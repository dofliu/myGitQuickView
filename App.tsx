import React, { useState, useEffect, useCallback } from 'react';
import { GithubRepo, GithubUser, CommitInfo, ContributionData, BranchDetails, GoalItem } from './types';
import { getAllRepos, getUser, getLatestCommit, getContributionData, getRepoBranches } from './services/githubService';
import { analyzeCommitMessage, summarizeProject, generateProjectGoals } from './services/geminiService';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import { LocalizationProvider, useLocalization } from './contexts/LocalizationContext';

const AppContent: React.FC = () => {
  const [pat, setPat] = useState<string | null>(null);
  const [user, setUser] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [contributionData, setContributionData] = useState<ContributionData | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<GithubRepo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { language } = useLocalization();

  const [commitCache, setCommitCache] = useState<{[repoId: number]: {[lang: string]: CommitInfo}}>(() => {
    const savedCache = localStorage.getItem('commitCache');
    return savedCache ? JSON.parse(savedCache) : {};
  });
  
  const [branchCache, setBranchCache] = useState<{[repoId: number]: BranchDetails[]}>({});

  const [goalCache, setGoalCache] = useState<{[repoId: number]: GoalItem[]}> (() => {
    const savedCache = localStorage.getItem('goalCache');
    return savedCache ? JSON.parse(savedCache) : {};
  });
  const [isGeneratingGoals, setIsGeneratingGoals] = useState(false);

  const [pinnedRepoIds, setPinnedRepoIds] = useState<number[]>(() => {
    const savedPins = localStorage.getItem('pinnedRepos');
    return savedPins ? JSON.parse(savedPins) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('commitCache', JSON.stringify(commitCache));
  }, [commitCache]);

  useEffect(() => {
    localStorage.setItem('goalCache', JSON.stringify(goalCache));
  }, [goalCache]);


  const togglePinRepo = (repoId: number) => {
    const newPinnedIds = pinnedRepoIds.includes(repoId)
      ? pinnedRepoIds.filter(id => id !== repoId)
      : [...pinnedRepoIds, repoId];
    setPinnedRepoIds(newPinnedIds);
    localStorage.setItem('pinnedRepos', JSON.stringify(newPinnedIds));
  };

  const handleSignOut = () => {
    setPat(null);
    setUser(null);
    setRepos([]);
    setContributionData(null);
    setSelectedRepo(null);
    setError(null);
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
      handleSignOut(); // Reset state on error
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
    }
  };

  const handleGenerateGoals = async () => {
    if (!selectedRepo) return;
    setIsGeneratingGoals(true);
    try {
        const newGoals = await generateProjectGoals(selectedRepo, language);
        setGoalCache(prev => ({ ...prev, [selectedRepo.id]: newGoals }));
    } catch (error) {
        console.error("Failed to generate goals", error);
    } finally {
        setIsGeneratingGoals(false);
    }
  };

  const handleToggleGoal = (index: number) => {
    if (!selectedRepo) return;
    setGoalCache(prev => {
        const currentGoals = prev[selectedRepo!.id] || [];
        const newGoals = [...currentGoals];
        newGoals[index].completed = !newGoals[index].completed;
        return { ...prev, [selectedRepo!.id]: newGoals };
    });
  };


  useEffect(() => {
    const fetchDetails = async () => {
      if (selectedRepo && pat) {
        const cachedCommit = commitCache[selectedRepo.id]?.[language];
        const cachedBranches = branchCache[selectedRepo.id];

        if (cachedCommit && cachedBranches) {
          setIsDetailLoading(false);
          return;
        }

        setIsDetailLoading(true);
        try {
          const promises = [];

          // Promise for commit details and AI summary
          if (!cachedCommit) {
            promises.push(
              (async () => {
                const latestCommit = await getLatestCommit(pat, selectedRepo.owner.login, selectedRepo.name);
                let commitData: CommitInfo;

                if (latestCommit) {
                  const [source, summary] = await Promise.all([
                    analyzeCommitMessage(latestCommit.commit.message, language),
                    summarizeProject(selectedRepo.name, selectedRepo.description || '', latestCommit.commit.message, language)
                  ]);
                  commitData = {
                    message: latestCommit.commit.message,
                    date: latestCommit.commit.author?.date || new Date().toISOString(),
                    source: source,
                    aiSummary: summary,
                  };
                } else {
                  commitData = { message: 'No commits found for this repository.', date: new Date().toISOString(), source: 'Unknown', aiSummary: 'Could not generate summary as no commit information was found.' };
                }
                setCommitCache(prevCache => ({ ...prevCache, [selectedRepo.id]: { ...prevCache[selectedRepo.id], [language]: commitData } }));
              })()
            );
          }

          // Promise for branch details
          if (!cachedBranches) {
            promises.push(
              (async () => {
                const branchesData = await getRepoBranches(pat, selectedRepo.owner.login, selectedRepo.name);
                const branchDetailsPromises = branchesData
                  .filter(branch => branch.name !== selectedRepo.default_branch)
                  .map(async (branch) => {
                    const branchCommit = await getLatestCommit(pat, selectedRepo.owner.login, selectedRepo.name, branch.name);
                    return {
                      name: branch.name,
                      lastCommit: {
                        message: branchCommit?.commit.message || 'No commit message found.',
                        date: branchCommit?.commit.author?.date || new Date().toISOString(),
                      }
                    } as BranchDetails;
                  });
                const detailedBranches = await Promise.all(branchDetailsPromises);
                setBranchCache(prevCache => ({
                  ...prevCache,
                  [selectedRepo.id]: detailedBranches
                }));
              })()
            );
          }
          
          await Promise.all(promises);

        } catch (err) {
          console.error("Failed to fetch repository details:", err);
           const errorCommitData: CommitInfo = { message: 'Could not fetch latest commit information.', date: new Date().toISOString(), source: 'Unknown', aiSummary: 'Analysis failed due to an error fetching commit data.'};
           setCommitCache(prevCache => ({
              ...prevCache,
              [selectedRepo.id]: { ...prevCache[selectedRepo.id], [language]: errorCommitData }
          }));
          setBranchCache(prev => ({ ...prev, [selectedRepo.id]: [] })); // Set empty array on error
        } finally {
          setIsDetailLoading(false);
        }
      }
    };
    fetchDetails();
  }, [selectedRepo, pat, language, commitCache, branchCache]);


  if (!pat || error) {
    return <AuthScreen onSetPat={handleSetPat} error={error} isLoading={isLoading} />;
  }

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedRepos = [...filteredRepos].sort((a, b) => {
    const aIsPinned = pinnedRepoIds.includes(a.id);
    const bIsPinned = pinnedRepoIds.includes(b.id);
    if (aIsPinned && !bIsPinned) return -1;
    if (!aIsPinned && bIsPinned) return 1;
    return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
  });
  
  const currentCommitInfo = selectedRepo ? commitCache[selectedRepo.id]?.[language] : null;
  const currentBranches = selectedRepo ? branchCache[selectedRepo.id] : null;
  const currentGoals = selectedRepo ? goalCache[selectedRepo.id] : null;

  return (
    <Dashboard
      user={user}
      repos={sortedRepos}
      contributionData={contributionData}
      selectedRepo={selectedRepo}
      commitInfo={currentCommitInfo}
      branches={currentBranches}
      goals={currentGoals}
      onSelectRepo={setSelectedRepo}
      onRefresh={handleRefresh}
      onSignOut={handleSignOut}
      isLoading={isLoading}
      isDetailLoading={isDetailLoading}
      pinnedRepoIds={pinnedRepoIds}
      onTogglePin={togglePinRepo}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      isGeneratingGoals={isGeneratingGoals}
      onGenerateGoals={handleGenerateGoals}
      onToggleGoal={handleToggleGoal}
    />
  );
};

const App: React.FC = () => (
  <LocalizationProvider>
    <AppContent />
  </LocalizationProvider>
)

export default App;
