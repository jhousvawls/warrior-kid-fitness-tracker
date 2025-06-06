import React, { useState, createContext, useContext } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import UserSelection from './components/user/UserSelection';
import WorkoutSession from './components/workout/WorkoutSession';
import Dashboard from './components/dashboard/Dashboard';
import Competition from './components/competition/Competition';
import Achievements from './components/achievements/Achievements';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import InstructionsPanel from './components/layout/InstructionsPanel';
import ChangelogModal from './components/layout/ChangelogModal';

// Create context for sharing state
export const AppContext = createContext();

export const useApp = () => useContext(AppContext);

function App() {
  const [users, setUsers] = useLocalStorage('workoutUsers', {});
  const [challengeGoal, setChallengeGoal] = useLocalStorage('weeklyChallenge', 50);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showInstructions, setShowInstructions] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);

  const contextValue = {
    users,
    setUsers,
    currentUser,
    setCurrentUser,
    currentWeek,
    setCurrentWeek,
    activeWorkout,
    setActiveWorkout,
    activeTab,
    setActiveTab,
    showInstructions,
    setShowInstructions,
    challengeGoal,
    setChallengeGoal,
    // Helper functions
    getCurrentUserData: () => users[currentUser] || { 
      workouts: {}, 
      screenTimeEarned: 0, 
      totalPullups: 0, 
      currentStreak: 0, 
      longestStreak: 0, 
      achievements: [] 
    },
    updateUserData: (updates) => {
      setUsers(prev => ({
        ...prev,
        [currentUser]: { ...prev[currentUser], ...updates }
      }));
    }
  };

  if (!currentUser) {
    return (
      <AppContext.Provider value={contextValue}>
        <UserSelection />
      </AppContext.Provider>
    );
  }

  if (activeWorkout) {
    return (
      <AppContext.Provider value={contextValue}>
        <WorkoutSession />
      </AppContext.Provider>
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
        <Header />
        
        <InstructionsPanel />

        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'competition' && <Competition />}
        {activeTab === 'achievements' && <Achievements />}

        <Footer onShowChangelog={() => setShowChangelog(true)} />
        
        {showChangelog && (
          <ChangelogModal onClose={() => setShowChangelog(false)} />
        )}
      </div>
    </AppContext.Provider>
  );
}

export default App;