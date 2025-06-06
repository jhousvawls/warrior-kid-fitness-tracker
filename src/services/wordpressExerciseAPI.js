/**
 * WordPress Exercise API Service
 * Handles fetching and managing exercise data from WordPress
 */

const API_BASE_URL = process.env.REACT_APP_WORDPRESS_API_URL || 'https://fitness4.wpenginepowered.com/wp-json/wp/v2';

class WordPressExerciseAPI {
    
    /**
     * Fetch all exercises from WordPress
     */
    async fetchExercises() {
        try {
            const response = await fetch(`${API_BASE_URL}/warrior-exercises?per_page=100&orderby=menu_order&order=asc`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const exercises = await response.json();
            
            // Transform WordPress data to match React app format
            return exercises.map(exercise => this.transformExerciseData(exercise));
            
        } catch (error) {
            console.error('Error fetching exercises from WordPress:', error);
            // Return null to indicate failure - app will use fallback data
            return null;
        }
    }
    
    /**
     * Fetch workout programs from WordPress
     */
    async fetchWorkoutPrograms() {
        try {
            const response = await fetch(`${API_BASE_URL}/warrior-programs?per_page=100`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const programs = await response.json();
            
            // Transform WordPress data to match React app format
            return programs.map(program => this.transformProgramData(program));
            
        } catch (error) {
            console.error('Error fetching workout programs from WordPress:', error);
            return null;
        }
    }
    
    /**
     * Fetch a specific workout program with its exercises
     */
    async fetchWorkoutProgram(programId) {
        try {
            const response = await fetch(`${API_BASE_URL}/warrior-programs/${programId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const program = await response.json();
            
            // Fetch the exercises for this program
            if (program.program_exercises && program.program_exercises.length > 0) {
                const exercisePromises = program.program_exercises.map(exerciseId => 
                    fetch(`${API_BASE_URL}/warrior-exercises/${exerciseId}`)
                        .then(res => res.json())
                        .then(exercise => this.transformExerciseData(exercise))
                );
                
                const exercises = await Promise.all(exercisePromises);
                
                return {
                    ...this.transformProgramData(program),
                    exercises: exercises.sort((a, b) => (a.order || 0) - (b.order || 0))
                };
            }
            
            return this.transformProgramData(program);
            
        } catch (error) {
            console.error('Error fetching workout program from WordPress:', error);
            return null;
        }
    }
    
    /**
     * Transform WordPress exercise data to React app format
     */
    transformExerciseData(wpExercise) {
        return {
            id: wpExercise.id,
            name: wpExercise.title?.rendered || wpExercise.exercise_name || 'Unknown Exercise',
            avatar: wpExercise.exercise_avatar || '💪',
            type: wpExercise.exercise_type || 'reps',
            target: wpExercise.target_value || 10,
            unit: wpExercise.unit_label || 'reps',
            videoUrl: wpExercise.video_url || '',
            instructions: wpExercise.exercise_instructions || wpExercise.content?.rendered || 'No instructions available',
            isSpecial: wpExercise.is_special_tracking || false,
            difficulty: wpExercise.difficulty_level || 'beginner',
            category: wpExercise.exercise_category || 'general',
            restTime: wpExercise.rest_time_after || 15,
            screenTimeBonus: wpExercise.screen_time_bonus || 0,
            order: wpExercise.exercise_order || 1
        };
    }
    
    /**
     * Transform WordPress program data to React app format
     */
    transformProgramData(wpProgram) {
        return {
            id: wpProgram.id,
            name: wpProgram.title?.rendered || 'Unknown Program',
            description: wpProgram.program_description || wpProgram.content?.rendered || 'No description available',
            exercises: wpProgram.program_exercises || [],
            totalRounds: wpProgram.total_rounds || 3,
            difficulty: wpProgram.program_difficulty || 'beginner',
            estimatedDuration: wpProgram.estimated_duration || 15,
            ageGroups: wpProgram.age_groups || [],
            isActive: wpProgram.program_active !== false
        };
    }
    
    /**
     * Create a new exercise in WordPress
     */
    async createExercise(exerciseData) {
        try {
            const response = await fetch(`${API_BASE_URL}/warrior-exercises`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: exerciseData.name,
                    content: exerciseData.instructions,
                    status: 'publish',
                    exercise_avatar: exerciseData.avatar,
                    exercise_type: exerciseData.type,
                    target_value: exerciseData.target,
                    unit_label: exerciseData.unit,
                    exercise_instructions: exerciseData.instructions,
                    video_url: exerciseData.videoUrl,
                    is_special_tracking: exerciseData.isSpecial,
                    difficulty_level: exerciseData.difficulty,
                    exercise_category: exerciseData.category,
                    rest_time_after: exerciseData.restTime,
                    screen_time_bonus: exerciseData.screenTimeBonus,
                    exercise_order: exerciseData.order
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const newExercise = await response.json();
            return this.transformExerciseData(newExercise);
            
        } catch (error) {
            console.error('Error creating exercise in WordPress:', error);
            throw error;
        }
    }
    
    /**
     * Update an existing exercise in WordPress
     */
    async updateExercise(exerciseId, exerciseData) {
        try {
            const response = await fetch(`${API_BASE_URL}/warrior-exercises/${exerciseId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: exerciseData.name,
                    content: exerciseData.instructions,
                    exercise_avatar: exerciseData.avatar,
                    exercise_type: exerciseData.type,
                    target_value: exerciseData.target,
                    unit_label: exerciseData.unit,
                    exercise_instructions: exerciseData.instructions,
                    video_url: exerciseData.videoUrl,
                    is_special_tracking: exerciseData.isSpecial,
                    difficulty_level: exerciseData.difficulty,
                    exercise_category: exerciseData.category,
                    rest_time_after: exerciseData.restTime,
                    screen_time_bonus: exerciseData.screenTimeBonus,
                    exercise_order: exerciseData.order
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const updatedExercise = await response.json();
            return this.transformExerciseData(updatedExercise);
            
        } catch (error) {
            console.error('Error updating exercise in WordPress:', error);
            throw error;
        }
    }
    
    /**
     * Delete an exercise from WordPress
     */
    async deleteExercise(exerciseId) {
        try {
            const response = await fetch(`${API_BASE_URL}/warrior-exercises/${exerciseId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return true;
            
        } catch (error) {
            console.error('Error deleting exercise from WordPress:', error);
            throw error;
        }
    }
    
    /**
     * Test WordPress connection
     */
    async testConnection() {
        try {
            const response = await fetch(`${API_BASE_URL}/warrior-exercises?per_page=1`);
            return response.ok;
        } catch (error) {
            console.error('WordPress connection test failed:', error);
            return false;
        }
    }
}

// Create and export a singleton instance
const wordpressExerciseAPI = new WordPressExerciseAPI();
export default wordpressExerciseAPI;

// Export the class for testing purposes
export { WordPressExerciseAPI };
