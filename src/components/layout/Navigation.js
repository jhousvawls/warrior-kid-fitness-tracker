import React, { useState } from 'react';

const Navigation = ({ currentView, onViewChange, currentUser, screenTime, onLogout, onAdminAccess }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const formatScreenTime = (minutes) => {
        if (minutes < 60) {
            return `${minutes} min`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    };

    const navigationItems = [
        { id: 'dashboard', label: '🏠 Dashboard', icon: '🏠' },
        { id: 'workout', label: '💪 Start Workout', icon: '💪' },
        { id: 'competition', label: '🏆 Leaderboard', icon: '🏆' },
        { id: 'progress', label: '📊 My Progress', icon: '📊' }
    ];

    const handleNavClick = (viewId) => {
        onViewChange(viewId);
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            <div className="header-left">
                <div className="logo">
                    🏆 Warrior Kid Fitness
                </div>
                
                {/* Breadcrumb Navigation */}
                <div className="breadcrumb">
                    {currentView !== 'dashboard' && (
                        <>
                            <button 
                                className="breadcrumb-link"
                                onClick={() => handleNavClick('dashboard')}
                            >
                                Dashboard
                            </button>
                            <span className="breadcrumb-separator">›</span>
                            <span className="breadcrumb-current">
                                {navigationItems.find(item => item.id === currentView)?.label.replace(/^[^\s]+ /, '') || 'Current Page'}
                            </span>
                        </>
                    )}
                </div>
            </div>

            <div className="header-right">
                {/* Screen Time Display */}
                <div className="screen-time-display">
                    🎮 {formatScreenTime(screenTime)}
                </div>

                {/* User Name */}
                <div className="user-name">
                    {currentUser.name}
                </div>

                {/* Navigation Dropdown */}
                <div className="nav-dropdown">
                    <button 
                        className="nav-toggle"
                        onClick={toggleMenu}
                        aria-label="Navigation Menu"
                    >
                        <span className="hamburger-icon">
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    </button>

                    {isMenuOpen && (
                        <div className="nav-menu">
                            <div className="nav-menu-header">
                                <span>🗺️ Navigation</span>
                                <button 
                                    className="nav-close"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <div className="nav-items">
                                {navigationItems.map(item => (
                                    <button
                                        key={item.id}
                                        className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                                        onClick={() => handleNavClick(item.id)}
                                    >
                                        <span className="nav-icon">{item.icon}</span>
                                        <span className="nav-label">{item.label.replace(/^[^\s]+ /, '')}</span>
                                        {currentView === item.id && <span className="nav-indicator">●</span>}
                                    </button>
                                ))}
                            </div>

                            <div className="nav-menu-footer">
                                <button 
                                    className="nav-item admin-item"
                                    onClick={() => {
                                        onAdminAccess();
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    <span className="nav-icon">🛠️</span>
                                    <span className="nav-label">Admin</span>
                                </button>
                                <button 
                                    className="nav-item logout-item"
                                    onClick={() => {
                                        onLogout();
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    <span className="nav-icon">🚪</span>
                                    <span className="nav-label">Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Dashboard Button (for workout sessions) */}
                {currentView === 'workout' && (
                    <button 
                        className="quick-home-btn"
                        onClick={() => handleNavClick('dashboard')}
                        title="Back to Dashboard"
                    >
                        🏠
                    </button>
                )}
            </div>

            {/* Overlay for mobile menu */}
            {isMenuOpen && (
                <div 
                    className="nav-overlay"
                    onClick={() => setIsMenuOpen(false)}
                ></div>
            )}
        </header>
    );
};

export default Navigation;
