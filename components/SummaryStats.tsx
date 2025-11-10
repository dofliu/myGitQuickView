
import React from 'react';
import { GithubRepo } from '../types';

interface SummaryStatsProps {
  repos: GithubRepo[];
}

const StatCard: React.FC<{ title: string; value: string | number; colorClass: string }> = ({ title, value, colorClass }) => (
    <div className={`bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex flex-col`}>
        <span className="text-3xl font-bold tracking-tight text-white">{value}</span>
        <span className={`text-sm font-medium ${colorClass}`}>{title}</span>
    </div>
);

const SummaryStats: React.FC<SummaryStatsProps> = ({ repos }) => {
  const totalRepos = repos.length;
  const privateRepos = repos.filter(r => r.private).length;
  const publicRepos = totalRepos - privateRepos;

  // FIX: Explicitly type the accumulator for the reduce function to prevent type inference errors.
  const languageCounts = repos.reduce<Record<string, number>>((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});

  const sortedLanguages = Object.entries(languageCounts).sort(([, a], [, b]) => b - a).slice(0, 5);

  return (
    <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Repositories" value={totalRepos} colorClass="text-cyan-400" />
            <StatCard title="Public Repositories" value={publicRepos} colorClass="text-green-400" />
            <StatCard title="Private Repositories" value={privateRepos} colorClass="text-yellow-400" />
             <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 col-span-2 md:col-span-1">
                <h3 className="text-sm font-medium text-purple-400 mb-2">Top Languages</h3>
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
    </div>
  );
};

export default SummaryStats;
