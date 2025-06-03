import React, { useState, useEffect } from 'react';
import { storage } from '../../utils/localStorage';
import { dateHelpers } from '../../utils/dateHelpers';

const ProgressTracker = ({ user, onBack }) => {
    const [workouts, setWorkouts] = useState([]);
    const [pullupProgress, setPullupProgress] = useState([]);
    const [weeklyStats, setWeeklyStats] = useState({});
    const [monthlyStats, setMonthlyStats] = useState({});

    useEffect(() => {
        loadProgressData();
    }, [user]);

    const loadProgressData = () => {
        const userWorkouts = storage.getWorkouts(user.id);
        const userPullupProgress = storage.getPullupProgress(user.id);
        
        setWorkouts(userWorkouts);
        setPullupProgress(userPullupProgress);
        
        calculateWeeklyStats(userWorkouts);
        calculateMonthlyStats(userWorkouts, userPullupProgress);
    };

    const calculateWeeklyStats = (workouts) => {
        const thisWeekWorkouts = workouts.filter(w => dateHelpers.isThisWeek(w.date));
        const daysThisWeek = dateHelpers.getWorkoutDaysThisWeek(workouts);
        const cyclesThisWeek = thisWeekWorkouts.length;
        const screenTimeEarned = cyclesThisWeek * 10;
        
        // Get workout days for the week
        const weekDates = dateHelpers.getWeekDates();
        const workoutDays = weekDates.map(date => ({
            date,
            hasWorkout: workouts.some(w => w.date === date),
            isToday: dateHelpers.isToday(date),
            dayName: dateHelpers.formatDate(date).split(',')[0]
        }));

        setWeeklyStats({
            daysWorkedOut: daysThisWeek,
            totalCycles: cyclesThisWeek,
            screenTimeEarned,
            workoutDays,
            goalProgress: (daysThisWeek / 5) * 100
        });
    };

    const calculateMonthlyStats = (workouts, pullupData) => {
        const thisMonthWorkouts = workouts.filter(w => dateHelpers.isThisMonth(w.date));
        const thisMonthPullups = pullupData.filter(p => dateHelpers.isThisMonth(p.date));
        
        const totalWorkouts = thisMonthWorkouts.length;
        const totalPullups = thisMonthPullups.reduce((sum, p) => sum + p.reps, 0);
        const bestPullupDay = thisMonthPullups.length > 0 
            ? Math.max(...thisMonthPullups.map(p => p.reps))
            : 0;
        
        // Calculate improvement trend
        const sortedPullups = thisMonthPullups.sort((a, b) => new Date(a.date) - new Date(b.date));
        const firstWeek = sortedPullups.slice(0, 7);
        const lastWeek = sortedPullups.slice(-7);
        
        const firstWeekAvg = firstWeek.length > 0 
            ? firstWeek.reduce((sum, p) => sum + p.reps, 0) / firstWeek.length
            : 0;
        const lastWeekAvg = lastWeek.length > 0 
            ? lastWeek.reduce((sum, p) => sum + p.reps, 0) / lastWeek.length
            : 0;
        
        const improvement = lastWeekAvg - firstWeekAvg;

        setMonthlyStats({
            totalWorkouts,
            totalPullups,
            bestPullupDay,
            improvement: Math.round(improvement * 10) / 10,
            averagePullups: thisMonthPullups.length > 0 
                ? Math.round((totalPullups / thisMonthPullups.length) * 10) / 10
                : 0
        });
    };

    const getRecentWorkouts = () => {
        return workouts
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);
    };

    const getPullupChart = () => {
        const last30Days = pullupProgress
            .filter(p => {
                const date = new Date(p.date);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return date >= thirtyDaysAgo;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        return last30Days;
    };

    return (
        <div className="main-content">
            <div className="card">
                <div className="card-header">
                    <h1 className="card-title">📊 {user.name}'s Progress</h1>
                    <button className="btn btn-secondary" onClick={onBack}>
                        ← Back to Dashboard
                    </button>
                </div>
            </div>

            {/* Weekly Progress */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">📅 This Week's Progress</h2>
                </div>
                
                <div className="dashboard-grid">
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--navy-blue)', margin: '0 0 0.5rem 0' }}>
                            {weeklyStats.daysWorkedOut}/5
                        </h3>
                        <p style={{ color: 'var(--charcoal-gray)', margin: 0 }}>Days Completed</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--forest-green)', margin: '0 0 0.5rem 0' }}>
                            {weeklyStats.totalCycles}
                        </h3>
                        <p style={{ color: 'var(--charcoal-gray)', margin: 0 }}>Total Cycles</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--amber-orange)', margin: '0 0 0.5rem 0' }}>
                            {weeklyStats.screenTimeEarned} min
                        </h3>
                        <p style={{ color: 'var(--charcoal-gray)', margin: 0 }}>Screen Time Earned</p>
                    </div>
                </div>

                {/* Weekly Calendar */}
                <div style={{ marginTop: '2rem' }}>
                    <h3 style={{ color: 'var(--navy-blue)', marginBottom: '1rem' }}>
                        Weekly Calendar
                    </h3>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(7, 1fr)', 
                        gap: '0.5rem' 
                    }}>
                        {weeklyStats.workoutDays?.map((day, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: '1rem 0.5rem',
                                    textAlign: 'center',
                                    borderRadius: '8px',
                                    background: day.hasWorkout 
                                        ? 'var(--success-green)' 
                                        : day.isToday 
                                            ? 'var(--amber-orange)'
                                            : 'var(--light-gray)',
                                    color: day.hasWorkout || day.isToday ? 'white' : 'var(--charcoal-gray)',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <div style={{ fontWeight: 'bold' }}>
                                    {day.dayName}
                                </div>
                                <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                    {day.hasWorkout ? '✅' : day.isToday ? '📅' : '⭕'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Goal Progress */}
                <div style={{ marginTop: '2rem' }}>
                    <div className="weekly-progress">
                        <span className="progress-text">Goal Progress</span>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ 
                                    width: `${Math.min(weeklyStats.goalProgress, 100)}%`,
                                    backgroundColor: weeklyStats.goalProgress >= 100 
                                        ? 'var(--success-green)' 
                                        : 'var(--amber-orange)'
                                }}
                            ></div>
                        </div>
                        <span className="progress-text">
                            {Math.round(weeklyStats.goalProgress)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Monthly Stats */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">💪 This Month's Achievements</h2>
                </div>
                
                <div className="dashboard-grid">
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--navy-blue)', margin: '0 0 0.5rem 0' }}>
                            {monthlyStats.totalWorkouts}
                        </h3>
                        <p style={{ color: 'var(--charcoal-gray)', margin: 0 }}>Total Workouts</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--forest-green)', margin: '0 0 0.5rem 0' }}>
                            {monthlyStats.totalPullups}
                        </h3>
                        <p style={{ color: 'var(--charcoal-gray)', margin: 0 }}>Total Pull-ups</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--amber-orange)', margin: '0 0 0.5rem 0' }}>
                            {monthlyStats.bestPullupDay}
                        </h3>
                        <p style={{ color: 'var(--charcoal-gray)', margin: 0 }}>Best Single Day</p>
                    </div>
                </div>

                {monthlyStats.improvement !== 0 && (
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1rem',
                        background: monthlyStats.improvement > 0 
                            ? 'var(--success-green)' 
                            : 'var(--warning-red)',
                        color: 'white',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ margin: '0 0 0.5rem 0' }}>
                            {monthlyStats.improvement > 0 ? '📈' : '📉'} Pull-up Improvement
                        </h3>
                        <p style={{ margin: 0, fontSize: '1.1rem' }}>
                            {monthlyStats.improvement > 0 ? '+' : ''}{monthlyStats.improvement} average reps
                        </p>
                    </div>
                )}
            </div>

            {/* Pull-up Progress Chart */}
            {getPullupChart().length > 0 && (
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">📈 Pull-up Progress (Last 30 Days)</h2>
                    </div>
                    
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'end', 
                        gap: '0.25rem',
                        height: '200px',
                        padding: '1rem',
                        background: 'var(--light-gray)',
                        borderRadius: '8px',
                        overflowX: 'auto'
                    }}>
                        {getPullupChart().map((entry, index) => {
                            const maxReps = Math.max(...getPullupChart().map(e => e.reps));
                            const height = (entry.reps / maxReps) * 150;
                            
                            return (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        minWidth: '40px'
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '20px',
                                            height: `${height}px`,
                                            background: 'var(--forest-green)',
                                            borderRadius: '4px 4px 0 0',
                                            marginBottom: '0.5rem'
                                        }}
                                        title={`${entry.reps} pull-ups on ${dateHelpers.formatDate(entry.date)}`}
                                    ></div>
                                    <div style={{ 
                                        fontSize: '0.7rem', 
                                        color: 'var(--charcoal-gray)',
                                        transform: 'rotate(-45deg)',
                                        transformOrigin: 'center'
                                    }}>
                                        {new Date(entry.date).getDate()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Recent Workouts */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">🏃‍♂️ Recent Workouts</h2>
                </div>
                
                {getRecentWorkouts().length === 0 ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '2rem',
                        color: 'var(--charcoal-gray)'
                    }}>
                        <p>No workouts completed yet.</p>
                        <p>Start your first workout to see your progress!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {getRecentWorkouts().map((workout, index) => (
                            <div
                                key={workout.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    background: 'white',
                                    borderRadius: '8px',
                                    border: '1px solid var(--light-gray)'
                                }}
                            >
                                <div>
                                    <div style={{ 
                                        fontWeight: 'bold', 
                                        color: 'var(--navy-blue)',
                                        marginBottom: '0.25rem'
                                    }}>
                                        {dateHelpers.formatDate(workout.date)}
                                    </div>
                                    <div style={{ 
                                        fontSize: '0.9rem', 
                                        color: 'var(--charcoal-gray)' 
                                    }}>
                                        {workout.rounds} rounds completed
                                    </div>
                                </div>
                                <div style={{ 
                                    color: 'var(--forest-green)', 
                                    fontWeight: 'bold' 
                                }}>
                                    +10 min
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgressTracker;
