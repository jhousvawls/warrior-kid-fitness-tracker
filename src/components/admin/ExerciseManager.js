import React, { useState, useEffect } from 'react';
import exerciseService from '../../data/exerciseService';

const ExerciseManager = () => {
    const [exercises, setExercises] = useState([]);
    const [workoutPrograms, setWorkoutPrograms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [connectionStatus, setConnectionStatus] = useState(null);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [exerciseStats, setExerciseStats] = useState(null);

    // Form state for creating/editing exercises
    const [formData, setFormData] = useState({
        name: '',
        avatar: '💪',
        type: 'reps',
        target: 10,
        unit: 'reps',
        instructions: '',
        videoUrl: '',
        isSpecial: false,
        difficulty: 'beginner',
        category: 'upper_body',
        restTime: 15,
        screenTimeBonus: 0,
        order: 1
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            // Load exercises
            const loadedExercises = await exerciseService.getExercises(true); // Force refresh
            setExercises(loadedExercises);

            // Load workout programs
            const programs = await exerciseService.getWorkoutPrograms(true);
            setWorkoutPrograms(programs);

            // Get connection status
            const status = exerciseService.getConnectionStatus();
            setConnectionStatus(status);

            // Get exercise statistics
            const stats = exerciseService.getExerciseStats();
            setExerciseStats(stats);

        } catch (error) {
            console.error('Error loading exercise data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        await exerciseService.refresh();
        await loadData();
    };

    const handleEditExercise = (exercise) => {
        setSelectedExercise(exercise);
        setFormData({
            name: exercise.name || '',
            avatar: exercise.avatar || '💪',
            type: exercise.type || 'reps',
            target: exercise.target || 10,
            unit: exercise.unit || 'reps',
            instructions: exercise.instructions || '',
            videoUrl: exercise.videoUrl || '',
            isSpecial: exercise.isSpecial || false,
            difficulty: exercise.difficulty || 'beginner',
            category: exercise.category || 'upper_body',
            restTime: exercise.restTime || 15,
            screenTimeBonus: exercise.screenTimeBonus || 0,
            order: exercise.order || 1
        });
        setIsEditing(true);
        setShowCreateForm(true);
    };

    const handleCreateNew = () => {
        setSelectedExercise(null);
        setFormData({
            name: '',
            avatar: '💪',
            type: 'reps',
            target: 10,
            unit: 'reps',
            instructions: '',
            videoUrl: '',
            isSpecial: false,
            difficulty: 'beginner',
            category: 'upper_body',
            restTime: 15,
            screenTimeBonus: 0,
            order: exercises.length + 1
        });
        setIsEditing(false);
        setShowCreateForm(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        if (!connectionStatus?.isConnected) {
            alert('WordPress connection required to save exercises');
            return;
        }

        try {
            if (isEditing && selectedExercise) {
                await exerciseService.updateExercise(selectedExercise.id, formData);
                alert('Exercise updated successfully!');
            } else {
                await exerciseService.createExercise(formData);
                alert('Exercise created successfully!');
            }
            
            setShowCreateForm(false);
            await loadData();
        } catch (error) {
            console.error('Error saving exercise:', error);
            alert('Error saving exercise: ' + error.message);
        }
    };

    const handleDeleteExercise = async (exercise) => {
        if (!connectionStatus?.isConnected) {
            alert('WordPress connection required to delete exercises');
            return;
        }

        if (window.confirm(`Are you sure you want to delete "${exercise.name}"?`)) {
            try {
                await exerciseService.deleteExercise(exercise.id);
                alert('Exercise deleted successfully!');
                await loadData();
            } catch (error) {
                console.error('Error deleting exercise:', error);
                alert('Error deleting exercise: ' + error.message);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (isLoading) {
        return (
            <div className="card">
                <h2>🏋️ Exercise Manager</h2>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                    <p>Loading exercise data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="exercise-manager">
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2>🏋️ Exercise Manager</h2>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" onClick={handleRefresh}>
                            🔄 Refresh
                        </button>
                        <button 
                            className="btn btn-primary" 
                            onClick={handleCreateNew}
                            disabled={!connectionStatus?.isConnected}
                        >
                            ➕ Add Exercise
                        </button>
                    </div>
                </div>

                {/* Connection Status */}
                <div style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    backgroundColor: connectionStatus?.isConnected ? '#d1fae5' : '#fee2e2',
                    border: `1px solid ${connectionStatus?.isConnected ? '#10b981' : '#ef4444'}`
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>
                            {connectionStatus?.isConnected ? '✅' : '❌'}
                        </span>
                        <strong>
                            {connectionStatus?.isConnected ? 'WordPress Connected' : 'WordPress Disconnected'}
                        </strong>
                    </div>
                    <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.8 }}>
                        Source: {connectionStatus?.source} | 
                        Exercises: {connectionStatus?.exerciseCount} | 
                        Programs: {connectionStatus?.programCount}
                        {connectionStatus?.lastFetch && (
                            <span> | Last sync: {new Date(connectionStatus.lastFetch).toLocaleTimeString()}</span>
                        )}
                    </div>
                </div>

                {/* Exercise Statistics */}
                {exerciseStats && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                        marginBottom: '2rem'
                    }}>
                        <div className="stat-card">
                            <h4>📊 Total Exercises</h4>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--navy-blue)' }}>
                                {exerciseStats.total}
                            </div>
                        </div>
                        <div className="stat-card">
                            <h4>🎯 By Type</h4>
                            <div style={{ fontSize: '0.9rem' }}>
                                {Object.entries(exerciseStats.byType).map(([type, count]) => (
                                    <div key={type}>{type}: {count}</div>
                                ))}
                            </div>
                        </div>
                        <div className="stat-card">
                            <h4>⭐ By Difficulty</h4>
                            <div style={{ fontSize: '0.9rem' }}>
                                {Object.entries(exerciseStats.byDifficulty).map(([difficulty, count]) => (
                                    <div key={difficulty}>{difficulty}: {count}</div>
                                ))}
                            </div>
                        </div>
                        <div className="stat-card">
                            <h4>🏷️ By Category</h4>
                            <div style={{ fontSize: '0.9rem' }}>
                                {Object.entries(exerciseStats.byCategory).map(([category, count]) => (
                                    <div key={category}>{category.replace('_', ' ')}: {count}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Exercise List */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3>Current Exercises</h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1rem'
                    }}>
                        {exercises.map((exercise, index) => (
                            <div key={exercise.id} className="exercise-item" style={{
                                border: '1px solid var(--light-gray)',
                                borderRadius: '8px',
                                padding: '1rem',
                                backgroundColor: 'white'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '1.5rem' }}>{exercise.avatar}</span>
                                    <strong>{exercise.name}</strong>
                                    <span style={{
                                        fontSize: '0.8rem',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '12px',
                                        backgroundColor: 'var(--light-gray)'
                                    }}>
                                        #{exercise.order || index + 1}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                    <strong>{exercise.target} {exercise.unit}</strong> | {exercise.type}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--charcoal-gray)', marginBottom: '1rem' }}>
                                    {exercise.instructions?.substring(0, 100)}...
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem' }}>
                                    <span style={{
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '12px',
                                        backgroundColor: 'var(--accent-orange)',
                                        color: 'white'
                                    }}>
                                        {exercise.difficulty}
                                    </span>
                                    <span style={{
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '12px',
                                        backgroundColor: 'var(--navy-blue)',
                                        color: 'white'
                                    }}>
                                        {exercise.category?.replace('_', ' ')}
                                    </span>
                                    {exercise.isSpecial && (
                                        <span style={{
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '12px',
                                            backgroundColor: 'var(--success-green)',
                                            color: 'white'
                                        }}>
                                            Special
                                        </span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                    <button 
                                        className="btn btn-secondary"
                                        onClick={() => handleEditExercise(exercise)}
                                        disabled={!connectionStatus?.isConnected}
                                        style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button 
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteExercise(exercise)}
                                        disabled={!connectionStatus?.isConnected}
                                        style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Workout Programs */}
                {workoutPrograms.length > 0 && (
                    <div>
                        <h3>Workout Programs</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {workoutPrograms.map(program => (
                                <div key={program.id} style={{
                                    border: '1px solid var(--light-gray)',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    backgroundColor: 'white'
                                }}>
                                    <h4>{program.name}</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--charcoal-gray)' }}>
                                        {program.description}
                                    </p>
                                    <div style={{ fontSize: '0.8rem' }}>
                                        <strong>Rounds:</strong> {program.totalRounds} | 
                                        <strong> Duration:</strong> ~{program.estimatedDuration} min | 
                                        <strong> Difficulty:</strong> {program.difficulty}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Create/Edit Form Modal */}
            {showCreateForm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '2rem',
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '90vh',
                        overflow: 'auto'
                    }}>
                        <h3>{isEditing ? 'Edit Exercise' : 'Create New Exercise'}</h3>
                        
                        <form onSubmit={handleFormSubmit}>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div>
                                    <label>Exercise Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--light-gray)' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label>Avatar (Emoji)</label>
                                        <input
                                            type="text"
                                            name="avatar"
                                            value={formData.avatar}
                                            onChange={handleInputChange}
                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--light-gray)' }}
                                        />
                                    </div>
                                    <div>
                                        <label>Exercise Type *</label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            required
                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--light-gray)' }}
                                        >
                                            <option value="reps">Repetitions</option>
                                            <option value="time">Time</option>
                                            <option value="sets">Sets</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label>Target Value *</label>
                                        <input
                                            type="number"
                                            name="target"
                                            value={formData.target}
                                            onChange={handleInputChange}
                                            required
                                            min="1"
                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--light-gray)' }}
                                        />
                                    </div>
                                    <div>
                                        <label>Unit Label</label>
                                        <input
                                            type="text"
                                            name="unit"
                                            value={formData.unit}
                                            onChange={handleInputChange}
                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--light-gray)' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label>Instructions *</label>
                                    <textarea
                                        name="instructions"
                                        value={formData.instructions}
                                        onChange={handleInputChange}
                                        required
                                        rows="3"
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--light-gray)' }}
                                    />
                                </div>

                                <div>
                                    <label>Video URL</label>
                                    <input
                                        type="url"
                                        name="videoUrl"
                                        value={formData.videoUrl}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--light-gray)' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label>Difficulty</label>
                                        <select
                                            name="difficulty"
                                            value={formData.difficulty}
                                            onChange={handleInputChange}
                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--light-gray)' }}
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--light-gray)' }}
                                        >
                                            <option value="upper_body">Upper Body</option>
                                            <option value="core">Core</option>
                                            <option value="cardio">Cardio</option>
                                            <option value="flexibility">Flexibility</option>
                                            <option value="full_body">Full Body</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label>Rest Time (seconds)</label>
                                        <input
                                            type="number"
                                            name="restTime"
                                            value={formData.restTime}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="120"
                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--light-gray)' }}
                                        />
                                    </div>
                                    <div>
                                        <label>Screen Time Bonus</label>
                                        <input
                                            type="number"
                                            name="screenTimeBonus"
                                            value={formData.screenTimeBonus}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="30"
                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--light-gray)' }}
                                        />
                                    </div>
                                    <div>
                                        <label>Display Order</label>
                                        <input
                                            type="number"
                                            name="order"
                                            value={formData.order}
                                            onChange={handleInputChange}
                                            min="1"
                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--light-gray)' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <input
                                            type="checkbox"
                                            name="isSpecial"
                                            checked={formData.isSpecial}
                                            onChange={handleInputChange}
                                        />
                                        Special Tracking (like pull-ups)
                                    </label>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="submit" className="btn btn-primary">
                                    {isEditing ? 'Update Exercise' : 'Create Exercise'}
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setShowCreateForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExerciseManager;
