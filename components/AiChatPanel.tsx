import React, { useState, useEffect, useRef } from 'react';
import { GithubRepo, ChatMessage, GithubUser, CommitInfo, TaskItem } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import { getPortfolioAnalysis, generateTaskList } from '../services/geminiService';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ai } from '../services/geminiService';
import { Chat } from '@google/genai';
import { ChecklistIcon } from './icons/ChecklistIcon';
import AiTaskList from './AiTaskList';
import { CloseIcon } from './icons/CloseIcon';

interface AiChatPanelProps {
  selectedRepo: GithubRepo | null;
  repos: GithubRepo[];
  user: GithubUser | null;
  commitInfo: CommitInfo | null;
  onClose?: () => void;
}

const LoadingState: React.FC = () => {
    const { t } = useLocalization();
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 h-full">
            <SparklesIcon className="h-12 w-12 text-purple-400 animate-pulse mb-4" />
            <p className="text-lg font-semibold text-white">{t('generatingInsight')}</p>
        </div>
    );
}

type PanelView = 'chat' | 'tasks';

const AiChatPanel: React.FC<AiChatPanelProps> = ({ selectedRepo, repos, user, commitInfo, onClose }) => {
  const { t, language } = useLocalization();
  const [isFetchingInitial, setIsFetchingInitial] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [chat, setChat] = useState<Chat | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [view, setView] = useState<PanelView>('chat');

  // Task list state
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const context = selectedRepo ? 'repo' : 'global';
  const chatStorageKey = user ? (selectedRepo ? `aiChatHistory_repo_${selectedRepo.id}_${user.login}` : `aiChatHistory_global_${user.login}`) : null;
  const taskStorageKey = user && selectedRepo ? `aiTasks_repo_${selectedRepo.id}_${user.login}` : null;
  
  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isStreaming]);

  // Effect to handle context change (repo selection)
  useEffect(() => {
    // Reset states
    setChat(null);
    setChatHistory([]);
    setUserInput('');
    setTasks([]);
    setView('chat');

    const fetchInitialData = async () => {
      // Fetch chat history
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
        } else if (context === 'repo') {
            setChatHistory([]); // Start with a blank slate for repo chat
        }
      }

      // Fetch task list
      if (taskStorageKey) {
          const savedTasks = localStorage.getItem(taskStorageKey);
          if (savedTasks) {
              setTasks(JSON.parse(savedTasks));
          }
      }
    };
    fetchInitialData();
  }, [selectedRepo, user, language]); // Rerun when context changes

  // Effect to save chat history
  useEffect(() => {
    if (chatStorageKey && chatHistory.length > 0) {
        localStorage.setItem(chatStorageKey, JSON.stringify(chatHistory));
    }
  }, [chatHistory, chatStorageKey]);
  
  // Effect to save tasks
  useEffect(() => {
    if (taskStorageKey) { // Save even if tasks are empty to clear it
        localStorage.setItem(taskStorageKey, JSON.stringify(tasks));
    }
  }, [tasks, taskStorageKey]);

  const handleGenerateTasks = async () => {
    if (!selectedRepo || !commitInfo) return;
    setIsGeneratingTasks(true);
    try {
        const newTasks = await generateTaskList(selectedRepo, commitInfo.message, language);
        setTasks(newTasks);
    } catch (error) {
        console.error("Failed to generate task list", error);
    } finally {
        setIsGeneratingTasks(false);
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
    const newChatHistory = [...chatHistory, newUserMessage];
    setChatHistory(newChatHistory);
    setUserInput('');
    setIsStreaming(true);

    try {
        let currentChat = chat;
        if (!currentChat) {
            const repoSummaries = repos.map(repo => ({ name: repo.name, description: repo.description, language: repo.language })).slice(0, 50);
            const initialHistory: { role: "user" | "model"; parts: { text: string; }[] }[] = newChatHistory.slice(0, -1).map(m => ({ role: m.role, parts: [{ text: m.text }] }));
            const systemInstruction = selectedRepo
                ? `You are a helpful AI project assistant for the project '${selectedRepo.name}'. The project's primary language is ${selectedRepo.language}. Its description is '${selectedRepo.description}'. Use this context to answer user's questions about this specific project, such as suggesting new features, explaining code, or helping with documentation.`
                : `You are a senior tech career advisor and GitHub expert. You have already provided the user with an initial analysis of their GitHub projects. Now, continue the conversation, answering their follow-up questions. Here is the context of the user's projects:\n${JSON.stringify(repoSummaries, null, 2)}`;
            
            const newChat = ai.chats.create({ model: 'gemini-2.5-pro', history: initialHistory, config: { systemInstruction } });
            setChat(newChat);
            currentChat = newChat;
        }
        
        if (currentChat) {
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
        }
    } catch (error) {
        console.error("Error sending message:", error);
        setChatHistory(prev => [...prev, { role: 'model', text: 'Sorry, something went wrong.' }]);
    } finally {
        setIsStreaming(false);
    }
  };

  const title = context === 'repo' ? t('projectAssistant') : t('portfolioAdvisor');
  const placeholder = context === 'repo' && selectedRepo ? t('chatPlaceholderRepo').replace('{repoName}', selectedRepo.name) : t('chatPlaceholderGlobal');

  const renderContent = () => {
      if (view === 'tasks' && selectedRepo) {
          return <AiTaskList 
                    tasks={tasks}
                    onToggleTask={handleToggleTask}
                    isGenerating={isGeneratingTasks}
                    onGenerate={handleGenerateTasks}
                    repoName={selectedRepo.name}
                  />;
      }
      // Default to chat view
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
                          <div className="animate-pulse flex space-x-1">
                              <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                              <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                              <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                          </div>
                      </div>
                  </div>
              )}
          </div>
          { view === 'chat' && 
            <footer className="p-4 border-t border-gray-700 flex-shrink-0">
                <form onSubmit={handleSendMessage} className="relative">
                    <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder={placeholder} disabled={isFetchingInitial || isStreaming} className="w-full bg-gray-800 border border-gray-600 rounded-full py-3 pl-5 pr-14 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"/>
                    <button type="submit" disabled={isFetchingInitial || isStreaming || !userInput.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-purple-600 rounded-full text-white hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors" aria-label={t('sendMessage')}>
                        <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                </form>
            </footer>
          }
        </>
      );
  }

  return (
    <div className="bg-gray-900 flex flex-col h-full">
        <header className="flex items-center justify-between gap-3 p-4 border-b border-gray-700 flex-shrink-0">
            <div className="flex items-center gap-3 truncate">
                {view === 'tasks' ? <ChecklistIcon className="h-6 w-6 text-purple-400"/> : <SparklesIcon className="h-6 w-6 text-purple-400" />}
                <h2 className="text-xl font-bold text-white truncate">{title} {selectedRepo && <span className="text-base font-medium text-gray-400">- {selectedRepo.name}</span>}</h2>
            </div>
             {onClose ? (
              <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                aria-label="Close"
              >
                  <CloseIcon className="h-6 w-6" />
              </button>
            ) : selectedRepo && (
                <div className="flex items-center bg-gray-800 rounded-full p-1 text-sm">
                    <button onClick={() => setView('chat')} className={`px-3 py-1 rounded-full transition-colors ${view === 'chat' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>{t('chat')}</button>
                    <button onClick={() => setView('tasks')} className={`px-3 py-1 rounded-full transition-colors ${view === 'tasks' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>{t('tasks')}</button>
                </div>
            )}
        </header>

        <div className="flex-grow flex flex-col overflow-y-auto min-h-0">
            {renderContent()}
        </div>
    </div>
  );
};

export default AiChatPanel;