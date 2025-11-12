import React from 'react';
import { TaskItem } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import { SparklesIcon } from './icons/SparklesIcon';

interface AiTaskListProps {
  tasks: TaskItem[];
  onToggleTask: (index: number) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  repoName: string;
}

const AiTaskList: React.FC<AiTaskListProps> = ({ tasks, onToggleTask, isGenerating, onGenerate, repoName }) => {
  const { t } = useLocalization();

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 h-full">
        <SparklesIcon className="h-10 w-10 text-purple-400 animate-pulse mb-4" />
        <p className="text-md font-semibold text-white">{t('generatingTasks')}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
       <div className="flex flex-col items-center justify-center text-center p-8 h-full">
         <h3 className="font-semibold text-white mb-2">{t('noTasksGenerated')}</h3>
         <p className="text-sm text-gray-400 mb-4">{t('tasksForRepo').replace('{repoName}', repoName)}</p>
         <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
          >
            <SparklesIcon className="h-5 w-5"/>
            {t('generateTasks')}
          </button>
       </div>
    )
  }

  return (
    <div className="p-4 space-y-4 overflow-y-auto">
       <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-400">{completedTasks} / {totalTasks} {t('completed')}</span>
                <span className="text-xs font-medium text-purple-300">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
      <ul className="space-y-2">
        {tasks.map((task, index) => (
          <li key={index} className="flex items-center bg-gray-900/50 p-3 rounded-lg">
            <input
              type="checkbox"
              id={`task-${index}`}
              checked={task.completed}
              onChange={() => onToggleTask(index)}
              className="h-5 w-5 rounded border-gray-600 text-cyan-500 bg-gray-800 focus:ring-cyan-600 cursor-pointer"
            />
            <label htmlFor={`task-${index}`} className={`ml-3 text-sm flex-1 ${task.completed ? 'text-gray-500 line-through' : 'text-gray-200'} cursor-pointer`}>
              {task.text}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AiTaskList;
