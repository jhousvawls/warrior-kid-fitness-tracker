import React, { useState, useEffect } from 'react';
import { storage } from '../../utils/localStorage';
import { dateHelpers } from '../../utils/dateHelpers';

const AdminPanel = ({ onBack }) => {
    const [users, setUsers] = useState([]);
    const [showConfirmDelete, setShowConfirmDelete] = useState(null);
    const [showUserDetails, setShowUserDetails] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        const allUsers = storage.getUsers();
        const usersWithStats = allUsers.map(user => {
            const workouts = storage.getWorkouts(user.id);
            const screenTime = storage.getScreenTime(user.id);
            const pullupProgress = storage.getPullupProgress(user.id);
            
            return {
                ...user,
                totalWorkouts: workouts.length,
                screenTime,
                totalPullups: pullupProgress.reduce((sum, p) => sum + p.reps, 0),
                lastActive: workouts.length > 0 
                    ? workouts[workouts.length - 1].date 
                    : user.createdAt.split('T')[0]
            };
        });
        setUsers(usersWithStats);
    };

    const deleteUser = (userId) => {
        // Remove user from users array
        const updatedUsers = storage.getUsers().filter(u => u.id !== userId);
        localStorage.setItem('warrior_kid_users', JSON.stringify(updatedUsers));

        // Remove user's workouts
        const allWorkouts = JSON.parse(localStorage.getItem('warrior_kid_workouts') || '[]');
        const filteredWorkouts = allWorkouts.filter(w => w.userId !== userId);
        localStorage.setItem('warrior_kid_workouts', JSON.stringify(filteredWorkouts));

        // Remove user's screen time
        const allScreenTime = JSON.parse(localStorage.getItem('warrior_kid_screen_time') || '{}');
        delete allScreenTime[userId];
        localStorage.setItem('warrior_kid_screen_time', JSON.stringify(allScreenTime));

        // Remove user's pull-up progress
        const allPullupProgress = JSON.parse(localStorage.getItem('warrior_kid_pullup_progress') || '{}');
        delete allPullupProgress[userId];
        localStorage.setItem('warrior_kid_pullup_progress', JSON.stringify(allPullupProgress));

        // Clear current user if it was the deleted user
        const currentUserId = localStorage.getItem('warrior_kid_current_user');
        if (currentUserId === userId) {
            localStorage.setItem('warrior_kid_current_user', '');
        }

        setShowConfirmDelete(null);
        loadUsers();
    };

    const resetUserData = (userId) => {
        // Keep user account but clear all progress
        const allWorkouts = JSON.parse(localStorage.getItem('warrior_kid_workouts') || '[]');
        const filteredWorkouts = allWorkouts.filter(w => w.userId !== userId);
        localStorage.setItem('warrior_kid_workouts', JSON.stringify(filteredWorkouts));

        const allScreenTime = JSON.parse(localStorage.getItem('warrior_kid_screen_time') || '{}');
        allScreenTime[userId] = 0;
        localStorage.setItem('warrior_kid_screen_time', JSON.stringify(allScreenTime));

        const allPullupProgress = JSON.parse(localStorage.getItem('warrior_kid_pullup_progress') || '{}');
        allPullupProgress[userId] = [];
        localStorage.setItem('warrior_kid_pullup_progress', JSON.stringify(allPullupProgress));

        loadUsers();
    };

    const exportUserData = (user) => {
        const userData = {
            user: user,
            workouts: storage.getWorkouts(user.id),
            screenTime: storage.getScreenTime(user.id),
            pullupProgress: storage.getPullupProgress(user.id)
        };

        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `warrior-kid-${user.name}-${dateHelpers.getTodayString()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const exportAllData = () => {
        const allData = {
            users: storage.getUsers(),
            workouts: JSON.parse(localStorage.getItem('warrior_kid_workouts') || '[]'),
            screenTime: JSON.parse(localStorage.getItem('warrior_kid_screen_time') || '{}'),
            pullupProgress: JSON.parse(localStorage.getItem('warrior_kid_pullup_progress') || '{}'),
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(allData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `warrior-kid-all-data-${dateHelpers.getTodayString()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatScreenTime = (minutes) => {
        if (minutes < 60) return `${minutes} min`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    };

    return (
        <div className="main-content">
            {/* Header */}
            <div className="card">
                <div className="card-header">
                    <h1 className="card-title">🛠️ Admin Panel</h1>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button 
                            className="btn btn-accent"
                            onClick={exportAllData}
                        >
                            📥 Export All Data
                        </button>
                        <button className="btn btn-secondary" onClick={onBack}>
                            ← Back to App
                        </button>
                    </div>
                </div>
                <p style={{ color: 'var(--charcoal-gray)' }}>
                    Manage users, view statistics, and export data
                </p>
            </div>

            {/* Statistics Overview */}
            <div className="card">
                <h2 className="card-title">📊 Overview</h2>
                <div className="dashboard-grid">
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--navy-blue)', margin: '0 0 0.5rem 0' }}>
                            {users.length}
                        </h3>
                        <p style={{ color: 'var(--charcoal-gray)', margin: 0 }}>Total Users</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--forest-green)', margin: '0 0 0.5rem 0' }}>
                            {users.reduce((sum, u) => sum + u.totalWorkouts, 0)}
                        </h3>
                        <p style={{ color: 'var(--charcoal-gray)', margin: 0 }}>Total Workouts</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--amber-orange)', margin: '0 0 0.5rem 0' }}>
                            {formatScreenTime(users.reduce((sum, u) => sum + u.screenTime, 0))}
                        </h3>
                        <p style={{ color: 'var(--charcoal-gray)', margin: 0 }}>Total Screen Time</p>
                    </div>
                </div>
            </div>

            {/* Users List */}
            <div className="card">
                <h2 className="card-title">👥 User Management</h2>
                
                {users.length === 0 ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '2rem',
                        color: 'var(--charcoal-gray)'
                    }}>
                        <p>No users found.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {users.map(user => (
                            <div
                                key={user.id}
                                style={{
                                    background: 'white',
                                    border: '1px solid var(--light-gray)',
                                    borderRadius: '8px',
                                    padding: '1.5rem'
                                }}
                            >
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'flex-start',
                                    marginBottom: '1rem'
                                }}>
                                    <div>
                                        <h3 style={{ 
                                            color: 'var(--navy-blue)', 
                                            margin: '0 0 0.5rem 0',
                                            fontSize: '1.3rem'
                                        }}>
                                            {user.name}
                                        </h3>
                                        <div style={{ 
                                            display: 'flex', 
                                            gap: '2rem',
                                            fontSize: '0.9rem',
                                            color: 'var(--charcoal-gray)'
                                        }}>
                                            <span>Age: {user.age}</span>
                                            <span>Workouts: {user.totalWorkouts}</span>
                                            <span>Screen Time: {formatScreenTime(user.screenTime)}</span>
                                            <span>Pull-ups: {user.totalPullups}</span>
                                            <span>Last Active: {formatDate(user.lastActive)}</span>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setShowUserDetails(user)}
                                            style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                                        >
                                            📊 Details
                                        </button>
                                        <button
                                            className="btn btn-accent"
                                            onClick={() => exportUserData(user)}
                                            style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                                        >
                                            📥 Export
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => resetUserData(user.id)}
                                            style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                                        >
                                            🔄 Reset Data
                                        </button>
                                        <button
                                            className="btn"
                                            onClick={() => setShowConfirmDelete(user.id)}
                                            style={{ 
                                                fontSize: '0.8rem', 
                                                padding: '0.5rem 1rem',
                                                background: 'var(--warning-red)',
                                                color: 'white'
                                            }}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Delete */}
                                {showConfirmDelete === user.id && (
                                    <div style={{
                                        background: '#fee2e2',
                                        border: '1px solid #fca5a5',
                                        borderRadius: '8px',
                                        padding: '1rem',
                                        marginTop: '1rem'
                                    }}>
                                        <p style={{ 
                                            color: '#dc2626', 
                                            fontWeight: 'bold',
                                            margin: '0 0 1rem 0'
                                        }}>
                                            ⚠️ Are you sure you want to delete {user.name}?
                                        </p>
                                        <p style={{ 
                                            color: '#7f1d1d', 
                                            fontSize: '0.9rem',
                                            margin: '0 0 1rem 0'
                                        }}>
                                            This will permanently remove their account and all data (workouts, screen time, progress).
                                        </p>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button
                                                className="btn"
                                                onClick={() => deleteUser(user.id)}
                                                style={{ 
                                                    background: '#dc2626',
                                                    color: 'white',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                Yes, Delete User
                                            </button>
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => setShowConfirmDelete(null)}
                                                style={{ fontSize: '0.9rem' }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* User Details Modal */}
            {showUserDetails && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '2rem',
                        maxWidth: '600px',
                        maxHeight: '80vh',
                        overflow: 'auto',
                        margin: '1rem'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '1.5rem'
                        }}>
                            <h2 style={{ color: 'var(--navy-blue)', margin: 0 }}>
                                📊 {showUserDetails.name}'s Details
                            </h2>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowUserDetails(null)}
                            >
                                ✕ Close
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <h4 style={{ color: 'var(--navy-blue)', margin: '0 0 0.5rem 0' }}>
                                    Account Info
                                </h4>
                                <p>Created: {formatDate(showUserDetails.createdAt)}</p>
                                <p>Age: {showUserDetails.age}</p>
                                <p>User ID: {showUserDetails.id}</p>
                            </div>

                            <div>
                                <h4 style={{ color: 'var(--navy-blue)', margin: '0 0 0.5rem 0' }}>
                                    Activity Summary
                                </h4>
                                <p>Total Workouts: {showUserDetails.totalWorkouts}</p>
                                <p>Screen Time Earned: {formatScreenTime(showUserDetails.screenTime)}</p>
                                <p>Total Pull-ups: {showUserDetails.totalPullups}</p>
                                <p>Last Active: {formatDate(showUserDetails.lastActive)}</p>
                            </div>

                            <div>
                                <h4 style={{ color: 'var(--navy-blue)', margin: '0 0 0.5rem 0' }}>
                                    Recent Workouts
                                </h4>
                                {(() => {
                                    const workouts = storage.getWorkouts(showUserDetails.id)
                                        .slice(-5)
                                        .reverse();
                                    
                                    return workouts.length > 0 ? (
                                        <div style={{ fontSize: '0.9rem' }}>
                                            {workouts.map((workout, index) => (
                                                <div key={index} style={{ 
                                                    padding: '0.5rem',
                                                    background: 'var(--light-gray)',
                                                    borderRadius: '4px',
                                                    marginBottom: '0.5rem'
                                                }}>
                                                    {formatDate(workout.date)} - {workout.rounds} rounds
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ color: 'var(--charcoal-gray)' }}>No workouts yet</p>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
