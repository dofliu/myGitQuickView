
import React from 'react';
import { GithubRepo, CommitInfo, BranchDetails } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import { SparklesIcon } from './icons/SparklesIcon';

interface RepoDetailProps {
  repo: GithubRepo;
  commitInfo: CommitInfo | null;
  branches: BranchDetails[] | null;
  onBack: () => void;
  isLoading: boolean;
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-md text-white font-medium">{value}</p>
    </div>
);

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin h-6 w-6 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const SpotlightCard: React.FC<{ title: string, items: string[], icon: React.ReactNode, color: string }> = ({ title, items, icon, color }) => (
    <div className={`bg-gray-800/40 p-5 rounded-xl border border-gray-700/50 hover:border-${color}-500/50 transition-colors`}>
        <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-400`}>
                {icon}
            </div>
            <h4 className="font-bold text-gray-200">{title}</h4>
        </div>
        <ul className="space-y-2">
            {items.map((item, i) => (
                <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className={`mt-1.5 h-1.5 w-1.5 rounded-full bg-${color}-500/60 flex-shrink-0`} />
                    {item}
                </li>
            ))}
        </ul>
    </div>
);

const SimpleMarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const formatMarkdown = (text: string) => {
        return text
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/```(\w+)?\s*([\s\S]*?)```/g, '<pre class="bg-gray-900/80 p-4 rounded-lg my-4 overflow-x-auto text-sm text-gray-300 font-mono border border-gray-700"><code>$2</code></pre>')
            .replace(/`([^`]+)`/g, '<code class="bg-gray-700/50 text-purple-300 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
            .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mt-6 mb-3 border-b border-gray-700 pb-2">$1</h1>')
            .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-cyan-400 mt-5 mb-2">$1</h2>')
            .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-gray-200 mt-4 mb-2">$1</h3>')
            .replace(/\*\*(.*)\*\*/gim, '<strong class="text-white font-semibold">$1</strong>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:underline">$1</a>')
            .replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 list-disc text-gray-300">$1</li>');
    };

    return <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }} />;
};

const RepoDetail: React.FC<RepoDetailProps> = ({ repo, commitInfo, branches, onBack, isLoading }) => {
    const { t } = useLocalization();
    const spotlight = commitInfo?.spotlight;

    return (
        <div className="animate-fade-in space-y-8 pb-20">
            {/* Header Showcase Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-xl">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <SparklesIcon className="h-40 w-40 text-cyan-400" />
                </div>
                
                <div className="p-8 md:p-12 relative z-10">
                    <button onClick={onBack} className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 mb-8 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {t('backToProjects')}
                    </button>

                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-4xl font-extrabold text-white tracking-tight">{repo.name}</h2>
                                {repo.private && <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase tracking-widest border border-yellow-500/20">Private</span>}
                            </div>
                            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">{repo.description || t('noDescription')}</p>
                            
                            <div className="flex flex-wrap gap-2 mt-6">
                                {spotlight?.techStack.map(tech => (
                                    <span key={tech} className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold border border-cyan-500/20">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" 
                               className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-xl transition duration-200 text-center shadow-lg shadow-cyan-900/20">
                                {t('viewOnGithub')}
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Technical Spotlight Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <SparklesIcon className="h-6 w-6 text-purple-400" />
                    <h3 className="text-2xl font-bold text-white">{t('projectSpotlight')}</h3>
                </div>

                {isLoading ? (
                    <div className="bg-gray-800/30 p-12 rounded-xl border border-gray-700/50 flex flex-col items-center justify-center gap-4">
                        <LoadingSpinner />
                        <p className="text-gray-500 text-sm animate-pulse">{t('generatingInsight')}</p>
                    </div>
                ) : spotlight ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-purple-500/5 border border-purple-500/20 p-6 rounded-xl">
                            <h4 className="text-purple-400 font-bold mb-3 uppercase tracking-wider text-xs">{t('coreValue')}</h4>
                            <p className="text-lg text-gray-200 leading-relaxed italic">"{spotlight.coreValue}"</p>
                        </div>
                        
                        <SpotlightCard 
                            title={t('keyFeatures')} 
                            items={spotlight.keyFeatures} 
                            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                            color="green"
                        />
                        <SpotlightCard 
                            title={t('challengesFaced')} 
                            items={spotlight.technicalChallenges} 
                            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                            color="orange"
                        />
                         <SpotlightCard 
                            title={t('architectureStack')} 
                            items={spotlight.techStack} 
                            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                            color="cyan"
                        />
                        <div className="bg-gray-800/40 p-6 rounded-xl border border-gray-700/50 flex flex-col justify-center">
                            <h4 className="text-gray-500 text-xs font-bold uppercase mb-4 tracking-widest">{t('overview')}</h4>
                            <div className="space-y-4">
                                <DetailItem label={t('lastUpdated')} value={new Date(repo.pushed_at).toLocaleDateString()} />
                                <DetailItem label={t('language')} value={repo.language || 'N/A'} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 bg-gray-800/30 rounded-xl border border-gray-700 text-center text-gray-500 italic">
                        {t('noAiSummary')}
                    </div>
                )}
            </section>

            {/* Content Tabs Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            {t('readme')}
                        </h3>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-20"><LoadingSpinner /></div>
                        ) : commitInfo?.readme ? (
                            <SimpleMarkdownRenderer content={commitInfo.readme} />
                        ) : (
                            <p className="text-gray-500 italic py-10 text-center">{t('noReadme')}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 sticky top-6">
                        <h3 className="text-lg font-bold text-white mb-6">{t('latestUpdate')}</h3>
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : commitInfo ? (
                            <div className="space-y-6">
                                <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-700/50">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">{t('commitMessage')}</p>
                                    <p className="text-sm text-gray-300 font-mono break-words leading-relaxed">{commitInfo.message}</p>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <DetailItem label={t('branchName')} value={<span className="font-mono text-cyan-400">{commitInfo.branchName}</span>} />
                                    <DetailItem label={t('probableSource')} value={<span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-bold">{commitInfo.source}</span>} />
                                </div>
                            </div>
                        ) : <p className="text-gray-500">{t('noCommitInfo')}</p>}

                        <div className="mt-8 pt-8 border-t border-gray-700">
                            <h3 className="text-lg font-bold text-white mb-4">{t('activeBranches')}</h3>
                            {branches && branches.length > 0 ? (
                                <div className="space-y-3">
                                    {branches.slice(0, 5).map(branch => (
                                        <div key={branch.name} className="flex justify-between items-center text-sm p-2 hover:bg-gray-700/30 rounded transition-colors">
                                            <span className="text-gray-300 font-mono truncate mr-2">{branch.name}</span>
                                            <span className="text-[10px] text-gray-500 whitespace-nowrap">{new Date(branch.lastCommit.date).toLocaleDateString()}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-gray-500 text-xs">{t('noOtherBranches')}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RepoDetail;
