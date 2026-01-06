
import React, { useState, useEffect, useRef } from 'react';
import { GithubRepo, ChatMessage, GithubUser, CommitInfo, TaskItem } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import { getPortfolioAnalysis, generateTaskList, generateProjectShowcase } from '../services/geminiService';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ai } from '../services/geminiService';
import { Chat } from '@google/genai';
import { ChecklistIcon } from './icons/ChecklistIcon';
import AiTaskList from './AiTaskList';
import { CloseIcon } from './icons/CloseIcon';
import { StarIcon } from './icons/StarIcon';

interface AiChatPanelProps {
  selectedRepo: GithubRepo | null;
  repos: GithubRepo[];
  user: GithubUser | null;
  commitInfo: CommitInfo | null;
  onClose?: () => void;
  selectedForShowcaseIds?: number[];
}

const LoadingState: React.FC<{ message?: string }> = ({ message }) => {
    const { t } = useLocalization();
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 h-full">
            <SparklesIcon className="h-12 w-12 text-purple-400 animate-pulse mb-4" />
            <p className="text-lg font-semibold text-white">{message || t('generatingInsight')}</p>
        </div>
    );
}

type PanelView = 'chat' | 'tasks' | 'showcase';

const AiChatPanel: React.FC<AiChatPanelProps> = ({ selectedRepo, repos, user, commitInfo, onClose, selectedForShowcaseIds = [] }) => {
  const { t, language } = useLocalization();
  const [isFetchingInitial, setIsFetchingInitial] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [chat, setChat] = useState<Chat | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [view, setView] = useState<PanelView>('chat');

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const [showcaseContent, setShowcaseContent] = useState<string | null>(null);
  const [isGeneratingShowcase, setIsGeneratingShowcase] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const context = selectedRepo ? 'repo' : 'global';
  const hasSelection = selectedForShowcaseIds.length > 0;
  
  const chatStorageKey = user ? (selectedRepo ? `aiChatHistory_repo_${selectedRepo.id}_${user.login}` : `aiChatHistory_global_${user.login}`) : null;
  const taskStorageKey = user && selectedRepo ? `aiTasks_repo_${selectedRepo.id}_${user.login}` : null;
  
  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isStreaming]);

  useEffect(() => {
    setChat(null);
    setChatHistory([]);
    setUserInput('');
    setTasks([]);
    setShowcaseContent(null);
    setView('chat');

    const fetchInitialData = async () => {
      if (chatStorageKey) {
        const savedHistory = localStorage.getItem(chatStorageKey);
        if (savedHistory) {
          setChatHistory(JSON.parse(savedHistory));
        } else if (context === 'global' && repos.length > 0) {
          setIsFetchingInitial(true);
          try {
            const analysis = await getPortfolioAnalysis(repos, language);
            setChatHistory([{ role: 'model', text: analysis }]);
          } catch (error) {
            console.error(error);
            setChatHistory([{ role: 'model', text: 'Sorry, I was unable to generate an analysis.' }]);
          } finally {
            setIsFetchingInitial(false);
          }
        }
      }

      if (taskStorageKey) {
          const savedTasks = localStorage.getItem(taskStorageKey);
          if (savedTasks) setTasks(JSON.parse(savedTasks));
      }
    };
    fetchInitialData();
  }, [selectedRepo, user, language]);

  useEffect(() => {
    if (chatStorageKey && chatHistory.length > 0) localStorage.setItem(chatStorageKey, JSON.stringify(chatHistory));
  }, [chatHistory, chatStorageKey]);
  
  useEffect(() => {
    if (taskStorageKey) localStorage.setItem(taskStorageKey, JSON.stringify(tasks));
  }, [tasks, taskStorageKey]);

  const handleGenerateTasks = async () => {
    if (!selectedRepo || !commitInfo) return;
    setIsGeneratingTasks(true);
    try {
        const newTasks = await generateTaskList(selectedRepo, commitInfo.message, language);
        setTasks(newTasks);
    } catch (error) { console.error(error); } finally { setIsGeneratingTasks(false); }
  };

  const handleGenerateShowcase = async () => {
      let targetRepos: GithubRepo[] = [];
      let readmeMap: {[id: number]: string | null} = {};

      if (selectedRepo) {
          targetRepos = [selectedRepo];
          readmeMap[selectedRepo.id] = commitInfo?.readme || null;
      } else if (hasSelection) {
          targetRepos = repos.filter(r => selectedForShowcaseIds.includes(r.id));
          // Note: readme content for multiple repos might be missing if not viewed yet. 
          // Ideally we fetch them, but for brevity we rely on repo description if missing.
      } else {
          return;
      }

      setIsGeneratingShowcase(true);
      try {
          const content = await generateProjectShowcase(targetRepos, readmeMap, language);
          setShowcaseContent(content);
      } catch (error) { console.error(error); } finally { setIsGeneratingShowcase(false); }
  };

  const handleCopyShowcase = () => {
      if (showcaseContent) {
          navigator.clipboard.writeText(showcaseContent);
          setCopyFeedback(true);
          setTimeout(() => setCopyFeedback(false), 2000);
      }
  };

  const handleToggleTask = (index: number) => {
      setTasks(currentTasks => {
          const newTasks = [...currentTasks];
          newTasks[index].completed = !newTasks[index].completed;
          return newTasks;
      });
  }
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isStreaming) return;

    const newUserMessage: ChatMessage = { role: 'user', text: userInput };
    setChatHistory(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsStreaming(true);

    try {
        let currentChat = chat;
        if (!currentChat) {
            const systemInstruction = selectedRepo
                ? `You are a helpful AI project assistant for the project '${selectedRepo.name}'.`
                : `You are a senior tech career advisor helping with a portfolio of ${repos.length} projects.`;
            
            const newChat = ai.chats.create({ model: 'gemini-3-pro-preview', config: { systemInstruction } });
            setChat(newChat);
            currentChat = newChat;
        }
        
        const result = await currentChat.sendMessageStream({ message: userInput });
        let currentModelMessage = '';
        setChatHistory(prev => [...prev, { role: 'model', text: '' }]);
        for await (const chunk of result) {
            currentModelMessage += chunk.text;
            setChatHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1] = { role: 'model', text: currentModelMessage };
                return newHistory;
            });
        }
    } catch (error) {
        setChatHistory(prev => [...prev, { role: 'model', text: 'Sorry, something went wrong.' }]);
    } finally { setIsStreaming(false); }
  };

  const title = context === 'repo' ? t('projectAssistant') : t('portfolioAdvisor');
  const placeholder = context === 'repo' && selectedRepo ? t('chatPlaceholderRepo').replace('{repoName}', selectedRepo.name) : t('chatPlaceholderGlobal');

  const renderContent = () => {
      if (view === 'tasks' && selectedRepo) {
          return <AiTaskList tasks={tasks} onToggleTask={handleToggleTask} isGenerating={isGeneratingTasks} onGenerate={handleGenerateTasks} repoName={selectedRepo.name} />;
      }
      
      if (view === 'showcase') {
          if (isGeneratingShowcase) return <LoadingState message={t('generatingShowcase')} />;
          return (
              <div className="p-6 space-y-6">
                  {!showcaseContent ? (
                      <div className="text-center space-y-4 py-8">
                          <StarIcon className={`h-12 w-12 mx-auto ${context === 'global' ? 'text-yellow-400' : 'text-yellow-500'}`} />
                          <div>
                              <h3 className="text-lg font-bold text-white">
                                {context === 'global' ? `Selected Projects Showcase (${selectedForShowcaseIds.length})` : t('showcase')}
                              </h3>
                              <p className="text-gray-400 text-sm">{t('showcaseDescription')}</p>
                          </div>
                          <button 
                            onClick={handleGenerateShowcase} 
                            disabled={context === 'global' && !hasSelection}
                            className={`bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center gap-2 mx-auto ${context === 'global' && !hasSelection ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                          >
                              <SparklesIcon className="h-5 w-5" />
                              {t('generateShowcase')}
                          </button>
                          {context === 'global' && !hasSelection && <p className="text-xs text-gray-500">Please select at least one project from the list to generate a summary.</p>}
                      </div>
                  ) : (
                      <div className="space-y-4 animate-fade-in">
                          <div className="bg-gray-800/80 p-5 rounded-xl border border-gray-700 shadow-inner">
                               <div className="prose prose-invert prose-sm max-w-none text-gray-200" dangerouslySetInnerHTML={{ __html: showcaseContent.replace(/\*\*(.*)\*\*/g, '<strong class="text-white font-bold">$1</strong>').replace(/\n/g, '<br/>') }} />
                          </div>
                          <div className="flex gap-3">
                            <button onClick={handleGenerateShowcase} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                                <RefreshIcon className="h-4 w-4" /> {t('refreshData')}
                            </button>
                            <button onClick={handleCopyShowcase} className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                                {copyFeedback ? t('showcaseCopied') : t('copyShowcase')}
                            </button>
                          </div>
                      </div>
                  )}
              </div>
          );
      }

      return (
        <>
          <div ref={chatContainerRef} className="flex-grow p-6 overflow-y-auto space-y-6">
              {isFetchingInitial ? <LoadingState /> : chatHistory.map((msg, index) => (
                  <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                      {msg.role === 'model' && <img src='https://aistudio.google.com/images/favicon.svg' alt="AI" className="h-8 w-8 rounded-full bg-gray-700 flex-shrink-0" />}
                      <div className={`max-w-full p-4 rounded-2xl text-white ${msg.role === 'user' ? 'bg-cyan-600 rounded-br-lg' : 'bg-gray-800 rounded-bl-lg'}`}>
                          <div className="prose prose-invert prose-sm max-w-none" style={{'whiteSpace': 'pre-wrap'}} dangerouslySetInnerHTML={{ __html: msg.text.replace(/```(\w+)?\s*([\s\S]*?)```/g, '<pre class="bg-gray-900/50 rounded-md p-3 overflow-x-auto"><code>$2</code></pre>').replace(/`([^`]+)`/g, '<code class="bg-gray-700 text-purple-300 px-1.5 py-0.5 rounded-md">$1</code>') }}></div>
                      </div>
                      {msg.role === 'user' && user && <img src={user.avatar_url} alt={user.name || ''} className="h-8 w-8 rounded-full border-2 border-gray-700 flex-shrink-0" />}
                  </div>
              ))}
              {isStreaming && (
                  <div className="flex gap-3">
                      <img src='https://aistudio.google.com/images/favicon.svg' alt="AI" className="h-8 w-8 rounded-full bg-gray-700 flex-shrink-0" />
                      <div className="max-w-xl p-4 rounded-2xl text-white bg-gray-800 rounded-bl-lg">
                          <div className="animate-pulse flex space-x-1"><div className="h-2 w-2 bg-gray-500 rounded-full"></div><div className="h-2 w-2 bg-gray-500 rounded-full"></div><div className="h-2 w-2 bg-gray-500 rounded-full"></div></div>
                      </div>
                  </div>
              )}
          </div>
          <footer className="p-4 border-t border-gray-700 flex-shrink-0">
              <form onSubmit={handleSendMessage} className="relative">
                  <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder={placeholder} disabled={isFetchingInitial || isStreaming} className="w-full bg-gray-800 border border-gray-600 rounded-full py-3 pl-5 pr-14 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"/>
                  <button type="submit" disabled={isFetchingInitial || isStreaming || !userInput.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition-colors" aria-label={t('sendMessage')}><PaperAirplaneIcon className="h-5 w-5" /></button>
              </form>
          </footer>
        </>
      );
  }

  return (
    <div className="bg-gray-900 flex flex-col h-full shadow-2xl">
        <header className="flex items-center justify-between gap-3 p-4 border-b border-gray-700 flex-shrink-0 bg-gray-900/90 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3 truncate">
                {view === 'tasks' ? <ChecklistIcon className="h-6 w-6 text-purple-400"/> : view === 'showcase' ? <StarIcon className="h-6 w-6 text-yellow-400" /> : <SparklesIcon className="h-6 w-6 text-purple-400" />}
                <h2 className="text-xl font-bold text-white truncate">{title}</h2>
            </div>
             {onClose ? (
              <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"><CloseIcon className="h-6 w-6" /></button>
            ) : (
                <div className="flex items-center bg-gray-800 rounded-full p-1 text-xs">
                    <button onClick={() => setView('chat')} className={`px-3 py-1 rounded-full transition-colors ${view === 'chat' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>{t('chat')}</button>
                    {selectedRepo && <button onClick={() => setView('tasks')} className={`px-3 py-1 rounded-full transition-colors ${view === 'tasks' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>{t('tasks')}</button>}
                    <button onClick={() => setView('showcase')} className={`px-3 py-1 rounded-full transition-colors ${view === 'showcase' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                        {context === 'global' && hasSelection ? `Resume (${selectedForShowcaseIds.length})` : t('showcase')}
                    </button>
                </div>
            )}
        </header>

        <div className="flex-grow flex flex-col overflow-y-auto min-h-0 bg-gray-900/50">
            {renderContent()}
        </div>
    </div>
  );
};

export default AiChatPanel;

const RefreshIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4a8 8 0 0113.546 5.023M20 20a8 8 0 01-13.546-5.023" />
  </svg>
);
