
import React from 'react';
import { GithubRepo, CommitInfo, BranchDetails } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';

interface RepoDetailProps {
  repo: GithubRepo;
  commitInfo: CommitInfo | null;
  branches: BranchDetails[] | null;
  onBack: () => void;
  isLoading: boolean;
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-md text-white font-medium">{value}</p>
    </div>
);

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin h-6 w-6 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

// Basic Markdown Renderer to avoid external dependencies for this specific environment
const SimpleMarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    // Basic replacements for headings, bold, code blocks, lists
    // Note: This is not a full markdown parser, but sufficient for basic READMEs
    const formatMarkdown = (text: string) => {
        let formatted = text
            // Escape HTML (basic)
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            // Code Blocks
            .replace(/```(\w+)?\s*([\s\S]*?)```/g, '<pre class="bg-gray-900/80 p-4 rounded-lg my-4 overflow-x-auto text-sm text-gray-300 font-mono border border-gray-700"><code>$2</code></pre>')
            // Inline Code
            .replace(/`([^`]+)`/g, '<code class="bg-gray-700/50 text-purple-300 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
            // Headers
            .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mt-6 mb-3 border-b border-gray-700 pb-2">$1</h1>')
            .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-cyan-400 mt-5 mb-2">$1</h2>')
            .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-gray-200 mt-4 mb-2">$1</h3>')
            // Bold
            .replace(/\*\*(.*)\*\*/gim, '<strong class="text-white font-semibold">$1</strong>')
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:underline">$1</a>')
            // Lists
            .replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 list-disc text-gray-300">$1</li>')
            .replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="ml-4 list-decimal text-gray-300">$1</li>');

        return formatted;
    };

    return (
        <div 
            className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }} 
        />
    );
};

const RepoDetail: React.FC<RepoDetailProps> = ({ repo, commitInfo, branches, onBack, isLoading }) => {
    const { t } = useLocalization();
    
    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <button onClick={onBack} className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 mb-6 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {t('backToProjects')}
                </button>

                <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-700">
                        <div>
                            <h2 className="text-3xl font-bold text-white break-words">{repo.name}</h2>
                            <p className="text-gray-400 mt-1 break-words">{repo.description || t('noDescription')}</p>
                        </div>
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" 
                        className="mt-4 md:mt-0 flex-shrink-0 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-200 text-sm">
                            {t('viewOnGithub')}
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <DetailItem label={t('lastUpdated')} value={new Date(repo.pushed_at).toLocaleString()} />
                        <DetailItem label={t('defaultBranch')} value={repo.default_branch} />
                        <DetailItem label={t('language')} value={repo.language || 'N/A'} />
                    </div>
                </div>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">{t('latestUpdate')}</h3>
                {isLoading ? (
                    <div className="flex items-center justify-center h-24"><LoadingSpinner /></div>
                ) : commitInfo ? (
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-400">{t('commitMessage')}</p>
                            <p className="text-md text-white bg-gray-900/60 p-3 rounded-md font-mono text-sm whitespace-pre-wrap break-words">{commitInfo.message}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DetailItem label={t('updateTime')} value={new Date(commitInfo.date).toLocaleString()} />
                            <DetailItem label={t('probableSource')} value={
                                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full font-medium">{commitInfo.source}</span>
                            } />
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-400">{t('noCommitInfo')}</p>
                )}
            </div>

            {/* AI Summary Section */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">{t('aiSummary')}</h3>
                 {isLoading ? (
                    <div className="flex items-center justify-center h-20"><LoadingSpinner /></div>
                ) : commitInfo?.aiSummary ? (
                    <p className="text-gray-300 leading-relaxed">{commitInfo.aiSummary}</p>
                ) : (
                    <p className="text-gray-500">{t('noAiSummary')}</p>
                )}
            </div>

            {/* README Section */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">{t('readme')}</h3>
                 {isLoading ? (
                    <div className="flex items-center justify-center h-48"><LoadingSpinner /></div>
                ) : commitInfo?.readme ? (
                    <SimpleMarkdownRenderer content={commitInfo.readme} />
                ) : (
                    <p className="text-gray-500 italic">{t('noReadme')}</p>
                )}
            </div>

             <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">{t('activeBranches')}</h3>
                {isLoading ? (
                    <div className="flex items-center justify-center h-20"><LoadingSpinner /></div>
                ) : branches && branches.length > 0 ? (
                    <ul className="space-y-4">
                        {branches.map(branch => (
                            <li key={branch.name} className="bg-gray-900/60 p-4 rounded-lg border border-gray-700/50">
                                <div className="flex justify-between items-start mb-2 gap-4">
                                    <p className="text-md text-white font-bold font-mono break-all">{branch.name}</p>
                                    <p className="text-xs text-gray-400 flex-shrink-0">{new Date(branch.lastCommit.date).toLocaleDateString()}</p>
                                </div>
                                <p className="text-sm text-gray-300 font-mono bg-gray-800/50 p-2 rounded truncate" title={branch.lastCommit.message}>
                                    {branch.lastCommit.message.split('\n')[0]}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">{t('noOtherBranches')}</p>
                )}
            </div>
        </div>
    );
};

export default RepoDetail;
