import React, { useState, useEffect } from 'react';
import { storage } from '../../utils/localStorage.js';
import { dateHelpers } from '../../utils/dateHelpers.js';

const Leaderboard = ({ user, onBack }) => {
    const [weeklyLeaderboard, setWeeklyLeaderboard] = useState([]);
    const [monthlyLeaderboard, setMonthlyLeaderboard] = useState([]);
    const [activeTab, setActiveTab] = useState('weekly');

    useEffect(() => {
        loadLeaderboards();
    }, []);

    const loadLeaderboards = () => {
        const users = storage.getUsers();
        const allWorkouts = [];
        
        // Get all workouts for all users
        users.forEach(u => {
            const userWorkouts = storage.getWorkouts(u.id);
            userWorkouts.forEach(workout => {
                allWorkouts.push({
                    ...workout,
                    userName: u.name,
                    userAge: u.age
                });
            });
        });

        // Calculate weekly leaderboard
        const weeklyData = calculateWeeklyLeaderboard(users, allWorkouts);
        setWeeklyLeaderboard(weeklyData);

        // Calculate monthly leaderboard (pull-up progress)
        const monthlyData = calculateMonthlyLeaderboard(users);
        setMonthlyLeaderboard(monthlyData);
    };

    const calculateWeeklyLeaderboard = (users, allWorkouts) => {
        const weeklyStats = users.map(u => {
            const userWorkouts = allWorkouts.filter(w => 
                w.userId === u.id && dateHelpers.isThisWeek(w.date)
            );
            
            const cyclesThisWeek = userWorkouts.length;
            const daysThisWeek = dateHelpers.getWorkoutDaysThisWeek(userWorkouts);
            const screenTimeEarned = cyclesThisWeek * 10;

            return {
                id: u.id,
                name: u.name,
                age: u.age,
                cycles: cyclesThisWeek,
                days: daysThisWeek,
                screenTime: screenTimeEarned,
                score: cyclesThisWeek // Primary sort by cycles
            };
        });

        return weeklyStats
            .filter(stat => stat.cycles > 0) // Only show users with workouts
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return b.days - a.days; // Tie-breaker: days worked out
            });
    };

    const calculateMonthlyLeaderboard = (users) => {
        const monthlyStats = users.map(u => {
            const pullupProgress = storage.getPullupProgress(u.id);
            const thisMonthProgress = pullupProgress.filter(p => 
                dateHelpers.isThisMonth(p.date)
            );

            const totalPullups = thisMonthProgress.reduce((sum, p) => sum + p.reps, 0);
            const bestDay = thisMonthProgress.length > 0 
                ? Math.max(...thisMonthProgress.map(p => p.reps))
                : 0;

            // Calculate improvement (compare first week to latest week)
            const firstWeekAvg = thisMonthProgress.slice(0, 7).reduce((sum, p, _, arr) => 
                sum + p.reps / arr.length, 0) || 0;
            const lastWeekAvg = thisMonthProgress.slice(-7).reduce((sum, p, _, arr) => 
                sum + p.reps / arr.length, 0) || 0;
            const improvement = lastWeekAvg - firstWeekAvg;

            return {
                id: u.id,
                name: u.name,
                age: u.age,
                totalPullups,
                bestDay,
                improvement: Math.round(improvement * 10) / 10,
                score: totalPullups // Primary sort by total pull-ups
            };
        });

        return monthlyStats
            .filter(stat => stat.totalPullups > 0)
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return b.improvement - a.improvement; // Tie-breaker: improvement
            });
    };

    const getUserRank = (leaderboard, userId) => {
        const index = leaderboard.findIndex(entry => entry.id === userId);
        return index >= 0 ? index + 1 : null;
    };

    const getRankEmoji = (rank) => {
        switch (rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return '🏅';
        }
    };

    const currentLeaderboard = activeTab === 'weekly' ? weeklyLeaderboard : monthlyLeaderboard;
    const userRank = getUserRank(currentLeaderboard, user.id);

    return (
        <div className="main-content">
            <div className="card">
                <div className="card-header">
                    <h1 className="card-title">🏆 Warrior Leaderboard</h1>
                    <button className="btn btn-secondary" onClick={onBack}>
                        ← Back to Dashboard
                    </button>
                </div>

                {/* Tab Navigation */}
                <div style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    marginBottom: '2rem',
                    borderBottom: '2px solid var(--light-gray)',
                    paddingBottom: '1rem'
                }}>
                    <button 
                        className={`btn ${activeTab === 'weekly' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('weekly')}
                    >
                        📅 This Week
                    </button>
                    <button 
                        className={`btn ${activeTab === 'monthly' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('monthly')}
                    >
                        💪 Pull-up Champions
                    </button>
                </div>

                {/* User's Current Rank */}
                {userRank && (
                    <div style={{
                        background: 'var(--accent-gradient)',
                        color: 'white',
                        padding: '1rem',
                        borderRadius: '8px',
                        textAlign: 'center',
                        marginBottom: '2rem'
                    }}>
                        <h3 style={{ margin: 0 }}>
                            {getRankEmoji(userRank)} Your Current Rank: #{userRank}
                        </h3>
                        <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
                            {activeTab === 'weekly' 
                                ? 'Based on workout cycles this week'
                                : 'Based on total pull-ups this month'
                            }
                        </p>
                    </div>
                )}

                {/* Leaderboard Content */}
                {activeTab === 'weekly' && (
                    <div>
                        <h2 style={{ color: 'var(--navy-blue)', marginBottom: '1rem' }}>
                            Weekly Workout Champions
                        </h2>
                        <p style={{ color: 'var(--charcoal-gray)', marginBottom: '2rem' }}>
                            Ranked by total workout cycles completed this week
                        </p>

                        {weeklyLeaderboard.length === 0 ? (
                            <div style={{ 
                                textAlign: 'center', 
                                padding: '2rem',
                                color: 'var(--charcoal-gray)'
                            }}>
                                <p>No workouts completed this week yet.</p>
                                <p>Be the first warrior to start training!</p>
                            </div>
                        ) : (
                            <div className="leaderboard">
                                {weeklyLeaderboard.map((entry, index) => (
                                    <div 
                                        key={entry.id} 
                                        className="leaderboard-item"
                                        style={{
                                            background: entry.id === user.id ? 'var(--light-gray)' : 'white',
                                            border: entry.id === user.id ? '2px solid var(--amber-orange)' : 'none'
                                        }}
                                    >
                                        <div className="leaderboard-rank">
                                            {getRankEmoji(index + 1)} #{index + 1}
                                        </div>
                                        <div className="leaderboard-name">
                                            {entry.name} {entry.id === user.id && '(You)'}
                                            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                                Age {entry.age} • {entry.days} days • {entry.screenTime} min earned
                                            </div>
                                        </div>
                                        <div className="leaderboard-score">
                                            {entry.cycles} cycles
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'monthly' && (
                    <div>
                        <h2 style={{ color: 'var(--navy-blue)', marginBottom: '1rem' }}>
                            Pull-up Champions
                        </h2>
                        <p style={{ color: 'var(--charcoal-gray)', marginBottom: '2rem' }}>
                            Ranked by total pull-ups completed this month
                        </p>

                        {monthlyLeaderboard.length === 0 ? (
                            <div style={{ 
                                textAlign: 'center', 
                                padding: '2rem',
                                color: 'var(--charcoal-gray)'
                            }}>
                                <p>No pull-ups recorded this month yet.</p>
                                <p>Start your pull-up journey today!</p>
                            </div>
                        ) : (
                            <div className="leaderboard">
                                {monthlyLeaderboard.map((entry, index) => (
                                    <div 
                                        key={entry.id} 
                                        className="leaderboard-item"
                                        style={{
                                            background: entry.id === user.id ? 'var(--light-gray)' : 'white',
                                            border: entry.id === user.id ? '2px solid var(--amber-orange)' : 'none'
                                        }}
                                    >
                                        <div className="leaderboard-rank">
                                            {getRankEmoji(index + 1)} #{index + 1}
                                        </div>
                                        <div className="leaderboard-name">
                                            {entry.name} {entry.id === user.id && '(You)'}
                                            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                                Best day: {entry.bestDay} • Improvement: +{entry.improvement}
                                            </div>
                                        </div>
                                        <div className="leaderboard-score">
                                            {entry.totalPullups} total
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Motivational Footer */}
                <div style={{
                    marginTop: '2rem',
                    padding: '1.5rem',
                    background: 'var(--primary-gradient)',
                    color: 'white',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>
                        🌟 Remember, Warriors
                    </h3>
                    <p style={{ margin: 0, opacity: 0.9 }}>
                        "The most important thing is to try and inspire people so they can be great at whatever they want to do." - Jocko Willink
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
