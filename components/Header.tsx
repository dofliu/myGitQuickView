
import React from 'react';
import { GithubUser } from '../types';
import { GitHubIcon } from './icons/GitHubIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { SignOutIcon } from './icons/SignOutIcon';
import { useLocalization } from '../contexts/LocalizationContext';

interface HeaderProps {
    user: GithubUser | null;
    onRefresh: () => void;
    onSignOut: () => void;
    isLoading: boolean;
}

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage, t } = useLocalization();

    return (
        <div className="flex items-center border border-gray-700 rounded-full">
            <button 
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${language === 'en' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
            >
                EN
            </button>
            <button 
                onClick={() => setLanguage('zh-TW')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${language === 'zh-TW' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
            >
                繁中
            </button>
        </div>
    )
}


const Header: React.FC<HeaderProps> = ({ user, onRefresh, onSignOut, isLoading }) => {
    const { t } = useLocalization();
    return (
         <header className="flex-shrink-0 bg-gray-900/70 backdrop-blur-sm border-b border-gray-800 px-6 py-3 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
                <GitHubIcon className="h-8 w-8 text-cyan-400" />
                <h1 className="text-xl font-bold text-white hidden sm:block">{t('dashboardTitle')}</h1>
            </div>
            <div className="flex items-center gap-4">
                <LanguageSwitcher />
                {user && (
                    <div className="flex items-center gap-3">
                        <img src={user.avatar_url} alt={user?.name || ''} className="h-9 w-9 rounded-full border-2 border-gray-700" />
                        <span className="text-white font-medium hidden md:block">{user.name || user.login}</span>
                    </div>
                )}
                 <button onClick={onRefresh} disabled={isLoading} className="p-2 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-200" title={t('refreshData')}>
                    <RefreshIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <button onClick={onSignOut} className="p-2 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-200" title={t('signOut')}>
                    <SignOutIcon className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
};

export default Header;
