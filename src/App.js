import React, { useState, useEffect } from 'react';
import LoginForm from './components/auth/LoginForm';
import Dashboard from './components/dashboard/Dashboard';
import WorkoutSession from './components/workout/WorkoutSession';
import Leaderboard from './components/competition/Leaderboard';
import ProgressTracker from './components/progress/ProgressTracker';
import AdminAuth from './components/admin/AdminAuth';
import AdminPanel from './components/admin/AdminPanel';
import Navigation from './components/layout/Navigation';
import { storage } from './utils/localStorage';
import './App.css';

const App = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentView, setCurrentView] = useState('dashboard');
    const [screenTime, setScreenTime] = useState(0);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

    useEffect(() => {
        // Check for existing logged-in user
        const user = storage.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            updateScreenTime(user.id);
        }
    }, []);

    const updateScreenTime = (userId) => {
        const userScreenTime = storage.getScreenTime(userId);
        setScreenTime(userScreenTime);
    };

    const handleLogin = (user) => {
        setCurrentUser(user);
        setCurrentView('dashboard');
        updateScreenTime(user.id);
    };

    const handleLogout = () => {
        storage.setCurrentUser('');
        setCurrentUser(null);
        setCurrentView('dashboard');
        setScreenTime(0);
    };

    const handleWorkoutComplete = () => {
        setCurrentView('dashboard');
        updateScreenTime(currentUser.id);
    };

    const handleViewChange = (view) => {
        setCurrentView(view);
    };

    const handleAdminAccess = () => {
        setCurrentView('admin-auth');
    };

    const handleAdminAuthenticated = () => {
        setIsAdminAuthenticated(true);
        setCurrentView('admin-panel');
    };

    const handleAdminBack = () => {
        setIsAdminAuthenticated(false);
        setCurrentView('dashboard');
    };

    const formatScreenTime = (minutes) => {
        if (minutes < 60) {
            return `${minutes} min`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    };

    // If no user is logged in, show login form
    if (!currentUser) {
        return <LoginForm onLogin={handleLogin} />;
    }

    return (
        <div className="app">
            {/* Navigation Header */}
            <Navigation
                currentView={currentView}
                onViewChange={handleViewChange}
                currentUser={currentUser}
                screenTime={screenTime}
                onLogout={handleLogout}
                onAdminAccess={handleAdminAccess}
            />

            {/* Main Content */}
            <main>
                {currentView === 'dashboard' && (
                    <Dashboard
                        user={currentUser}
                        onStartWorkout={() => handleViewChange('workout')}
                        onViewCompetition={() => handleViewChange('competition')}
                        onViewProgress={() => handleViewChange('progress')}
                    />
                )}

                {currentView === 'workout' && (
                    <WorkoutSession
                        user={currentUser}
                        onComplete={handleWorkoutComplete}
                        onCancel={() => handleViewChange('dashboard')}
                    />
                )}

                {currentView === 'competition' && (
                    <Leaderboard
                        user={currentUser}
                        onBack={() => handleViewChange('dashboard')}
                    />
                )}

                {currentView === 'progress' && (
                    <ProgressTracker
                        user={currentUser}
                        onBack={() => handleViewChange('dashboard')}
                    />
                )}

                {currentView === 'admin-auth' && (
                    <AdminAuth
                        onAuthenticated={handleAdminAuthenticated}
                    />
                )}

                {currentView === 'admin-panel' && isAdminAuthenticated && (
                    <AdminPanel
                        onBack={handleAdminBack}
                    />
                )}
            </main>

            {/* Footer */}
            <footer style={{
                background: 'var(--charcoal-gray)',
                color: 'white',
                textAlign: 'center',
                padding: '1rem',
                marginTop: 'auto'
            }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                    💪 "Discipline equals freedom" - Stay strong, warrior! 💪
                </p>
            </footer>
        </div>
    );
};

export default App;
