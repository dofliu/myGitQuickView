
import React from 'react';
import { GithubRepo, CommitInfo } from '../types';

interface RepoDetailProps {
  repo: GithubRepo;
  commitInfo: CommitInfo | null;
  onBack: () => void;
  isLoading: boolean;
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-md text-white font-medium">{value}</p>
    </div>
);

const RepoDetail: React.FC<RepoDetailProps> = ({ repo, commitInfo, onBack, isLoading }) => {
    
    return (
        <div className="animate-fade-in">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 mb-6 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Projects
            </button>

            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-700">
                    <div>
                        <h2 className="text-3xl font-bold text-white">{repo.name}</h2>
                        <p className="text-gray-400 mt-1">{repo.description || "No description."}</p>
                    </div>
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" 
                       className="mt-4 md:mt-0 flex-shrink-0 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-200 text-sm">
                        View on GitHub
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <DetailItem label="Last Updated" value={new Date(repo.pushed_at).toLocaleString()} />
                    <DetailItem label="Default Branch" value={repo.default_branch} />
                    <DetailItem label="Language" value={repo.language || 'N/A'} />
                </div>

                <div className="bg-gray-900/60 p-6 rounded-lg border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-cyan-400 mb-4">Latest Update</h3>
                    {isLoading ? (
                        <div className="flex items-center justify-center h-24">
                             <svg className="animate-spin h-6 w-6 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : commitInfo ? (
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-400">Commit Message</p>
                                <p className="text-md text-white bg-gray-800 p-3 rounded-md font-mono text-sm whitespace-pre-wrap">{commitInfo.message}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailItem label="Update Time" value={new Date(commitInfo.date).toLocaleString()} />
                                <DetailItem label="Probable Source (AI Analyzed)" value={
                                    <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full font-medium">{commitInfo.source}</span>
                                } />
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-400">No commit information available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RepoDetail;
