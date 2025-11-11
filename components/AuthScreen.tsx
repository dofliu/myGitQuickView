
import React, { useState } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

interface AuthScreenProps {
  onSetPat: (token: string) => void;
  error: string | null;
  isLoading: boolean;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onSetPat, error, isLoading }) => {
  const [token, setToken] = useState('');
  const { t } = useLocalization();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onSetPat(token.trim());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-2 text-cyan-400">{t('dashboardTitle')}</h1>
        <p className="text-center text-gray-400 mb-6">{t('authScreenPrompt')}</p>
        
        {error && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_... or ghs_..."
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200 text-gray-200"
          />
          <button
            type="submit"
            disabled={isLoading || !token}
            className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('authenticating')}
              </>
            ) : t('connectToGithub')}
          </button>
        </form>

        <div className="mt-8 text-sm text-gray-500 text-left p-4 bg-gray-900/50 rounded-lg border border-gray-700">
          <h3 className="font-semibold text-gray-300 mb-3">{t('howToGetToken')}</h3>
          
          <p className="mb-4">
            {t('goTo')} <a href="https://github.com/settings/tokens?type=beta" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{t('githubTokenSettings')}</a> {t('andClickGenerate')} 
            {t('recommendFineGrained')}
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-200">{t('option1Title')}</h4>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>{t('option1Step1')}</li>
                <li>{t('option1Step2')}</li>
                <li className="list-none ml-4">
                    - <strong className="text-gray-300">{t('contentsPermission')}:</strong> <code className="bg-gray-700 px-1 rounded">{t('readOnly')}</code> {t('contentsPermissionReason')}
                </li>
                 <li className="list-none ml-4">
                    - <strong className="text-gray-300">{t('metadataPermission')}:</strong> <code className="bg-gray-700 px-1 rounded">{t('readOnly')}</code> {t('metadataPermissionReason')}
                </li>
                <li>{t('option1Step3')}</li>
              </ol>
            </div>
             <div>
              <h4 className="font-semibold text-gray-200">{t('option2Title')}</h4>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                 <li>{t('option2Step1')}</li>
                 <li>{t('option2Step2')}</li>
                 <li>{t('option2Step3')}</li>
                 <li>{t('option2Step4')}</li>
              </ol>
            </div>
          </div>

           <p className="mt-4 text-xs">{t('tokenNotice')}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
