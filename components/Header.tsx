
import React from 'react';
import { GithubUser } from '../types';
import { GitHubIcon } from './icons/GitHubIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { SignOutIcon } from './icons/SignOutIcon';

interface HeaderProps {
    user: GithubUser | null;
    onRefresh: () => void;
    onSignOut: () => void;
    isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({ user, onRefresh, onSignOut, isLoading }) => {
    return (
         <header className="flex-shrink-0 bg-gray-900/70 backdrop-blur-sm border-b border-gray-800 px-6 py-3 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
                <GitHubIcon className="h-8 w-8 text-cyan-400" />
                <h1 className="text-xl font-bold text-white hidden sm:block">GitHub Project Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
                {user && (
                    <div className="flex items-center gap-3">
                        <img src={user.avatar_url} alt={user.name} className="h-9 w-9 rounded-full border-2 border-gray-700" />
                        <span className="text-white font-medium hidden md:block">{user.name || user.login}</span>
                    </div>
                )}
                 <button onClick={onRefresh} disabled={isLoading} className="p-2 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-200" title="Refresh Data">
                    <RefreshIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <button onClick={onSignOut} className="p-2 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-200" title="Sign Out">
                    <SignOutIcon className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
};

export default Header;
