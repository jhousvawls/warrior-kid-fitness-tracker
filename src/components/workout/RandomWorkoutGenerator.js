import React, { useState, useEffect, useCallback } from 'react';

const RandomWorkoutGenerator = ({ user, onWorkoutGenerated, onCancel }) => {
    const [generatedWorkout, setGeneratedWorkout] = useState(null);
    const [generating, setGenerating] = useState(false);

    // Age-appropriate exercise database
    const exerciseDatabase = {
        // Ages 5-8: Simple, fun movements
        beginner: [
            { name: "Marching in Place", type: "time", duration: 30, icon: "🚶", description: "March like a soldier!" },
            { name: "Animal Crawls", type: "time", duration: 20, icon: "🐻", description: "Crawl like your favorite animal!" },
            { name: "Jumping Jacks", type: "reps", count: 10, icon: "⭐", description: "Jump and spread your arms!" },
            { name: "Toe Touches", type: "reps", count: 8, icon: "👇", description: "Touch your toes gently!" },
            { name: "Arm Circles", type: "time", duration: 15, icon: "🌀", description: "Make big circles with your arms!" },
            { name: "Balance on One Foot", type: "time", duration: 10, icon: "🦩", description: "Stand like a flamingo!" },
            { name: "Pretend Swimming", type: "time", duration: 20, icon: "🏊", description: "Swim through the air!" },
            { name: "Robot Dance", type: "time", duration: 25, icon: "🤖", description: "Move like a robot!" },
            { name: "Frog Jumps", type: "reps", count: 6, icon: "🐸", description: "Hop like a frog!" },
            { name: "Butterfly Stretches", type: "time", duration: 15, icon: "🦋", description: "Flap your wings!" }
        ],
        
        // Ages 9-12: Moderate exercises with more structure
        intermediate: [
            { name: "Push-Ups", type: "reps", count: 8, icon: "💪", description: "Keep your body straight!" },
            { name: "Squats", type: "reps", count: 12, icon: "🏋️", description: "Sit back like there's a chair!" },
            { name: "Mountain Climbers", type: "time", duration: 20, icon: "⛰️", description: "Climb that mountain!" },
            { name: "Plank Hold", type: "time", duration: 15, icon: "🏗️", description: "Hold steady like a plank!" },
            { name: "Lunges", type: "reps", count: 10, icon: "🦵", description: "Step forward and down!" },
            { name: "Burpees", type: "reps", count: 5, icon: "💥", description: "The ultimate full-body move!" },
            { name: "High Knees", type: "time", duration: 25, icon: "🏃", description: "Bring those knees up high!" },
            { name: "Wall Sit", type: "time", duration: 20, icon: "🧱", description: "Sit against the wall!" },
            { name: "Jumping Lunges", type: "reps", count: 8, icon: "🦘", description: "Jump and switch legs!" },
            { name: "Bear Crawl", type: "time", duration: 20, icon: "🐻", description: "Crawl like a strong bear!" }
        ],
        
        // Ages 13-18: Advanced movements and challenges
        advanced: [
            { name: "Diamond Push-Ups", type: "reps", count: 6, icon: "💎", description: "Make a diamond with your hands!" },
            { name: "Jump Squats", type: "reps", count: 12, icon: "🚀", description: "Explode up from your squat!" },
            { name: "Burpee Box Jumps", type: "reps", count: 6, icon: "📦", description: "Burpee then jump on something!" },
            { name: "Pike Push-Ups", type: "reps", count: 8, icon: "🔺", description: "Push-ups in pike position!" },
            { name: "Single-Leg Squats", type: "reps", count: 6, icon: "🦵", description: "Squat on one leg!" },
            { name: "Plank to Push-Up", type: "reps", count: 8, icon: "🔄", description: "From plank to push-up position!" },
            { name: "Tuck Jumps", type: "reps", count: 10, icon: "🤸", description: "Jump and tuck your knees!" },
            { name: "Spiderman Crawl", type: "time", duration: 30, icon: "🕷️", description: "Crawl like Spiderman!" },
            { name: "Handstand Hold", type: "time", duration: 10, icon: "🤸", description: "Hold a handstand against wall!" },
            { name: "Plyometric Lunges", type: "reps", count: 10, icon: "⚡", description: "Explosive jumping lunges!" }
        ]
    };

    // Get age-appropriate exercise pool
    const getExercisePool = (age) => {
        if (age <= 8) return exerciseDatabase.beginner;
        if (age <= 12) return exerciseDatabase.intermediate;
        return exerciseDatabase.advanced;
    };

    // Generate a balanced 10-minute workout
    const generateWorkout = useCallback(() => {
        setGenerating(true);
        
        setTimeout(() => {
            const exercisePool = getExercisePool(user.age);
            const targetDuration = 600; // 10 minutes in seconds
            let currentDuration = 0;
            const selectedExercises = [];
            const usedExercises = new Set();

            // Ensure variety in exercise types
            const categories = {
                cardio: ['Jumping Jacks', 'High Knees', 'Mountain Climbers', 'Burpees', 'Jump Squats'],
                strength: ['Push-Ups', 'Squats', 'Plank Hold', 'Lunges', 'Wall Sit'],
                fun: ['Animal Crawls', 'Robot Dance', 'Pretend Swimming', 'Bear Crawl', 'Frog Jumps']
            };

            let cardioCount = 0;
            let strengthCount = 0;
            let funCount = 0;

            while (currentDuration < targetDuration && selectedExercises.length < 8) {
                // Randomly select an exercise that hasn't been used
                const availableExercises = exercisePool.filter(ex => !usedExercises.has(ex.name));
                if (availableExercises.length === 0) break;

                const randomExercise = availableExercises[Math.floor(Math.random() * availableExercises.length)];
                
                // Check for variety
                const isCardio = categories.cardio.includes(randomExercise.name);
                const isStrength = categories.strength.includes(randomExercise.name);
                const isFun = categories.fun.includes(randomExercise.name);

                // Ensure balanced workout
                if ((isCardio && cardioCount >= 3) || 
                    (isStrength && strengthCount >= 3) || 
                    (isFun && funCount >= 3)) {
                    continue;
                }

                // Calculate exercise duration
                let exerciseDuration;
                if (randomExercise.type === 'time') {
                    exerciseDuration = randomExercise.duration;
                } else {
                    // Estimate time for reps (2 seconds per rep + rest)
                    exerciseDuration = randomExercise.count * 2;
                }

                // Add rest time between exercises (15 seconds)
                const totalTime = exerciseDuration + (selectedExercises.length > 0 ? 15 : 0);

                if (currentDuration + totalTime <= targetDuration) {
                    selectedExercises.push({
                        ...randomExercise,
                        estimatedDuration: exerciseDuration
                    });
                    
                    currentDuration += totalTime;
                    usedExercises.add(randomExercise.name);

                    if (isCardio) cardioCount++;
                    if (isStrength) strengthCount++;
                    if (isFun) funCount++;
                }
            }

            // Calculate total workout time
            const totalWorkoutTime = selectedExercises.reduce((total, ex) => 
                total + ex.estimatedDuration, 0) + (selectedExercises.length - 1) * 15;

            const workout = {
                exercises: selectedExercises,
                totalTime: totalWorkoutTime,
                difficulty: user.age <= 8 ? 'Beginner' : user.age <= 12 ? 'Intermediate' : 'Advanced',
                ageGroup: `Ages ${user.age <= 8 ? '5-8' : user.age <= 12 ? '9-12' : '13-18'}`,
                generatedAt: new Date().toISOString()
            };

            setGeneratedWorkout(workout);
            setGenerating(false);
        }, 1500); // Simulate generation time
    }, [user.age, getExercisePool]);

    useEffect(() => {
        generateWorkout();
    }, [generateWorkout]);

    const handleStartWorkout = () => {
        onWorkoutGenerated(generatedWorkout);
    };

    const handleRegenerate = () => {
        setGeneratedWorkout(null);
        generateWorkout();
    };

    if (generating) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '3rem',
                    textAlign: 'center',
                    maxWidth: '400px',
                    width: '90%'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎲</div>
                    <h2 style={{ color: 'var(--navy-blue)', marginBottom: '1rem' }}>
                        Generating Your Random Workout!
                    </h2>
                    <p style={{ color: 'var(--charcoal-gray)', marginBottom: '2rem' }}>
                        Creating the perfect 10-minute workout just for you...
                    </p>
                    <div style={{
                        width: '100%',
                        height: '8px',
                        background: 'var(--light-gray)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, var(--navy-blue), var(--forest-green))',
                            animation: 'loading 1.5s ease-in-out infinite'
                        }}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!generatedWorkout) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2rem',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ color: 'var(--navy-blue)', margin: '0 0 0.5rem 0' }}>
                        🎲 Your Random Workout is Ready!
                    </h2>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <span style={{ 
                            background: 'var(--light-blue)', 
                            color: 'var(--navy-blue)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                        }}>
                            {generatedWorkout.difficulty}
                        </span>
                        <span style={{ 
                            background: 'var(--light-green)', 
                            color: 'var(--forest-green)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                        }}>
                            {generatedWorkout.ageGroup}
                        </span>
                        <span style={{ 
                            background: 'var(--light-orange)', 
                            color: 'var(--amber-orange)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                        }}>
                            ~{Math.round(generatedWorkout.totalTime / 60)} minutes
                        </span>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'var(--navy-blue)', marginBottom: '1rem' }}>
                        🏋️ Your Exercises ({generatedWorkout.exercises.length} exercises)
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {generatedWorkout.exercises.map((exercise, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '1rem',
                                background: 'var(--light-gray)',
                                borderRadius: '8px',
                                border: '2px solid transparent'
                            }}>
                                <div style={{ fontSize: '2rem', marginRight: '1rem' }}>
                                    {exercise.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ 
                                        fontWeight: 'bold', 
                                        color: 'var(--navy-blue)',
                                        marginBottom: '0.25rem'
                                    }}>
                                        {index + 1}. {exercise.name}
                                    </div>
                                    <div style={{ 
                                        color: 'var(--charcoal-gray)',
                                        fontSize: '0.9rem',
                                        marginBottom: '0.25rem'
                                    }}>
                                        {exercise.description}
                                    </div>
                                    <div style={{ 
                                        color: 'var(--forest-green)',
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem'
                                    }}>
                                        {exercise.type === 'time' 
                                            ? `${exercise.duration} seconds`
                                            : `${exercise.count} reps`
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    <button
                        className="btn btn-secondary"
                        onClick={handleRegenerate}
                        style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
                    >
                        🎲 Generate New Workout
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleStartWorkout}
                        style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
                    >
                        🚀 Start This Workout
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={onCancel}
                        style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
                    >
                        ❌ Cancel
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(0%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default RandomWorkoutGenerator;
