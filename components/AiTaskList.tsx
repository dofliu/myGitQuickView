
import React, { useState, useEffect } from 'react';
import { GithubRepo, GithubUser, ChatMessage } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import { getAiTasks } from '../services/geminiService';
import { ChecklistIcon } from './icons/ChecklistIcon';

interface AiTaskListProps {
  repos: GithubRepo[];
  user: GithubUser;
}

const AiTaskList: React.FC<AiTaskListProps> = ({ repos, user }) => {
  const { t, language } = useLocalization();
  const [tasks, setTasks] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const generateTasks = async () => {
      const storageKey = `aiChatHistory_${user.login}`;
      const savedHistory = localStorage.getItem(storageKey);
      const chatHistory: ChatMessage[] = savedHistory ? JSON.parse(savedHistory) : [];
      
      if (repos.length > 0) {
        setIsLoading(true);
        try {
          const result = await getAiTasks(repos, chatHistory, language);
          setTasks(result);
        } catch (error) {
          console.error("Failed to get AI tasks:", error);
          setTasks(''); // Don't show an error, just hide the component
        } finally {
          setIsLoading(false);
        }
      }
    };

    generateTasks();
  }, [repos, user, language]);

  if (!isVisible || (!isLoading && !tasks)) {
    return null;
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 mb-6 animate-fade-in">
        <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
                <ChecklistIcon className="h-6 w-6 text-green-400" />
                <h2 className="text-lg font-bold text-white">{t('aiTaskListTitle')}</h2>
            </div>
            <button onClick={() => setIsVisible(false)} className="text-gray-500 hover:text-white transition-colors text-xs">✕</button>
        </div>
        
        {isLoading ? (
            <div className="flex items-center gap-3 text-gray-400">
                <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{t('generatingTasks')}</span>
            </div>
        ) : (
            <div 
                className="prose prose-invert prose-sm max-w-none text-gray-300" 
                dangerouslySetInnerHTML={{ __html: tasks.replace(/- /g, '<li>').replace(/\n/g, '') }}
            />
        )}
    </div>
  );
};

export default AiTaskList;
