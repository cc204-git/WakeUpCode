import React, { useState, useCallback, useEffect } from 'react';
import { AppState } from './types';
import GoalSetup from './components/GoalSetup';
import LockSetup from './components/LockSetup';
import GoalTracker from './components/GoalTracker';
import SuccessScreen from './components/SuccessScreen';
import Login from './components/Login';
import ApiKeySetup from './components/ApiKeySetup';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appState, setAppState] = useState<AppState>(AppState.SETUP_GOAL);
  const [goal, setGoal] = useState<string>('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [lockImage, setLockImage] = useState<string | null>(null);
  const [isKeyChecked, setIsKeyChecked] = useState(false);

  useEffect(() => {
    // Check for API key in local storage on initial load
    const storedApiKey = localStorage.getItem('apiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
    setIsKeyChecked(true); // Mark that we've checked for the key
  }, []);

  useEffect(() => {
    // Check for a mock session token on initial load
    const session = localStorage.getItem('sessionToken');
    if (session) {
      setIsAuthenticated(true);
    }
  }, []);
  
  const handleApiKeyVerified = useCallback((newApiKey: string) => {
    localStorage.setItem('apiKey', newApiKey);
    setApiKey(newApiKey);
  }, []);

  const handleInvalidApiKey = useCallback(() => {
    localStorage.removeItem('apiKey');
    setApiKey(null);
  }, []);

  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true);
  }, []);
  
  const handleLogout = useCallback(() => {
    localStorage.removeItem('sessionToken');
    setIsAuthenticated(false);
    // Reset app state on logout
    handleReset();
  }, []);

  const handleGoalSet = useCallback((newGoal: string, newDeadline: Date) => {
    setGoal(newGoal);
    setDeadline(newDeadline);
    setAppState(AppState.SETUP_LOCK);
  }, []);

  const handleLockSet = useCallback((imageBase64: string) => {
    setLockImage(imageBase64);
    setAppState(AppState.TRACKING);
  }, []);

  const handleGoalSuccess = useCallback(() => {
    setAppState(AppState.SUCCESS);
  }, []);
  
  const handleReset = useCallback(() => {
    setGoal('');
    setDeadline(null);
    setLockImage(null);
    setAppState(AppState.SETUP_GOAL);
  }, []);
  
  const renderContent = () => {
    if (!isAuthenticated) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }
    
    switch (appState) {
      case AppState.SETUP_GOAL:
        return <GoalSetup onGoalSet={handleGoalSet} />;
      case AppState.SETUP_LOCK:
        return <LockSetup onLockSet={handleLockSet} />;
      case AppState.TRACKING:
        if (!goal || !deadline || !apiKey) {
            handleReset(); // Should not happen, but as a safeguard
            return null;
        }
        return <GoalTracker goal={goal} deadline={deadline} onGoalSuccess={handleGoalSuccess} apiKey={apiKey} onInvalidApiKey={handleInvalidApiKey} />;
      case AppState.SUCCESS:
        if (!lockImage) {
            handleReset(); // Should not happen, but as a safeguard
            return null;
        }
        return <SuccessScreen lockImage={lockImage} onReset={handleReset} />;
      default:
        return <GoalSetup onGoalSet={handleGoalSet} />;
    }
  };

  const renderApp = () => {
    if (!isKeyChecked) {
        return null; // Don't render anything until the key check is complete
    }
      
    if (!apiKey) {
      return <ApiKeySetup onApiKeyVerified={handleApiKeyVerified} />;
    }

    return (
      <>
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="absolute top-2 right-2 text-brand-light hover:text-brand-highlight text-sm font-semibold transition-colors z-10"
            aria-label="Logout"
          >
            Logout
          </button>
        )}
        {renderContent()}
      </>
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-brand-primary font-sans">
      <div className="w-full max-w-md mx-auto relative">
        {renderApp()}
      </div>
    </div>
  );
};

export default App;