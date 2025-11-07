import React, { useState, useCallback, useEffect } from 'react';
import { Goal } from './types';
import GoalSetup from './components/GoalSetup';
import LockSetup from './components/LockSetup';
import GoalTracker from './components/GoalTracker';
import SuccessScreen from './components/SuccessScreen';
import Login from './components/Login';
// Fix: Removed ApiKeySetup as API key is now handled by environment variables per guidelines.
import { auth, db } from './firebase/config';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';


const App: React.FC = () => {
  // Fix: Removed apiKey state management to align with guidelines of using environment variables.
  const [user, setUser] = useState<User | null>(null);
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  // Fix: Removed isKeyChecked state as API key is no longer managed in the component.

  // Fix: Removed useEffect for checking API key in local storage.

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  // Fetch user's active goal from Firestore when they log in
  useEffect(() => {
    const fetchGoal = async () => {
        if (user) {
            setIsDataLoading(true);
            const goalsRef = collection(db, 'goals');
            const q = query(goalsRef, where('userId', '==', user.uid), where('status', '==', 'active'));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const goalDoc = querySnapshot.docs[0];
                setCurrentGoal({ id: goalDoc.id, ...goalDoc.data() } as Goal);
            } else {
                setCurrentGoal(null);
            }
            setIsDataLoading(false);
        } else {
            // If user logs out, clear data
            setCurrentGoal(null);
            setIsDataLoading(false);
        }
    };
    
    fetchGoal();
  }, [user]);


  // Fix: Removed handleApiKeyVerified and handleInvalidApiKey callbacks.
  // API key is now handled via environment variables and assumed to be valid.

  const handleLogout = useCallback(async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out: ", error);
    }
  }, []);

  const handleGoalSet = useCallback(async (newGoal: string, newDeadline: Date) => {
    if (!user) return;
    const goalData = {
        userId: user.uid,
        goal: newGoal,
        deadline: Timestamp.fromDate(newDeadline),
        lockImage: null,
        status: 'active' as const,
    };
    try {
        const docRef = await addDoc(collection(db, 'goals'), goalData);
        setCurrentGoal({ id: docRef.id, ...goalData });
    } catch (error) {
        console.error("Error adding document: ", error);
    }
  }, [user]);

  const handleLockSet = useCallback(async (imageBase64: string) => {
    if (!currentGoal) return;
    const goalRef = doc(db, 'goals', currentGoal.id);
    try {
        await updateDoc(goalRef, { lockImage: imageBase64 });
        setCurrentGoal(prev => prev ? { ...prev, lockImage: imageBase64 } : null);
    } catch (error) {
        console.error("Error updating document: ", error);
    }
  }, [currentGoal]);

  const handleGoalSuccess = useCallback(async () => {
    if (!currentGoal) return;
    const goalRef = doc(db, 'goals', currentGoal.id);
    try {
        await updateDoc(goalRef, { status: 'completed' });
        setCurrentGoal(prev => prev ? { ...prev, status: 'completed' } : null);
    } catch (error) {
        console.error("Error updating document: ", error);
    }
  }, [currentGoal]);
  
  const handleReset = useCallback(() => {
    // We could archive the goal in DB, but for now just resetting state is enough
    setCurrentGoal(null);
  }, []);
  
  const renderContent = () => {
    if (isAuthLoading || isDataLoading) {
      return (
          <div className="flex items-center justify-center h-screen">
              <div className="w-16 h-16 border-4 border-brand-accent border-t-brand-highlight rounded-full animate-spin"></div>
          </div>
      );
    }
    
    if (!user) {
        return <Login />;
    }
    
    if (!currentGoal) {
        return <GoalSetup onGoalSet={handleGoalSet} />;
    }

    if (!currentGoal.lockImage) {
        return <LockSetup onLockSet={handleLockSet} />;
    }

    if (currentGoal.status === 'active') {
        // Fix: Removed props from GoalTracker as API key is handled by environment variables.
        return <GoalTracker goal={currentGoal} onGoalSuccess={handleGoalSuccess} />;
    }

    if (currentGoal.status === 'completed') {
        return <SuccessScreen goal={currentGoal} onReset={handleReset} />;
    }
    
    return <GoalSetup onGoalSet={handleGoalSet} />;
  };

  // Fix: Simplified renderApp to remove API key checking logic.
  const renderApp = () => {
    return (
      <>
        {user && (
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