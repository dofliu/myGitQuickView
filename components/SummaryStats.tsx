import React from 'react';
import { GithubRepo } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';

interface SummaryStatsProps {
  repos: GithubRepo[];
}

const StatCard: React.FC<{ title: string; value: string | number; colorClass: string }> = ({ title, value, colorClass }) => (
    <div className={`bg-gray-800/50 p-4 rounded-xl border border-gray-700 flex flex-col`}>
        <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
        <span className={`text-sm font-medium ${colorClass}`}>{title}</span>
    </div>
);

const SummaryStats: React.FC<SummaryStatsProps> = ({ repos }) => {
  const { t } = useLocalization();
  const totalRepos = repos.length;
  const privateRepos = repos.filter(r => r.private).length;
  const publicRepos = totalRepos - privateRepos;

  // FIX: Replaced `reduce` with a `for...of` loop for more robust type inference.
  // This ensures `languageCounts` is correctly typed as `Record<string, number>`,
  // which resolves the TypeScript error during the sort operation.
  const languageCounts: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  }

  const sortedLanguages = Object.entries(languageCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);

  return (
    <div className="h-full flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
            <StatCard title={t('totalRepos')} value={totalRepos} colorClass="text-cyan-400" />
            <StatCard title={t('publicRepos')} value={publicRepos} colorClass="text-green-400" />
            <StatCard title={t('privateRepos')} value={privateRepos} colorClass="text-yellow-400" />
        </div>
        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 flex-grow">
          <h3 className="text-sm font-medium text-purple-400 mb-2">{t('topLanguages')}</h3>
          <div className="space-y-2">
              {sortedLanguages.map(([lang, count]) => (
                  <div key={lang} className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">{lang}</span>
                      <span className="font-semibold text-white bg-gray-700 px-2 py-0.5 rounded-full text-xs">{count}</span>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default SummaryStats;