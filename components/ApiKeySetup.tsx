import React, { useState } from 'react';
import { LockIcon } from './icons/LockIcon';
import { verifyApiKey } from '../services/geminiService';

interface ApiKeySetupProps {
  onApiKeyVerified: (apiKey: string) => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeyVerified }) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key.');
      return;
    }
    setIsLoading(true);
    setError('');

    const isValid = await verifyApiKey(apiKey);

    setIsLoading(false);
    if (isValid) {
      onApiKeyVerified(apiKey);
    } else {
      setError('The API key is invalid or failed to verify. Please check the key and your connection.');
    }
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleVerify();
    }
  };

  return (
    <div className="bg-brand-secondary p-8 rounded-2xl shadow-2xl animate-fade-in text-center">
      <div className="inline-block bg-brand-accent p-4 rounded-full mb-4">
        <LockIcon className="w-8 h-8 text-brand-highlight" />
      </div>
      <h1 className="text-3xl font-bold text-brand-highlight">API Key Required</h1>
      <p className="text-brand-light mt-2 mb-6">
        Please enter your Google Gemini API key. Your key is stored only in your browser's local storage and is never sent to our servers.
      </p>
      <div className="space-y-4">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your API Key"
          className="w-full bg-brand-primary border border-brand-accent text-brand-highlight rounded-lg p-3 focus:ring-2 focus:ring-brand-light focus:outline-none transition text-center"
          aria-label="API Key Input"
          disabled={isLoading}
        />
        {error && <p className="text-brand-danger text-sm">{error}</p>}
        <button
          onClick={handleVerify}
          disabled={isLoading}
          className="w-full bg-brand-success text-brand-primary font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center disabled:bg-brand-accent disabled:transform-none disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mr-2"></div>
              Verifying...
            </>
          ) : (
            'Save & Verify Key'
          )}
        </button>
      </div>
      <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-sm text-brand-light hover:text-brand-highlight underline mt-6 block">
        Get an API Key from Google AI Studio
      </a>
    </div>
  );
};

export default ApiKeySetup;