// WordPress API service for user data management
// This replaces localStorage with WordPress custom post types

const API_BASE = process.env.REACT_APP_WORDPRESS_API_URL || 'https://fitness4.wpenginepowered.com/wp-json/wp/v2';

class WordPressUserAPI {
    constructor() {
        this.endpoints = {
            users: `${API_BASE}/warrior-users`,
            workouts: `${API_BASE}/workout-sessions`,
            screenTime: `${API_BASE}/screen-time-logs`,
            progress: `${API_BASE}/progress-entries`
        };
    }

    // Helper method to handle API responses
    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`API Error: ${response.status} - ${error}`);
        }
        return response.json();
    }

    // Helper method to create WordPress post data structure
    createPostData(title, acfFields) {
        return {
            title: title,
            status: 'publish',
            acf: acfFields
        };
    }

    // USER MANAGEMENT
    async getUsers() {
        try {
            const response = await fetch(this.endpoints.users);
            const users = await this.handleResponse(response);
            
            return users.map(user => ({
                id: user.acf.user_id,
                name: user.acf.name,
                age: user.acf.age,
                createdAt: user.acf.created_at,
                totalScreenTime: user.acf.total_screen_time || 0,
                lastLogin: user.acf.last_login,
                wpId: user.id // Store WordPress post ID for updates
            }));
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }

    async saveUser(user) {
        try {
            const acfFields = {
                user_id: user.id,
                name: user.name,
                age: user.age,
                created_at: user.createdAt || new Date().toISOString(),
                total_screen_time: user.totalScreenTime || 0,
                last_login: new Date().toISOString()
            };

            // Include password if provided (for new users)
            if (user.password) {
                // Note: In production, passwords should be hashed before storing
                acfFields.password = user.password;
            }

            const postData = this.createPostData(`Warrior: ${user.name}`, acfFields);

            let response;
            if (user.wpId) {
                // Update existing user
                response = await fetch(`${this.endpoints.users}/${user.wpId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(postData)
                });
            } else {
                // Create new user
                response = await fetch(this.endpoints.users, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(postData)
                });
            }

            const result = await this.handleResponse(response);
            console.log('✅ WordPress user saved successfully:', result);
            return result;
        } catch (error) {
            console.error('❌ Error saving user to WordPress:', error);
            throw error;
        }
    }

    async getCurrentUser() {
        const userId = localStorage.getItem('warrior_kid_current_user');
        if (!userId) return null;

        try {
            const users = await this.getUsers();
            return users.find(u => u.id === userId) || null;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    setCurrentUser(userId) {
        localStorage.setItem('warrior_kid_current_user', userId);
    }

    // WORKOUT MANAGEMENT
    async getWorkouts(userId) {
        try {
            const response = await fetch(`${this.endpoints.workouts}?acf[user_id]=${userId}`);
            const workouts = await this.handleResponse(response);
            
            return workouts.map(workout => ({
                id: workout.id,
                userId: workout.acf.user_id,
                date: workout.acf.session_date,
                exercises: workout.acf.exercises_completed || [],
                duration: workout.acf.total_duration,
                screenTimeEarned: workout.acf.screen_time_earned || 10,
                completedAt: workout.acf.completed_at
            }));
        } catch (error) {
            console.error('Error fetching workouts:', error);
            return [];
        }
    }

    async saveWorkout(workout) {
        try {
            const postData = this.createPostData(
                `Workout - ${workout.userId} - ${workout.date}`,
                {
                    user_id: workout.userId,
                    session_date: workout.date,
                    exercises_completed: workout.exercises,
                    total_duration: workout.duration,
                    screen_time_earned: workout.screenTimeEarned || 10,
                    completed_at: workout.completedAt || new Date().toISOString()
                }
            );

            const response = await fetch(this.endpoints.workouts, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData)
            });

            const result = await this.handleResponse(response);
            
            // Also log the screen time earned
            await this.logScreenTime(workout.userId, workout.screenTimeEarned || 10, 'earned', 'workout');
            
            return result;
        } catch (error) {
            console.error('Error saving workout:', error);
            throw error;
        }
    }

    // SCREEN TIME MANAGEMENT
    async getScreenTime(userId) {
        try {
            const response = await fetch(`${this.endpoints.screenTime}?acf[user_id]=${userId}`);
            const logs = await this.handleResponse(response);
            
            let totalEarned = 0;
            let totalUsed = 0;
            
            logs.forEach(log => {
                if (log.acf.action_type === 'earned') {
                    totalEarned += log.acf.minutes;
                } else if (log.acf.action_type === 'used') {
                    totalUsed += log.acf.minutes;
                }
            });
            
            return Math.max(0, totalEarned - totalUsed);
        } catch (error) {
            console.error('Error fetching screen time:', error);
            return 0;
        }
    }

    async logScreenTime(userId, minutes, actionType, source) {
        try {
            const postData = this.createPostData(
                `Screen Time ${actionType} - ${userId} - ${minutes}min`,
                {
                    user_id: userId,
                    action_type: actionType,
                    minutes: minutes,
                    source: source,
                    timestamp: new Date().toISOString()
                }
            );

            const response = await fetch(this.endpoints.screenTime, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData)
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error logging screen time:', error);
            throw error;
        }
    }

    async addScreenTime(userId, minutes) {
        return this.logScreenTime(userId, minutes, 'earned', 'manual');
    }

    async useScreenTime(userId, minutes) {
        return this.logScreenTime(userId, minutes, 'used', 'gaming');
    }

    // PROGRESS TRACKING
    async getPullupProgress(userId) {
        try {
            const response = await fetch(`${this.endpoints.progress}?acf[user_id]=${userId}&acf[exercise_type]=pullups`);
            const entries = await this.handleResponse(response);
            
            return entries.map(entry => ({
                date: entry.acf.date,
                reps: entry.acf.value,
                timestamp: new Date(entry.acf.date).getTime(),
                notes: entry.acf.notes
            }));
        } catch (error) {
            console.error('Error fetching pullup progress:', error);
            return [];
        }
    }

    async savePullupProgress(userId, reps, date) {
        return this.saveProgress(userId, 'pullups', reps, date);
    }

    async saveProgress(userId, exerciseType, value, date, notes = '') {
        try {
            const postData = this.createPostData(
                `Progress - ${exerciseType} - ${userId} - ${date}`,
                {
                    user_id: userId,
                    exercise_type: exerciseType,
                    value: value,
                    date: date,
                    notes: notes
                }
            );

            const response = await fetch(this.endpoints.progress, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData)
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error saving progress:', error);
            throw error;
        }
    }

    // MIGRATION HELPER
    async migrateFromLocalStorage() {
        try {
            console.log('Starting migration from localStorage to WordPress...');
            
            // Get existing localStorage data
            const localUsers = JSON.parse(localStorage.getItem('warrior_kid_users') || '[]');
            const localWorkouts = JSON.parse(localStorage.getItem('warrior_kid_workouts') || '[]');
            const localScreenTime = JSON.parse(localStorage.getItem('warrior_kid_screen_time') || '{}');
            const localPullupProgress = JSON.parse(localStorage.getItem('warrior_kid_pullup_progress') || '{}');
            
            // Migrate users
            for (const user of localUsers) {
                await this.saveUser(user);
                console.log(`Migrated user: ${user.name}`);
            }
            
            // Migrate workouts
            for (const workout of localWorkouts) {
                await this.saveWorkout(workout);
                console.log(`Migrated workout for user: ${workout.userId}`);
            }
            
            // Migrate screen time logs
            for (const [userId, minutes] of Object.entries(localScreenTime)) {
                if (minutes > 0) {
                    await this.logScreenTime(userId, minutes, 'earned', 'migration');
                    console.log(`Migrated screen time for user: ${userId}`);
                }
            }
            
            // Migrate pullup progress
            for (const [userId, progressArray] of Object.entries(localPullupProgress)) {
                for (const progress of progressArray) {
                    await this.saveProgress(userId, 'pullups', progress.reps, progress.date);
                }
                console.log(`Migrated pullup progress for user: ${userId}`);
            }
            
            console.log('Migration completed successfully!');
            return true;
        } catch (error) {
            console.error('Migration failed:', error);
            return false;
        }
    }
}

// Create and export a singleton instance
export const wordpressUserAPI = new WordPressUserAPI();

// Export the class for testing
export default WordPressUserAPI;
