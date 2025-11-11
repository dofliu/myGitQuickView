
import React, { useState, useEffect, useRef } from 'react';
import { GithubRepo, ChatMessage, GithubUser } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import { getPortfolioAnalysis } from '../services/geminiService';
import { CloseIcon } from './icons/CloseIcon';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ai } from '../services/geminiService';
import { Chat } from '@google/genai';

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  repos: GithubRepo[];
  user: GithubUser | null;
}

const LoadingState: React.FC = () => {
    const { t } = useLocalization();
    return (
        <div className="flex flex-col items-center justify-center text-center p-8">
            <SparklesIcon className="h-12 w-12 text-purple-400 animate-pulse mb-4" />
            <p className="text-lg font-semibold text-white">{t('generatingInsight')}</p>
        </div>
    );
}

const AiChatModal: React.FC<AiChatModalProps> = ({ isOpen, onClose, repos, user }) => {
  const { t, language } = useLocalization();
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [chat, setChat] = useState<Chat | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const storageKey = user ? `aiChatHistory_${user.login}` : null;

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (isOpen && storageKey) {
        const savedHistory = localStorage.getItem(storageKey);
        if (savedHistory) {
          setChatHistory(JSON.parse(savedHistory));
        } else if (repos.length > 0) {
          setIsLoading(true);
          try {
            const analysis = await getPortfolioAnalysis(repos, language);
            setChatHistory([{ role: 'model', text: analysis }]);
          } catch (error) {
            console.error(error);
            setChatHistory([{ role: 'model', text: 'Sorry, I was unable to generate an analysis.' }]);
          } finally {
            setIsLoading(false);
          }
        }
      }
    };
    fetchAnalysis();
  }, [isOpen, repos, language, storageKey]);

  useEffect(() => {
    if (storageKey && chatHistory.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(chatHistory));
    }
  }, [chatHistory, storageKey]);
  
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
            const repoSummaries = repos.map(repo => ({
                name: repo.name,
                description: repo.description,
                language: repo.language,
            })).slice(0, 50);

            const initialHistory: { role: "user" | "model"; parts: { text: string; }[] }[] = [
                 ...chatHistory.map(m => ({
                    role: m.role,
                    parts: [{ text: m.text }]
                }))
            ];
            
            const newChat = ai.chats.create({ 
              model: 'gemini-2.5-pro', 
              history: initialHistory,
              config: {
                systemInstruction: `You are a helpful AI career advisor. The user has provided context on their GitHub projects. Your first message was an analysis of their portfolio. Now, continue the conversation, answering their follow-up questions. Here is the context of the user's projects:\n${JSON.stringify(repoSummaries, null, 2)}`
              }
            });
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

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-chat-modal-title"
    >
      <div 
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-3xl h-[90vh] flex flex-col shadow-2xl shadow-purple-500/10"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
            <div className="flex items-center gap-3">
                <SparklesIcon className="h-6 w-6 text-purple-400" />
                <h2 id="ai-chat-modal-title" className="text-xl font-bold text-white">{t('insightTitle')}</h2>
            </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <CloseIcon className="h-6 w-6" />
          </button>
        </header>

        <div ref={chatContainerRef} className="flex-grow p-6 overflow-y-auto space-y-6">
            {isLoading ? <LoadingState /> : chatHistory.map((msg, index) => (
                <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'model' && <img src={user?.avatar_url ? 'https://aistudio.google.com/images/favicon.svg' : ''} alt="AI" className="h-8 w-8 rounded-full bg-gray-700 flex-shrink-0" />}
                    <div className={`max-w-xl p-4 rounded-2xl text-white ${msg.role === 'user' ? 'bg-cyan-600 rounded-br-lg' : 'bg-gray-800 rounded-bl-lg'}`}>
                         <div className="prose prose-invert prose-sm max-w-none" style={{'whiteSpace': 'pre-wrap'}} dangerouslySetInnerHTML={{ __html: msg.text.replace(/```(\w+)?\s*([\s\S]*?)```/g, '<pre class="bg-gray-900/50 rounded-md p-3 overflow-x-auto"><code>$2</code></pre>').replace(/`([^`]+)`/g, '<code class="bg-gray-700 text-purple-300 px-1.5 py-0.5 rounded-md">$1</code>') }}></div>
                    </div>
                     {msg.role === 'user' && <img src={user?.avatar_url} alt={user?.name || ''} className="h-8 w-8 rounded-full border-2 border-gray-700 flex-shrink-0" />}
                </div>
            ))}
             {isStreaming && chatHistory[chatHistory.length - 1]?.role === 'model' && (
                <div className="flex gap-3">
                    <img src={'https://aistudio.google.com/images/favicon.svg'} alt="AI" className="h-8 w-8 rounded-full bg-gray-700 flex-shrink-0" />
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

        <footer className="p-4 border-t border-gray-700 flex-shrink-0">
            <form onSubmit={handleSendMessage} className="relative">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={t('chatPlaceholder')}
                    disabled={isLoading || isStreaming}
                    className="w-full bg-gray-800 border border-gray-600 rounded-full py-3 pl-5 pr-14 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
                <button 
                    type="submit" 
                    disabled={isLoading || isStreaming || !userInput.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-purple-600 rounded-full text-white hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    aria-label={t('sendMessage')}
                >
                    <PaperAirplaneIcon className="h-5 w-5" />
                </button>
            </form>
        </footer>
      </div>
    </div>
  );
};

export default AiChatModal;
