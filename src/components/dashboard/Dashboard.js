import React, { useState, useEffect, useCallback } from 'react';
import { storage } from '../../utils/localStorage';
import { dateHelpers } from '../../utils/dateHelpers';
import exercises from '../../data/exercises';
import SuperheroAvatar from './SuperheroAvatar';

const Dashboard = ({ user, onStartWorkout, onViewCompetition, onViewProgress }) => {
    const [screenTime, setScreenTime] = useState(0);
    const [weeklyProgress, setWeeklyProgress] = useState(0);
    const [todayWorkouts, setTodayWorkouts] = useState(0);
    const [superheroType, setSuperheroType] = useState('strength');

    const loadUserData = useCallback(async () => {
        try {
            const userScreenTime = await storage.getScreenTime(user.id);
            const userWorkouts = await storage.getWorkouts(user.id);
            const today = dateHelpers.getTodayString();
            
            setScreenTime(userScreenTime);
            
            // Calculate weekly progress (5/7 days goal)
            const daysThisWeek = dateHelpers.getWorkoutDaysThisWeek(userWorkouts);
            setWeeklyProgress(daysThisWeek);
            
            // Count today's completed cycles
            const todayCycles = userWorkouts.filter(w => w.date === today).length;
            setTodayWorkouts(todayCycles);
        } catch (error) {
            console.error('Error loading user data:', error);
            // Set default values on error
            setScreenTime(0);
            setWeeklyProgress(0);
            setTodayWorkouts(0);
        }
    }, [user.id]);

    useEffect(() => {
        loadUserData();
    }, [loadUserData]);



    const formatScreenTime = (minutes) => {
        if (minutes < 60) {
            return `${minutes} min`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    };



    return (
        <div className="main-content">
            {/* Welcome Section */}
            <div className="card">
                <h1 style={{ color: 'var(--navy-blue)', marginBottom: '0.5rem' }}>
                    Welcome back, {user.name}! 💪
                </h1>
                <p style={{ color: 'var(--charcoal-gray)', fontSize: '1.1rem' }}>
                    Ready to earn some screen time and become stronger?
                </p>
            </div>

            {/* Stats Grid */}
            <div className="dashboard-grid">
                {/* Screen Time Bank */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">🎮 Screen Time Bank</h2>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                            fontSize: '2.5rem', 
                            fontWeight: 'bold', 
                            color: 'var(--amber-orange)',
                            marginBottom: '0.5rem'
                        }}>
                            {formatScreenTime(screenTime)}
                        </div>
                        <p style={{ color: 'var(--charcoal-gray)' }}>
                            Available to use
                        </p>
                        <div style={{ 
                            fontSize: '0.9rem', 
                            color: 'var(--forest-green)',
                            marginTop: '1rem',
                            padding: '0.5rem',
                            background: 'var(--light-gray)',
                            borderRadius: '8px'
                        }}>
                            💡 Complete a workout cycle to earn 10 more minutes!
                        </div>
                    </div>
                </div>

                {/* Weekly Progress - Superhero Avatar */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">🦸‍♂️ Your Superhero Progress</h2>
                    </div>
                    
                    {/* Superhero Type Selector */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem',
                        flexWrap: 'wrap'
                    }}>
                        {[
                            { type: 'strength', emoji: '💪', name: 'Strength' },
                            { type: 'speed', emoji: '⚡', name: 'Speed' },
                            { type: 'tech', emoji: '🤖', name: 'Tech' },
                            { type: 'fire', emoji: '🔥', name: 'Fire' }
                        ].map(hero => (
                            <button
                                key={hero.type}
                                onClick={() => setSuperheroType(hero.type)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    border: 'none',
                                    borderRadius: '20px',
                                    background: superheroType === hero.type ? 'var(--amber-orange)' : 'var(--light-gray)',
                                    color: superheroType === hero.type ? 'white' : 'var(--charcoal-gray)',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {hero.emoji} {hero.name}
                            </button>
                        ))}
                    </div>
                    
                    <SuperheroAvatar weeklyProgress={weeklyProgress} superheroType={superheroType} size="large" />
                    <p style={{ 
                        textAlign: 'center', 
                        color: 'var(--charcoal-gray)',
                        marginTop: '1rem',
                        fontSize: '0.9rem'
                    }}>
                        {weeklyProgress >= 5 
                            ? "🎉 You've achieved LEGENDARY status this week!" 
                            : `Train ${5 - weeklyProgress} more days to become a Legendary Hero!`
                        }
                    </p>
                </div>

                {/* Today's Progress */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">🏃‍♂️ Today's Training</h2>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                            fontSize: '2rem', 
                            fontWeight: 'bold', 
                            color: 'var(--navy-blue)',
                            marginBottom: '0.5rem'
                        }}>
                            {todayWorkouts}
                        </div>
                        <p style={{ color: 'var(--charcoal-gray)' }}>
                            Cycles completed today
                        </p>
                        {todayWorkouts > 0 && (
                            <div style={{ 
                                fontSize: '0.9rem', 
                                color: 'var(--success-green)',
                                marginTop: '1rem'
                            }}>
                                ⚡ Earned {todayWorkouts * 10} minutes of screen time today!
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">🎯 Ready for Action?</h2>
                </div>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '1rem' 
                }}>
                    <button 
                        className="btn btn-primary pulse"
                        onClick={onStartWorkout}
                        style={{ padding: '1.5rem', fontSize: '1.1rem' }}
                    >
                        🏋️‍♂️ Start Workout
                    </button>
                    <button 
                        className="btn btn-accent"
                        onClick={onViewCompetition}
                        style={{ padding: '1.5rem', fontSize: '1.1rem' }}
                    >
                        🏆 View Leaderboard
                    </button>
                    <button 
                        className="btn btn-secondary"
                        onClick={onViewProgress}
                        style={{ padding: '1.5rem', fontSize: '1.1rem' }}
                    >
                        📊 My Progress
                    </button>
                </div>
            </div>

            {/* Today's Workout Preview */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">💪 Today's Workout Circuit</h2>
                </div>
                <div className="exercise-list">
                    {exercises.map((exercise, index) => (
                        <div key={exercise.id} className="exercise-item">
                            <div className="exercise-avatar" style={{
                                fontSize: '2rem',
                                marginRight: '0.1rem',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'transform 0.3s ease'
                            }}>
                                {exercise.avatar}
                            </div>
                            <div className="exercise-info">
                                <h3>{index + 1}. {exercise.name}</h3>
                                <p>{exercise.instructions}</p>
                            </div>
                            <div className="exercise-target">
                                {exercise.target} {exercise.unit}
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ 
                    textAlign: 'center', 
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: 'var(--light-gray)',
                    borderRadius: '8px'
                }}>
                    <p style={{ 
                        color: 'var(--navy-blue)', 
                        fontWeight: 'bold',
                        marginBottom: '0.5rem'
                    }}>
                        Complete 2-3 rounds of this circuit to earn 10 minutes of screen time!
                    </p>
                    <p style={{ color: 'var(--charcoal-gray)', fontSize: '0.9rem' }}>
                        You can do multiple cycles throughout the day to earn more time.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
