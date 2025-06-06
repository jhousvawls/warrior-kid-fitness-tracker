/**
 * Exercise Service
 * Manages exercise data from WordPress with fallback to local data
 */

import wordpressExerciseAPI from '../services/wordpressExerciseAPI';
import defaultExercises from './exercises';

class ExerciseService {
    constructor() {
        this.exercises = [];
        this.workoutPrograms = [];
        this.isWordPressConnected = false;
        this.lastFetchTime = null;
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Initialize the service and load exercises
     */
    async initialize() {
        console.log('🏋️ Initializing Exercise Service...');
        
        // Try to load from WordPress first
        await this.loadFromWordPress();
        
        // If WordPress failed, use default exercises
        if (this.exercises.length === 0) {
            console.log('📋 Using default exercises as fallback');
            this.exercises = defaultExercises;
            this.isWordPressConnected = false;
        }
        
        return this.exercises;
    }

    /**
     * Load exercises from WordPress
     */
    async loadFromWordPress() {
        try {
            console.log('🌐 Attempting to load exercises from WordPress...');
            
            // Test connection first
            const isConnected = await wordpressExerciseAPI.testConnection();
            if (!isConnected) {
                console.log('❌ WordPress connection test failed');
                this.isWordPressConnected = false;
                return false;
            }

            // Fetch exercises
            const wpExercises = await wordpressExerciseAPI.fetchExercises();
            if (wpExercises && wpExercises.length > 0) {
                console.log(`✅ Loaded ${wpExercises.length} exercises from WordPress`);
                this.exercises = wpExercises.sort((a, b) => (a.order || 0) - (b.order || 0));
                this.isWordPressConnected = true;
                this.lastFetchTime = Date.now();
                
                // Also try to load workout programs
                await this.loadWorkoutPrograms();
                
                return true;
            } else {
                console.log('⚠️ No exercises found in WordPress');
                this.isWordPressConnected = false;
                return false;
            }
            
        } catch (error) {
            console.error('❌ Error loading exercises from WordPress:', error);
            this.isWordPressConnected = false;
            return false;
        }
    }

    /**
     * Load workout programs from WordPress
     */
    async loadWorkoutPrograms() {
        try {
            const wpPrograms = await wordpressExerciseAPI.fetchWorkoutPrograms();
            if (wpPrograms && wpPrograms.length > 0) {
                console.log(`✅ Loaded ${wpPrograms.length} workout programs from WordPress`);
                this.workoutPrograms = wpPrograms.filter(program => program.isActive);
            }
        } catch (error) {
            console.error('❌ Error loading workout programs:', error);
        }
    }

    /**
     * Get all exercises
     */
    async getExercises(forceRefresh = false) {
        // Check if we need to refresh from WordPress
        if (forceRefresh || this.shouldRefresh()) {
            await this.loadFromWordPress();
        }

        // Return exercises or fallback to default
        return this.exercises.length > 0 ? this.exercises : defaultExercises;
    }

    /**
     * Get a specific exercise by ID
     */
    async getExercise(exerciseId) {
        const exercises = await this.getExercises();
        return exercises.find(exercise => exercise.id === exerciseId);
    }

    /**
     * Get workout programs
     */
    async getWorkoutPrograms(forceRefresh = false) {
        if (forceRefresh || this.shouldRefresh()) {
            await this.loadWorkoutPrograms();
        }
        return this.workoutPrograms;
    }

    /**
     * Get a specific workout program with exercises
     */
    async getWorkoutProgram(programId) {
        if (this.isWordPressConnected) {
            try {
                return await wordpressExerciseAPI.fetchWorkoutProgram(programId);
            } catch (error) {
                console.error('Error fetching workout program:', error);
            }
        }
        
        // Fallback to local programs
        const programs = await this.getWorkoutPrograms();
        return programs.find(program => program.id === programId);
    }

    /**
     * Create a new exercise (WordPress only)
     */
    async createExercise(exerciseData) {
        if (!this.isWordPressConnected) {
            throw new Error('WordPress connection required to create exercises');
        }
        
        try {
            const newExercise = await wordpressExerciseAPI.createExercise(exerciseData);
            
            // Refresh local cache
            await this.loadFromWordPress();
            
            return newExercise;
        } catch (error) {
            console.error('Error creating exercise:', error);
            throw error;
        }
    }

    /**
     * Update an existing exercise (WordPress only)
     */
    async updateExercise(exerciseId, exerciseData) {
        if (!this.isWordPressConnected) {
            throw new Error('WordPress connection required to update exercises');
        }
        
        try {
            const updatedExercise = await wordpressExerciseAPI.updateExercise(exerciseId, exerciseData);
            
            // Refresh local cache
            await this.loadFromWordPress();
            
            return updatedExercise;
        } catch (error) {
            console.error('Error updating exercise:', error);
            throw error;
        }
    }

    /**
     * Delete an exercise (WordPress only)
     */
    async deleteExercise(exerciseId) {
        if (!this.isWordPressConnected) {
            throw new Error('WordPress connection required to delete exercises');
        }
        
        try {
            await wordpressExerciseAPI.deleteExercise(exerciseId);
            
            // Refresh local cache
            await this.loadFromWordPress();
            
            return true;
        } catch (error) {
            console.error('Error deleting exercise:', error);
            throw error;
        }
    }

    /**
     * Force refresh from WordPress
     */
    async refresh() {
        console.log('🔄 Force refreshing exercises from WordPress...');
        return await this.loadFromWordPress();
    }

    /**
     * Check if we should refresh the cache
     */
    shouldRefresh() {
        if (!this.lastFetchTime) return true;
        return (Date.now() - this.lastFetchTime) > this.cacheTimeout;
    }

    /**
     * Get connection status
     */
    getConnectionStatus() {
        return {
            isConnected: this.isWordPressConnected,
            lastFetch: this.lastFetchTime,
            exerciseCount: this.exercises.length,
            programCount: this.workoutPrograms.length,
            source: this.isWordPressConnected ? 'WordPress' : 'Local'
        };
    }

    /**
     * Get exercise statistics
     */
    getExerciseStats() {
        const exercises = this.exercises.length > 0 ? this.exercises : defaultExercises;
        
        const stats = {
            total: exercises.length,
            byType: {},
            byDifficulty: {},
            byCategory: {}
        };

        exercises.forEach(exercise => {
            // Count by type
            stats.byType[exercise.type] = (stats.byType[exercise.type] || 0) + 1;
            
            // Count by difficulty
            const difficulty = exercise.difficulty || 'beginner';
            stats.byDifficulty[difficulty] = (stats.byDifficulty[difficulty] || 0) + 1;
            
            // Count by category
            const category = exercise.category || 'general';
            stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
        });

        return stats;
    }
}

// Create and export a singleton instance
const exerciseService = new ExerciseService();
export default exerciseService;

// Export the class for testing
export { ExerciseService };
