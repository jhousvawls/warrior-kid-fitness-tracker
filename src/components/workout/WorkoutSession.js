import React, { useState, useEffect } from 'react';
import { storage } from '../../utils/localStorage';
import { dateHelpers } from '../../utils/dateHelpers';
import exercises from '../../data/exercises';

// Power-up messages for motivation
const POWER_UP_MESSAGES = [
    "💥 POWER SURGE! You're unstoppable!",
    "⚡ LIGHTNING SPEED! Keep crushing it!",
    "🔥 ON FIRE! You're a warrior machine!",
    "🚀 ROCKET BOOST! Nothing can stop you!",
    "💪 BEAST MODE ACTIVATED!",
    "🌟 LEGENDARY PERFORMANCE!",
    "⭐ CHAMPION ENERGY UNLOCKED!",
    "🎯 PERFECT FORM! You're a pro!"
];

const COMPLETION_CELEBRATIONS = [
    "🎉 BOOM! Exercise crushed!",
    "💥 SMASHED IT! You're incredible!",
    "⚡ LIGHTNING FAST! Amazing work!",
    "🔥 FIRED UP! Keep the energy!",
    "🚀 ROCKET POWER! Unstoppable!",
    "🌟 STAR PERFORMANCE! Legendary!"
];

const WorkoutSession = ({ user, onComplete, onCancel }) => {
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [completedExercises, setCompletedExercises] = useState([]);
    const [pullupReps, setPullupReps] = useState('');
    const [currentRound, setCurrentRound] = useState(1);
    const [totalRounds] = useState(3); // Default to 3 rounds
    const [showCelebration, setShowCelebration] = useState(false);
    const [celebrationMessage, setCelebrationMessage] = useState('');
    const [powerUpMessage, setPowerUpMessage] = useState('');
    const [showPowerUp, setShowPowerUp] = useState(false);
    const [comboCount, setComboCount] = useState(0);
    const [isOnFire, setIsOnFire] = useState(false);

    const currentExercise = exercises[currentExerciseIndex];
    const isLastExercise = currentExerciseIndex === exercises.length - 1;
    const isLastRound = currentRound === totalRounds;

    useEffect(() => {
        let interval;
        if (isTimerRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer(timer - 1);
            }, 1000);
        } else if (timer === 0 && isTimerRunning) {
            setIsTimerRunning(false);
            // Auto-complete timed exercises when timer reaches 0
            if (currentExercise.type === 'time') {
                handleExerciseComplete();
            }
        }
        return () => clearInterval(interval);
    }, [timer, isTimerRunning]);

    const startTimer = () => {
        if (currentExercise.type === 'time') {
            setTimer(currentExercise.target);
            setIsTimerRunning(true);
        }
    };

    const handleExerciseComplete = () => {
        const exerciseData = {
            exerciseId: currentExercise.id,
            exerciseName: currentExercise.name,
            completed: true,
            round: currentRound
        };

        // Special handling for pull-ups
        if (currentExercise.isSpecial && pullupReps) {
            exerciseData.reps = parseInt(pullupReps);
        }

        setCompletedExercises([...completedExercises, exerciseData]);

        // Trigger celebration animation
        const randomCelebration = COMPLETION_CELEBRATIONS[Math.floor(Math.random() * COMPLETION_CELEBRATIONS.length)];
        setCelebrationMessage(randomCelebration);
        setShowCelebration(true);
        
        // Update combo count and check for power-ups
        const newComboCount = comboCount + 1;
        setComboCount(newComboCount);
        
        // Trigger power-up effects for combos
        if (newComboCount >= 3) {
            const randomPowerUp = POWER_UP_MESSAGES[Math.floor(Math.random() * POWER_UP_MESSAGES.length)];
            setPowerUpMessage(randomPowerUp);
            setShowPowerUp(true);
            setIsOnFire(true);
            
            // Reset power-up after 3 seconds
            setTimeout(() => {
                setShowPowerUp(false);
                setIsOnFire(false);
            }, 3000);
        }
        
        // Reset celebration after 2 seconds
        setTimeout(() => {
            setShowCelebration(false);
        }, 2000);

        if (isLastExercise) {
            // Award 10 minutes of screen time for completing this cycle/round
            storage.addScreenTime(user.id, 10);
            
            if (isLastRound) {
                // Workout complete!
                completeWorkout();
            } else {
                // Start next round
                setCurrentRound(currentRound + 1);
                setCurrentExerciseIndex(0);
                setIsResting(true);
                setTimer(30); // 30 second rest between rounds
                setIsTimerRunning(true);
            }
        } else {
            // Move to next exercise
            setCurrentExerciseIndex(currentExerciseIndex + 1);
            setIsResting(true);
            setTimer(15); // 15 second rest between exercises
            setIsTimerRunning(true);
        }

        setPullupReps('');
    };

    const completeWorkout = () => {
        const workout = {
            id: Date.now().toString(),
            userId: user.id,
            date: dateHelpers.getTodayString(),
            exercises: completedExercises,
            rounds: totalRounds,
            completedAt: new Date().toISOString()
        };

        // Save workout
        storage.saveWorkout(workout);

        // Note: Screen time is already awarded after each cycle completion

        // Save pull-up progress if any pull-ups were completed
        const pullupData = completedExercises.filter(e => e.reps);
        if (pullupData.length > 0) {
            const totalPullups = pullupData.reduce((sum, e) => sum + e.reps, 0);
            storage.savePullupProgress(user.id, totalPullups, dateHelpers.getTodayString());
        }

        onComplete();
    };

    const handleRestComplete = () => {
        setIsResting(false);
        setTimer(0);
        setIsTimerRunning(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (isResting) {
        return (
            <div className="workout-session">
                <div className="exercise-card" style={{
                    background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                    border: '2px solid var(--navy-blue)',
                    textAlign: 'center',
                    maxWidth: '500px',
                    margin: '2rem auto'
                }}>
                    {/* Rest Header */}
                    <div style={{
                        background: 'white',
                        color: 'var(--navy-blue)',
                        padding: '1.5rem',
                        margin: '-2rem -2rem 2rem -2rem',
                        borderRadius: '12px 12px 0 0',
                        borderBottom: '2px solid var(--navy-blue)'
                    }}>
                        <h2 style={{ 
                            margin: 0, 
                            fontSize: '1.8rem',
                            fontWeight: 'bold',
                            color: 'var(--navy-blue)'
                        }}>🛌 Rest Time</h2>
                        <p style={{ 
                            margin: '0.5rem 0 0 0', 
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: 'var(--charcoal-gray)'
                        }}>
                            {isLastExercise && !isLastRound 
                                ? `Round ${currentRound - 1} Complete! 🎉`
                                : 'Quick Break Time'
                            }
                        </p>
                    </div>

                    {/* Timer Display */}
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '2rem',
                        margin: '1.5rem 0',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                        border: '3px solid var(--amber-orange)'
                    }}>
                        <div style={{
                            fontSize: '4rem',
                            fontWeight: 'bold',
                            color: 'var(--amber-orange)',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                            fontFamily: 'monospace'
                        }}>
                            {formatTime(timer)}
                        </div>
                    </div>

                    {/* Message */}
                    <div style={{
                        background: 'rgba(255,255,255,0.8)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        margin: '1.5rem 0',
                        border: '1px solid rgba(30, 58, 138, 0.2)'
                    }}>
                        <p style={{ 
                            color: 'var(--navy-blue)', 
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            margin: 0,
                            lineHeight: '1.4'
                        }}>
                            {isLastExercise && !isLastRound 
                                ? `Awesome work! Get ready for round ${currentRound}! 💪`
                                : 'Take a deep breath and get ready for the next exercise! 🌟'
                            }
                        </p>
                    </div>

                    {/* Cycle Complete Celebration */}
                    {isLastExercise && !isLastRound && (
                        <div style={{
                            background: 'var(--accent-gradient)',
                            color: 'white',
                            padding: '1.5rem',
                            borderRadius: '15px',
                            margin: '1.5rem 0',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            boxShadow: '0 6px 20px rgba(217, 119, 6, 0.3)',
                            animation: 'pulse 2s infinite'
                        }}>
                            🎉 CYCLE COMPLETE! 🎉<br/>
                            <span style={{ fontSize: '1.3rem' }}>+10 minutes screen time earned! 🎮</span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '1rem', 
                        justifyContent: 'center',
                        marginTop: '2rem'
                    }}>
                        <button 
                            className="btn btn-success"
                            onClick={handleRestComplete}
                            disabled={timer > 0}
                            style={{
                                fontSize: '1.1rem',
                                padding: '1rem 2rem',
                                borderRadius: '12px',
                                minWidth: '140px',
                                boxShadow: timer > 0 ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.3)'
                            }}
                        >
                            {timer > 0 ? `Rest ${timer}s` : '✅ Continue'}
                        </button>
                        {timer > 0 && (
                            <button 
                                className="btn btn-secondary"
                                onClick={handleRestComplete}
                                style={{ 
                                    fontSize: '1rem',
                                    padding: '1rem 1.5rem',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 15px rgba(55, 65, 81, 0.3)'
                                }}
                            >
                                ⏭️ Skip Rest
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="workout-session">
            {/* Celebration Overlay */}
            {showCelebration && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    animation: 'celebration-burst 2s ease-out'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        padding: '3rem',
                        borderRadius: '20px',
                        textAlign: 'center',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                        transform: 'scale(1.1)',
                        animation: 'celebration-bounce 0.6s ease-out'
                    }}>
                        {celebrationMessage}
                    </div>
                </div>
            )}

            {/* Power-Up Overlay */}
            {showPowerUp && (
                <div style={{
                    position: 'fixed',
                    top: '20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                    color: 'white',
                    padding: '2rem 3rem',
                    borderRadius: '15px',
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    zIndex: 999,
                    boxShadow: '0 15px 30px rgba(220, 38, 38, 0.4)',
                    animation: 'power-up-glow 3s ease-in-out'
                }}>
                    {powerUpMessage}
                </div>
            )}

            {/* Combo Counter */}
            {comboCount > 0 && (
                <div style={{
                    position: 'fixed',
                    top: '10px',
                    right: '10px',
                    background: isOnFire ? 'linear-gradient(135deg, #dc2626, #991b1b)' : 'linear-gradient(135deg, #1e3a8a, #1e40af)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    zIndex: 998,
                    animation: isOnFire ? 'fire-pulse 1s infinite' : 'none',
                    boxShadow: isOnFire ? '0 0 20px rgba(220, 38, 38, 0.6)' : '0 4px 15px rgba(30, 58, 138, 0.3)'
                }}>
                    {isOnFire ? '🔥' : '⚡'} {comboCount} COMBO!
                </div>
            )}

            {/* Progress Header */}
            <div className="card" style={{ marginBottom: '1rem' }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '1rem'
                }}>
                    <h3 style={{ color: 'var(--navy-blue)' }}>
                        Round {currentRound} of {totalRounds}
                    </h3>
                    <button className="btn btn-secondary" onClick={onCancel}>
                        Exit Workout
                    </button>
                </div>
                <div className="progress-bar">
                    <div 
                        className="progress-fill" 
                        style={{ 
                            width: `${((currentExerciseIndex + 1) / exercises.length) * 100}%`,
                            backgroundColor: 'var(--success-green)'
                        }}
                    ></div>
                </div>
                <p style={{ textAlign: 'center', marginTop: '0.5rem', color: 'var(--charcoal-gray)' }}>
                    Exercise {currentExerciseIndex + 1} of {exercises.length}
                </p>
            </div>

            {/* Current Exercise */}
            <div className="exercise-card">
                {/* Large Exercise Avatar */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{
                        fontSize: '4rem',
                        marginBottom: '1rem',
                        filter: 'drop-shadow(0 0 10px rgba(255, 193, 7, 0.6))',
                        animation: 'exercise-bounce 2s ease-in-out infinite'
                    }}>
                        {currentExercise.avatar}
                    </div>
                    <h2 style={{ margin: '0.5rem 0' }}>{currentExercise.name}</h2>
                </div>
                
                <div className="exercise-target-display">
                    {currentExercise.target} {currentExercise.unit}
                </div>
                
                <div className="exercise-instructions">
                    {currentExercise.instructions}
                </div>

                {/* Video Link */}
                {currentExercise.videoUrl && (
                    <div style={{ margin: '1rem 0' }}>
                        <a 
                            href={currentExercise.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-accent"
                        >
                            📹 Watch How-To Video
                        </a>
                    </div>
                )}

                {/* Timer for timed exercises */}
                {currentExercise.type === 'time' && (
                    <div>
                        {timer > 0 && (
                            <div className="timer-display">
                                {timer}s
                            </div>
                        )}
                        
                        {!isTimerRunning && timer === 0 && (
                            <button 
                                className="btn btn-primary"
                                onClick={startTimer}
                                style={{ margin: '1rem', fontSize: '1.2rem' }}
                            >
                                ⏱️ Start Timer
                            </button>
                        )}
                    </div>
                )}

                {/* Pull-up rep input */}
                {currentExercise.isSpecial && (
                    <div style={{ margin: '1rem 0' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem',
                            color: 'var(--navy-blue)',
                            fontWeight: 'bold'
                        }}>
                            How many pull-ups did you do in this set?
                        </label>
                        <input
                            type="number"
                            value={pullupReps}
                            onChange={(e) => setPullupReps(e.target.value)}
                            placeholder="Enter number"
                            min="0"
                            style={{
                                padding: '0.75rem',
                                fontSize: '1.1rem',
                                border: '2px solid var(--light-gray)',
                                borderRadius: '8px',
                                textAlign: 'center',
                                width: '150px'
                            }}
                        />
                    </div>
                )}

                {/* Complete Exercise Button */}
                <div style={{ marginTop: '2rem' }}>
                    <button 
                        className="btn btn-success"
                        onClick={handleExerciseComplete}
                        disabled={
                            (currentExercise.type === 'time' && timer > 0) ||
                            (currentExercise.isSpecial && !pullupReps)
                        }
                        style={{ 
                            fontSize: '1.2rem', 
                            padding: '1rem 2rem',
                            width: '100%'
                        }}
                    >
                        {currentExercise.type === 'time' && timer > 0 
                            ? `Complete in ${timer}s` 
                            : '✅ Exercise Complete!'
                        }
                    </button>
                </div>

                {/* Encouragement */}
                <div style={{ 
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'var(--light-gray)',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <p style={{ 
                        color: 'var(--forest-green)', 
                        fontWeight: 'bold',
                        margin: 0
                    }}>
                        💪 You've got this, warrior! Keep pushing!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WorkoutSession;
