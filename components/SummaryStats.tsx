
import React, { useEffect, useRef } from 'react';
import { GithubRepo, FilterType } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';

interface SummaryStatsProps {
  repos: GithubRepo[];
  currentFilter: FilterType;
  onFilterChange: (type: FilterType) => void;
}

interface StatCardProps {
    title: string;
    value: string | number;
    colorClass: string;
    isActive: boolean;
    onClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, colorClass, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className={`p-4 rounded-xl border flex flex-col items-start transition-all duration-200 w-full ${
            isActive 
            ? 'bg-gray-800 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)] transform scale-[1.02]' 
            : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-600'
        }`}
    >
        <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
        <span className={`text-sm font-medium ${colorClass}`}>{title}</span>
    </button>
);

const SummaryStats: React.FC<SummaryStatsProps> = ({ repos, currentFilter, onFilterChange }) => {
  const { t } = useLocalization();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);
  
  const totalRepos = repos.length;
  const privateRepos = repos.filter(r => r.private).length;
  const publicRepos = totalRepos - privateRepos;

  const languageCounts: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  }

  const sortedLanguages = Object.entries(languageCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);

  useEffect(() => {
    if (!chartRef.current) return;
    
    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    chartInstance.current = new (window as any).Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: sortedLanguages.map(([lang]) => lang),
        datasets: [{
          data: sortedLanguages.map(([, count]) => count),
          backgroundColor: ['#06b6d4', '#a855f7', '#22c55e', '#f59e0b', '#ef4444', '#ec4899'],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#9ca3af',
              padding: 12,
              font: { size: 11 }
            }
          }
        }
      }
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [repos]);

  return (
    <div className="h-full flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
            <StatCard 
                title={t('totalRepos')} 
                value={totalRepos} 
                colorClass="text-cyan-400" 
                isActive={currentFilter === 'all'}
                onClick={() => onFilterChange('all')}
            />
            <StatCard 
                title={t('publicRepos')} 
                value={publicRepos} 
                colorClass="text-green-400" 
                isActive={currentFilter === 'public'}
                onClick={() => onFilterChange('public')}
            />
            <StatCard 
                title={t('privateRepos')} 
                value={privateRepos} 
                colorClass="text-yellow-400" 
                isActive={currentFilter === 'private'}
                onClick={() => onFilterChange('private')}
            />
        </div>
        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 flex-grow min-h-[200px]">
          <h3 className="text-sm font-medium text-purple-400 mb-2">{t('topLanguages')}</h3>
          {sortedLanguages.length > 0 ? (
            <div className="h-[160px]">
              <canvas ref={chartRef} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-[160px] text-gray-500 text-sm">
              {t('noRepositories')}
            </div>
          )}
      </div>
    </div>
  );
};

export default SummaryStats;
