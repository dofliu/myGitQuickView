
import React, { useState, useEffect, useCallback } from 'react';
import { GithubRepo, GithubUser, CommitInfo } from './types';
import { getAllRepos, getUser } from './services/githubService';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import { analyzeCommitMessage } from './services/geminiService';
import { getLatestCommit } from './services/githubService';

const App: React.FC = () => {
  const [pat, setPat] = useState<string | null>(null);
  const [user, setUser] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GithubRepo | null>(null);
  const [commitInfo, setCommitInfo] = useState<CommitInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSignOut = () => {
    setPat(null);
    setUser(null);
    setRepos([]);
    setSelectedRepo(null);
    setCommitInfo(null);
    setError(null);
  };

  const fetchData = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await getUser(token);
      setUser(userData);
      const repoData = await getAllRepos(token);
      repoData.sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());
      setRepos(repoData);
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
      setCommitInfo(null);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      if (selectedRepo && pat) {
        setIsDetailLoading(true);
        setCommitInfo(null);
        try {
          const latestCommit = await getLatestCommit(pat, selectedRepo.owner.login, selectedRepo.name);
          if (latestCommit) {
            const source = await analyzeCommitMessage(latestCommit.commit.message);
            setCommitInfo({
              message: latestCommit.commit.message,
              date: latestCommit.commit.author?.date || new Date().toISOString(),
              source: source,
            });
          } else {
             setCommitInfo({
                message: 'No commits found for this repository.',
                date: new Date().toISOString(),
                source: 'Unknown',
            });
          }
        } catch (err) {
          console.error("Failed to fetch commit details:", err);
          setCommitInfo({
            message: 'Could not fetch latest commit information.',
            date: new Date().toISOString(),
            source: 'Unknown',
          });
        } finally {
          setIsDetailLoading(false);
        }
      }
    };
    fetchDetails();
  }, [selectedRepo, pat]);


  if (!pat || error) {
    return <AuthScreen onSetPat={handleSetPat} error={error} isLoading={isLoading} />;
  }

  return (
    <Dashboard
      user={user}
      repos={repos}
      selectedRepo={selectedRepo}
      commitInfo={commitInfo}
      onSelectRepo={setSelectedRepo}
      onRefresh={handleRefresh}
      onSignOut={handleSignOut}
      isLoading={isLoading}
      isDetailLoading={isDetailLoading}
    />
  );
};

export default App;
