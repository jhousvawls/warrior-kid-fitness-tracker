import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import Dashboard from './components/dashboard/Dashboard';
import WorkoutSession from './components/workout/WorkoutSession';
import Leaderboard from './components/competition/Leaderboard';
import ProgressTracker from './components/progress/ProgressTracker';
import AdminAuth from './components/admin/AdminAuth';
import AdminPanel from './components/admin/AdminPanel';
import Navigation from './components/layout/Navigation';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import BlogPost from './pages/BlogPost';
import { storage } from './utils/localStorage';
import './App.css';

// Component to handle the fitness app routes (requires authentication)
const FitnessApp = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentView, setCurrentView] = useState('dashboard');
    const [screenTime, setScreenTime] = useState(0);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [dashboardKey, setDashboardKey] = useState(Date.now());

    useEffect(() => {
        // Check for existing logged-in user
        const loadCurrentUser = async () => {
            try {
                const user = await storage.getCurrentUser();
                if (user) {
                    setCurrentUser(user);
                    await updateScreenTime(user.id);
                }
            } catch (error) {
                console.error('Error loading current user:', error);
            }
        };
        
        loadCurrentUser();
    }, []);

    const updateScreenTime = async (userId) => {
        try {
            const userScreenTime = await storage.getScreenTime(userId);
            setScreenTime(userScreenTime);
        } catch (error) {
            console.error('Error updating screen time:', error);
            setScreenTime(0);
        }
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
        // Force dashboard to refresh by updating the key
        setDashboardKey(Date.now());
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

    // If no user is logged in, show login form
    if (!currentUser) {
        return <LoginForm onLogin={handleLogin} />;
    }

    return (
        <div className="fitness-app">
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
                        key={dashboardKey}
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

// Component for public pages navigation
const PublicNavigation = () => {
    const location = useLocation();
    
    return (
        <nav style={{
            background: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'var(--navy-blue)'
                }}>
                    🏆 Warrior Kid Fitness
                </div>
                
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <a 
                        href="/" 
                        style={{
                            color: location.pathname === '/' ? 'var(--navy-blue)' : 'var(--charcoal-gray)',
                            textDecoration: 'none',
                            fontWeight: location.pathname === '/' ? 'bold' : 'normal'
                        }}
                    >
                        Home
                    </a>
                    <a 
                        href="/about" 
                        style={{
                            color: location.pathname === '/about' ? 'var(--navy-blue)' : 'var(--charcoal-gray)',
                            textDecoration: 'none',
                            fontWeight: location.pathname === '/about' ? 'bold' : 'normal'
                        }}
                    >
                        About
                    </a>
                    <a 
                        href="/blog" 
                        style={{
                            color: location.pathname.startsWith('/blog') ? 'var(--navy-blue)' : 'var(--charcoal-gray)',
                            textDecoration: 'none',
                            fontWeight: location.pathname.startsWith('/blog') ? 'bold' : 'normal'
                        }}
                    >
                        Blog
                    </a>
                    <a 
                        href="/contact" 
                        style={{
                            color: location.pathname === '/contact' ? 'var(--navy-blue)' : 'var(--charcoal-gray)',
                            textDecoration: 'none',
                            fontWeight: location.pathname === '/contact' ? 'bold' : 'normal'
                        }}
                    >
                        Contact
                    </a>
                    <a 
                        href="/app" 
                        className="btn btn-primary"
                        style={{
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            padding: '0.5rem 1rem'
                        }}
                    >
                        🚀 Start Training
                    </a>
                </div>
            </div>
        </nav>
    );
};

// Component for public pages with navigation and footer
const PublicLayout = ({ children }) => {
    return (
        <div className="public-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <PublicNavigation />
            <main style={{ flex: 1 }}>
                {children}
            </main>
            <footer style={{
                background: 'var(--charcoal-gray)',
                color: 'white',
                textAlign: 'center',
                padding: '2rem',
                marginTop: 'auto'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem',
                        marginBottom: '2rem'
                    }}>
                        <div>
                            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Warrior Kid Fitness</h4>
                            <p style={{ fontSize: '0.9rem', opacity: '0.8', lineHeight: '1.6' }}>
                                Building discipline, strength, and character through fun fitness challenges for young warriors.
                            </p>
                        </div>
                        <div>
                            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Quick Links</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <a href="/" style={{ color: 'white', textDecoration: 'none', opacity: '0.8' }}>Home</a>
                                <a href="/about" style={{ color: 'white', textDecoration: 'none', opacity: '0.8' }}>About</a>
                                <a href="/blog" style={{ color: 'white', textDecoration: 'none', opacity: '0.8' }}>Blog</a>
                                <a href="/contact" style={{ color: 'white', textDecoration: 'none', opacity: '0.8' }}>Contact</a>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Get Started</h4>
                            <a 
                                href="/app" 
                                className="btn btn-accent"
                                style={{
                                    textDecoration: 'none',
                                    fontSize: '1rem',
                                    padding: '0.75rem 1.5rem',
                                    display: 'inline-block'
                                }}
                            >
                                🚀 Start Training
                            </a>
                        </div>
                    </div>
                    <div style={{
                        borderTop: '1px solid rgba(255,255,255,0.2)',
                        paddingTop: '1rem',
                        fontSize: '0.9rem',
                        opacity: '0.8'
                    }}>
                        💪 "Discipline equals freedom" - Stay strong, warrior! 💪
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Main App component with routing
const App = () => {
    return (
        <Router>
            <div className="app">
                <Routes>
                    {/* Public pages */}
                    <Route path="/" element={
                        <PublicLayout>
                            <HomePage />
                        </PublicLayout>
                    } />
                    <Route path="/about" element={
                        <PublicLayout>
                            <AboutPage />
                        </PublicLayout>
                    } />
                    <Route path="/contact" element={
                        <PublicLayout>
                            <ContactPage />
                        </PublicLayout>
                    } />
                    <Route path="/blog" element={
                        <PublicLayout>
                            <BlogPage />
                        </PublicLayout>
                    } />
                    <Route path="/blog/:slug" element={
                        <PublicLayout>
                            <BlogPost />
                        </PublicLayout>
                    } />
                    
                    {/* Fitness app (requires authentication) */}
                    <Route path="/app" element={<FitnessApp />} />
                    
                    {/* Redirect any unknown routes to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
