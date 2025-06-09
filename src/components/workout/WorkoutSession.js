import React, { useState, useEffect, useCallback } from 'react';
import { storage } from '../../utils/localStorage';
import { dateHelpers } from '../../utils/dateHelpers';
import exerciseService from '../../data/exerciseService';
import debugLogger from '../../utils/debugLogger';

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
    const [celebrationMessage, setCelebrationMessage] = useState('');
    const [powerUpMessage, setPowerUpMessage] = useState('');
    const [comboCount, setComboCount] = useState(0);
    const [isOnFire, setIsOnFire] = useState(false);
    const [showContinueChoice, setShowContinueChoice] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [isLoadingExercises, setIsLoadingExercises] = useState(true);

    const currentExercise = exercises[currentExerciseIndex];
    const isLastExercise = currentExerciseIndex === exercises.length - 1;
    const isLastRound = currentRound === totalRounds;

    // Load exercises on component mount
    useEffect(() => {
        const loadExercises = async () => {
            try {
                setIsLoadingExercises(true);
                debugLogger.logWorkoutStart(user, 'regular');
                const loadedExercises = await exerciseService.getExercises();
                setExercises(loadedExercises);
                debugLogger.log('WORKOUT', `Loaded ${loadedExercises.length} exercises for workout`);
                console.log('💪 Loaded exercises for workout:', loadedExercises.length);
            } catch (error) {
                debugLogger.log('ERROR', 'Failed to load exercises', error);
                console.error('Error loading exercises:', error);
                // Fallback will be handled by exerciseService
                const fallbackExercises = await exerciseService.getExercises();
                setExercises(fallbackExercises);
            } finally {
                setIsLoadingExercises(false);
            }
        };

        loadExercises();
    }, [user]);

    const completeWorkout = useCallback(async () => {
        const screenTimeEarned = totalRounds * 10; // 10 minutes per round
        const workout = {
            id: Date.now().toString(),
            userId: user.id,
            date: dateHelpers.getTodayString(),
            exercises: completedExercises,
            rounds: totalRounds,
            screenTimeEarned: screenTimeEarned,
            completedAt: new Date().toISOString()
        };

        debugLogger.logWorkoutComplete(user, workout);

        // Save workout
        try {
            debugLogger.log('WORKOUT', `Saving workout for user ${user.id} with ${screenTimeEarned} minutes screen time`);
            console.log('💾 Saving workout for user:', user.id, 'with screen time:', screenTimeEarned);
            
            // Get current screen time before adding new amount
            const currentScreenTime = await storage.getScreenTime(user.id);
            debugLogger.log('SCREEN_TIME', `Current screen time before workout completion: ${currentScreenTime} minutes`);
            
            await storage.saveWorkout(workout);
            debugLogger.log('SUCCESS', 'Workout saved successfully');

            // Ensure screen time is properly recorded (in addition to per-round awards)
            debugLogger.logScreenTimeAttempt(user.id, screenTimeEarned);
            console.log('🎮 Adding final screen time bonus:', screenTimeEarned);
            
            await storage.addScreenTime(user.id, screenTimeEarned);
            
            // Verify screen time was added
            const newScreenTime = await storage.getScreenTime(user.id);
            debugLogger.logScreenTimeSuccess(user.id, currentScreenTime, newScreenTime);

            // Save pull-up progress if any pull-ups were completed
            const pullupData = completedExercises.filter(e => e.reps);
            if (pullupData.length > 0) {
                const totalPullups = pullupData.reduce((sum, e) => sum + e.reps, 0);
                debugLogger.log('WORKOUT', `Saving pullup progress: ${totalPullups} reps`);
                console.log('💪 Saving pullup progress:', totalPullups);
                await storage.savePullupProgress(user.id, totalPullups, dateHelpers.getTodayString());
            }

            debugLogger.log('SUCCESS', 'Workout completion process finished successfully');
            console.log('✅ Workout completion saved successfully');
            
            // Longer delay to ensure all data is properly saved
            setTimeout(() => {
                onComplete();
            }, 500);
        } catch (error) {
            debugLogger.logScreenTimeError(user.id, error);
            console.error('❌ Error saving workout:', error);
            // Still complete the workout even if saving fails
            setTimeout(() => {
                onComplete();
            }, 500);
        }
    }, [user, completedExercises, totalRounds, onComplete]);

    const handleExerciseComplete = useCallback(() => {
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

        // Trigger inline celebration animation
        const randomCelebration = COMPLETION_CELEBRATIONS[Math.floor(Math.random() * COMPLETION_CELEBRATIONS.length)];
        setCelebrationMessage(randomCelebration);
        
        // Update combo count and check for power-ups
        const newComboCount = comboCount + 1;
        setComboCount(newComboCount);
        
        // Trigger power-up effects for combos
        if (newComboCount >= 3) {
            const randomPowerUp = POWER_UP_MESSAGES[Math.floor(Math.random() * POWER_UP_MESSAGES.length)];
            setPowerUpMessage(randomPowerUp);
            setIsOnFire(true);
            
            // Reset power-up after 3 seconds
            setTimeout(() => {
                setIsOnFire(false);
                setPowerUpMessage('');
            }, 3000);
        }
        
        // Reset celebration after 2 seconds
        setTimeout(() => {
            setCelebrationMessage('');
        }, 2000);

        if (isLastExercise) {
            // Award 10 minutes of screen time for completing this cycle/round
            debugLogger.logScreenTimeAttempt(user.id, 10);
            debugLogger.log('WORKOUT', `Round ${currentRound} completed - awarding 10 minutes screen time`);
            storage.addScreenTime(user.id, 10);
            
            if (isLastRound) {
                // Show choice dialog after completing the last exercise of the last round
                debugLogger.log('WORKOUT', 'All rounds completed - showing continue choice dialog');
                setShowContinueChoice(true);
            } else {
                // Start next round
                debugLogger.log('WORKOUT', `Starting round ${currentRound + 1}`);
                setCurrentRound(currentRound + 1);
                setCurrentExerciseIndex(0);
                setIsResting(true);
                setTimer(30); // 30 second rest between rounds
                setIsTimerRunning(true);
            }
        } else {
            // Move to next exercise
            debugLogger.log('WORKOUT', `Moving to exercise ${currentExerciseIndex + 2} of ${exercises.length}`);
            setCurrentExerciseIndex(currentExerciseIndex + 1);
            setIsResting(true);
            setTimer(15); // 15 second rest between exercises
            setIsTimerRunning(true);
        }

        setPullupReps('');
    }, [currentExercise, pullupReps, completedExercises, comboCount, isLastExercise, isLastRound, user.id, currentRound, currentExerciseIndex, exercises.length]);

    useEffect(() => {
        let interval;
        if (isTimerRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer(timer - 1);
            }, 1000);
        } else if (timer === 0 && isTimerRunning) {
            setIsTimerRunning(false);
            // Auto-complete timed exercises when timer reaches 0
            if (currentExercise && currentExercise.type === 'time') {
                handleExerciseComplete();
            }
        }
        return () => clearInterval(interval);
    }, [timer, isTimerRunning, currentExercise, handleExerciseComplete]);

    const startTimer = () => {
        if (currentExercise && currentExercise.type === 'time') {
            setTimer(currentExercise.target);
            setIsTimerRunning(true);
        }
    };





    const handleRestComplete = () => {
        setIsResting(false);
        setTimer(0);
        setIsTimerRunning(false);
    };

    const handleContinueToNextCycle = () => {
        // Reset for next cycle
        setShowContinueChoice(false);
        setCurrentRound(1);
        setCurrentExerciseIndex(0);
        setCompletedExercises([]);
        setComboCount(0);
        setCelebrationMessage('');
        setPowerUpMessage('');
        setIsOnFire(false);
        
        // Start next cycle with a rest period
        setIsResting(true);
        setTimer(30); // 30 second rest before starting new cycle
        setIsTimerRunning(true);
    };

    const handleGoToDashboard = () => {
        // Complete the workout and go to dashboard
        completeWorkout();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Show continue choice dialog after completing all exercises
    if (showContinueChoice) {
        return (
            <div className="workout-session">
                <div className="exercise-card" style={{
                    background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                    border: '2px solid var(--navy-blue)',
                    textAlign: 'center',
                    maxWidth: '600px',
                    margin: '2rem auto'
                }}>
                    {/* Celebration Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #16a34a, #15803d)',
                        color: 'white',
                        padding: '2rem',
                        margin: '-2rem -2rem 2rem -2rem',
                        borderRadius: '12px 12px 0 0',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                        <h2 style={{ 
                            margin: 0, 
                            fontSize: '2rem',
                            fontWeight: 'bold'
                        }}>WORKOUT COMPLETE!</h2>
                        <p style={{ 
                            margin: '0.5rem 0 0 0', 
                            fontSize: '1.2rem',
                            opacity: 0.9
                        }}>
                            Amazing job, warrior! You crushed all {totalRounds} rounds!
                        </p>
                    </div>

                    {/* Screen Time Earned Display */}
                    <div style={{
                        background: 'var(--accent-gradient)',
                        color: 'white',
                        padding: '1.5rem',
                        borderRadius: '15px',
                        margin: '1.5rem 0',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        boxShadow: '0 6px 20px rgba(217, 119, 6, 0.3)'
                    }}>
                        🎮 +{totalRounds * 10} minutes screen time earned! 🎮
                    </div>

                    {/* Choice Message */}
                    <div style={{
                        background: 'rgba(255,255,255,0.8)',
                        borderRadius: '12px',
                        padding: '2rem',
                        margin: '2rem 0',
                        border: '1px solid rgba(30, 58, 138, 0.2)'
                    }}>
                        <h3 style={{ 
                            color: 'var(--navy-blue)', 
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            margin: '0 0 1rem 0'
                        }}>
                            What would you like to do next?
                        </h3>
                        <p style={{ 
                            color: 'var(--charcoal-gray)', 
                            fontSize: '1.1rem',
                            margin: 0,
                            lineHeight: '1.5'
                        }}>
                            You can continue training with another cycle to earn more screen time, or head back to the dashboard to see your progress!
                        </p>
                    </div>

                    {/* Choice Buttons */}
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: '1rem', 
                        marginTop: '2rem'
                    }}>
                        <button 
                            className="btn btn-primary"
                            onClick={handleContinueToNextCycle}
                            style={{
                                fontSize: '1.2rem',
                                padding: '1.2rem 2rem',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
                                border: 'none',
                                boxShadow: '0 6px 20px rgba(30, 64, 175, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            🔄 Continue to Next Cycle
                            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                                (+{totalRounds * 10} more screen time!)
                            </span>
                        </button>
                        
                        <button 
                            className="btn btn-success"
                            onClick={handleGoToDashboard}
                            style={{
                                fontSize: '1.2rem',
                                padding: '1.2rem 2rem',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                                border: 'none',
                                boxShadow: '0 6px 20px rgba(22, 163, 74, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            🏠 Back to Dashboard
                            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                                (View progress & use screen time)
                            </span>
                        </button>
                    </div>

                    {/* Motivational Footer */}
                    <div style={{
                        marginTop: '2rem',
                        padding: '1rem',
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}>
                        <p style={{ 
                            color: 'var(--forest-green)',
                            fontWeight: 'bold',
                            margin: 0,
                            fontSize: '1rem'
                        }}>
                            💪 You're building strength, discipline, and character! Keep up the warrior spirit!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

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
                                ? `Round ${currentRound} Complete! 🎉`
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
                                ? `Awesome work! Get ready for round ${currentRound + 1}! 💪`
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
                            boxShadow: '0 6px 20px rgba(217, 119, 6, 0.3)'
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

    // Show loading state while exercises are loading
    if (isLoadingExercises || exercises.length === 0) {
        return (
            <div className="workout-session">
                <div className="exercise-card" style={{
                    background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                    border: '2px solid var(--navy-blue)',
                    textAlign: 'center',
                    maxWidth: '500px',
                    margin: '2rem auto'
                }}>
                    <div style={{
                        padding: '3rem 2rem',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '3rem',
                            marginBottom: '1rem',
                            animation: 'pulse 2s infinite'
                        }}>
                            🏋️‍♂️
                        </div>
                        <h2 style={{ 
                            color: 'var(--navy-blue)',
                            marginBottom: '1rem'
                        }}>
                            {isLoadingExercises ? 'Loading Workout...' : 'Preparing Exercises...'}
                        </h2>
                        <p style={{ 
                            color: 'var(--charcoal-gray)',
                            fontSize: '1.1rem'
                        }}>
                            {isLoadingExercises 
                                ? 'Getting your exercises ready from WordPress...' 
                                : 'Setting up your workout session...'
                            }
                        </p>
                        
                        {/* Loading animation */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            marginTop: '2rem'
                        }}>
                            {[1, 2, 3].map(i => (
                                <div
                                    key={i}
                                    style={{
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--navy-blue)',
                                        animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`
                                    }}
                                />
                            ))}
                        </div>
                        
                        <button 
                            className="btn btn-secondary"
                            onClick={onCancel}
                            style={{ marginTop: '2rem' }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Safety check - if no current exercise, show error
    if (!currentExercise) {
        return (
            <div className="workout-session">
                <div className="exercise-card" style={{
                    background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                    border: '2px solid var(--red-500)',
                    textAlign: 'center',
                    maxWidth: '500px',
                    margin: '2rem auto'
                }}>
                    <div style={{
                        padding: '3rem 2rem',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                        <h2 style={{ color: 'var(--red-500)', marginBottom: '1rem' }}>
                            Exercise Loading Error
                        </h2>
                        <p style={{ color: 'var(--charcoal-gray)', fontSize: '1.1rem' }}>
                            Unable to load workout exercises. Please try again.
                        </p>
                        <button 
                            className="btn btn-primary"
                            onClick={onCancel}
                            style={{ marginTop: '2rem' }}
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="workout-session">


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
                        filter: 'drop-shadow(0 0 10px rgba(255, 193, 7, 0.6))'
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

                {/* Dynamic Encouragement */}
                <div style={{ 
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'var(--light-gray)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: 'var(--forest-green)'
                }}>
                    <p style={{ 
                        fontWeight: 'bold',
                        margin: 0,
                        fontSize: '1rem'
                    }}>
                        {celebrationMessage || powerUpMessage || '💪 You\'ve got this, warrior! Keep pushing!'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WorkoutSession;
