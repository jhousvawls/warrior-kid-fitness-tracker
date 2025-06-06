import React, { useState, useEffect, useCallback } from 'react';
import { storage } from '../../utils/localStorage';
import { dateHelpers } from '../../utils/dateHelpers';

const Leaderboard = ({ user, onBack }) => {
    const [weeklyLeaderboard, setWeeklyLeaderboard] = useState([]);
    const [monthlyLeaderboard, setMonthlyLeaderboard] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [activeTab, setActiveTab] = useState('weekly');
    const [debugInfo, setDebugInfo] = useState(null);

    const loadLeaderboards = useCallback(async () => {
        try {
            const users = await storage.getUsers();
            const allWorkouts = [];
            
            // Get all workouts for all users
            for (const u of users) {
                const userWorkouts = await storage.getWorkouts(u.id);
                userWorkouts.forEach(workout => {
                    allWorkouts.push({
                        ...workout,
                        userName: u.name,
                        userAge: u.age
                    });
                });
            }

            // Set debug info
            setDebugInfo({
                totalUsers: users.length,
                totalWorkouts: allWorkouts.length,
                currentWeek: `${dateHelpers.getWeekStart()} to ${dateHelpers.getWeekEnd()}`,
                todayDate: dateHelpers.getTodayString(),
                userWorkouts: allWorkouts.filter(w => w.userId === user.id).length,
                recentWorkouts: allWorkouts.slice(-5).map(w => ({ date: w.date, user: w.userName }))
            });

            // Calculate weekly leaderboard
            const weeklyData = await calculateWeeklyLeaderboard(users, allWorkouts);
            setWeeklyLeaderboard(weeklyData);

            // Calculate monthly leaderboard (pull-up progress)
            const monthlyData = await calculateMonthlyLeaderboard(users);
            setMonthlyLeaderboard(monthlyData);

            // Calculate recent activity (last 30 days)
            const recentData = calculateRecentActivity(users, allWorkouts);
            setRecentActivity(recentData);
        } catch (error) {
            console.error('Error loading leaderboards:', error);
            // Set default values on error
            setWeeklyLeaderboard([]);
            setMonthlyLeaderboard([]);
            setRecentActivity([]);
            setDebugInfo(null);
        }
    }, [user.id]);

    useEffect(() => {
        loadLeaderboards();
    }, [loadLeaderboards]);



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

    const calculateMonthlyLeaderboard = async (users) => {
        const monthlyStats = await Promise.all(users.map(async (u) => {
            const pullupProgress = await storage.getPullupProgress(u.id);
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
        }));

        return monthlyStats
            .filter(stat => stat.totalPullups > 0)
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return b.improvement - a.improvement; // Tie-breaker: improvement
            });
    };

    const calculateRecentActivity = (users, allWorkouts) => {
        // Get workouts from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoString = thirtyDaysAgo.toISOString().split('T')[0];

        const recentStats = users.map(u => {
            const userWorkouts = allWorkouts.filter(w => 
                w.userId === u.id && w.date >= thirtyDaysAgoString
            );
            
            const totalCycles = userWorkouts.length;
            const uniqueDays = [...new Set(userWorkouts.map(w => w.date))].length;
            const lastWorkout = userWorkouts.length > 0 
                ? Math.max(...userWorkouts.map(w => new Date(w.date).getTime()))
                : 0;

            return {
                id: u.id,
                name: u.name,
                age: u.age,
                cycles: totalCycles,
                days: uniqueDays,
                lastWorkout: lastWorkout ? new Date(lastWorkout).toISOString().split('T')[0] : null,
                score: totalCycles
            };
        });

        return recentStats
            .filter(stat => stat.cycles > 0)
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return new Date(b.lastWorkout) - new Date(a.lastWorkout);
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

    const currentLeaderboard = activeTab === 'weekly' ? weeklyLeaderboard : 
                              activeTab === 'monthly' ? monthlyLeaderboard : recentActivity;
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

                {/* Debug Info */}
                {debugInfo && (
                    <div style={{
                        background: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '2rem',
                        fontSize: '0.9rem'
                    }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--navy-blue)' }}>🔍 Debug Info</h4>
                        <p style={{ margin: '0.25rem 0' }}>Total Users: {debugInfo.totalUsers} | Total Workouts: {debugInfo.totalWorkouts}</p>
                        <p style={{ margin: '0.25rem 0' }}>Your Workouts: {debugInfo.userWorkouts} | Today: {debugInfo.todayDate}</p>
                        <p style={{ margin: '0.25rem 0' }}>Current Week: {debugInfo.currentWeek}</p>
                        <p style={{ margin: '0.25rem 0' }}>Recent Workouts: {debugInfo.recentWorkouts.map(w => `${w.date} (${w.user})`).join(', ') || 'None'}</p>
                    </div>
                )}

                {/* Tab Navigation */}
                <div style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    marginBottom: '2rem',
                    borderBottom: '2px solid var(--light-gray)',
                    paddingBottom: '1rem',
                    flexWrap: 'wrap'
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
                    <button 
                        className={`btn ${activeTab === 'recent' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('recent')}
                    >
                        🔥 Recent Activity
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
                                : activeTab === 'monthly'
                                ? 'Based on total pull-ups this month'
                                : 'Based on workout cycles in last 30 days'
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

                {activeTab === 'recent' && (
                    <div>
                        <h2 style={{ color: 'var(--navy-blue)', marginBottom: '1rem' }}>
                            Recent Activity (Last 30 Days)
                        </h2>
                        <p style={{ color: 'var(--charcoal-gray)', marginBottom: '2rem' }}>
                            Ranked by total workout cycles completed in the last 30 days
                        </p>

                        {recentActivity.length === 0 ? (
                            <div style={{ 
                                textAlign: 'center', 
                                padding: '2rem',
                                color: 'var(--charcoal-gray)'
                            }}>
                                <p>No workouts completed in the last 30 days.</p>
                                <p>Time to get back into warrior mode!</p>
                            </div>
                        ) : (
                            <div className="leaderboard">
                                {recentActivity.map((entry, index) => (
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
                                                Age {entry.age} • {entry.days} days • Last: {dateHelpers.formatDate(entry.lastWorkout)}
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
