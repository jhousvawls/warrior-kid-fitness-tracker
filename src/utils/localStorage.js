// Storage utilities for Warrior Kid App - Now using WordPress backend
import { wordpressUserAPI } from '../services/wordpressUserAPI';
import debugLogger from './debugLogger';

// Fallback localStorage keys for offline mode
const STORAGE_KEYS = {
    USERS: 'warrior_kid_users',
    CURRENT_USER: 'warrior_kid_current_user',
    WORKOUTS: 'warrior_kid_workouts',
    SCREEN_TIME: 'warrior_kid_screen_time',
    PULLUP_PROGRESS: 'warrior_kid_pullup_progress'
};

// Helper to check if we're online and WordPress is available
const isOnline = () => navigator.onLine;

export const storage = {
    // User management
    getUsers: async () => {
        try {
            if (isOnline()) {
                return await wordpressUserAPI.getUsers();
            } else {
                // Fallback to localStorage when offline
                const users = localStorage.getItem(STORAGE_KEYS.USERS);
                return users ? JSON.parse(users) : [];
            }
        } catch (error) {
            console.warn('WordPress API unavailable, using localStorage fallback:', error);
            const users = localStorage.getItem(STORAGE_KEYS.USERS);
            return users ? JSON.parse(users) : [];
        }
    },
    
    saveUser: async (user) => {
        try {
            if (isOnline()) {
                await wordpressUserAPI.saveUser(user);
            }
            
            // Always save to localStorage as backup
            const users = await storage.getUsers();
            const existingIndex = users.findIndex(u => u.id === user.id);
            
            if (existingIndex >= 0) {
                users[existingIndex] = user;
            } else {
                users.push(user);
            }
            
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        } catch (error) {
            console.warn('Failed to save user to WordPress, saved locally:', error);
            // Fallback to localStorage only
            const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
            const existingIndex = users.findIndex(u => u.id === user.id);
            
            if (existingIndex >= 0) {
                users[existingIndex] = user;
            } else {
                users.push(user);
            }
            
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        }
    },
    
    getCurrentUser: async () => {
        try {
            if (isOnline()) {
                return await wordpressUserAPI.getCurrentUser();
            } else {
                // Fallback to localStorage when offline
                const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
                if (!userId) return null;
                
                const users = await storage.getUsers();
                return users.find(u => u.id === userId) || null;
            }
        } catch (error) {
            console.warn('WordPress API unavailable, using localStorage fallback:', error);
            const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
            if (!userId) return null;
            
            const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
            return users.find(u => u.id === userId) || null;
        }
    },
    
    setCurrentUser: (userId) => {
        try {
            if (isOnline()) {
                wordpressUserAPI.setCurrentUser(userId);
            }
        } catch (error) {
            console.warn('WordPress API unavailable for setCurrentUser:', error);
        }
        
        // Always save to localStorage as backup
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId);
    },
    
    // Workout tracking
    getWorkouts: async (userId) => {
        try {
            if (isOnline()) {
                return await wordpressUserAPI.getWorkouts(userId);
            } else {
                // Fallback to localStorage when offline
                const workouts = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
                const allWorkouts = workouts ? JSON.parse(workouts) : [];
                return allWorkouts.filter(w => w.userId === userId);
            }
        } catch (error) {
            console.warn('WordPress API unavailable, using localStorage fallback:', error);
            const workouts = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
            const allWorkouts = workouts ? JSON.parse(workouts) : [];
            return allWorkouts.filter(w => w.userId === userId);
        }
    },
    
    saveWorkout: async (workout) => {
        try {
            if (isOnline()) {
                await wordpressUserAPI.saveWorkout(workout);
            }
            
            // Always save to localStorage as backup
            const workouts = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
            const allWorkouts = workouts ? JSON.parse(workouts) : [];
            allWorkouts.push(workout);
            localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(allWorkouts));
        } catch (error) {
            console.warn('Failed to save workout to WordPress, saved locally:', error);
            // Fallback to localStorage only
            const workouts = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
            const allWorkouts = workouts ? JSON.parse(workouts) : [];
            allWorkouts.push(workout);
            localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(allWorkouts));
        }
    },
    
    // Screen time tracking
    getScreenTime: async (userId) => {
        try {
            debugLogger.log('STORAGE', `Getting screen time for user ${userId}`);
            if (isOnline()) {
                const screenTime = await wordpressUserAPI.getScreenTime(userId);
                debugLogger.logStorageOperation('GET', 'screen_time_wordpress', { userId, screenTime }, true);
                return screenTime;
            } else {
                // Fallback to localStorage when offline
                const screenTime = localStorage.getItem(STORAGE_KEYS.SCREEN_TIME);
                const allScreenTime = screenTime ? JSON.parse(screenTime) : {};
                const userScreenTime = allScreenTime[userId] || 0;
                debugLogger.logStorageOperation('GET', 'screen_time_localStorage', { userId, screenTime: userScreenTime }, true);
                return userScreenTime;
            }
        } catch (error) {
            debugLogger.logStorageOperation('GET', 'screen_time_wordpress', { userId, error }, false);
            console.warn('WordPress API unavailable, using localStorage fallback:', error);
            const screenTime = localStorage.getItem(STORAGE_KEYS.SCREEN_TIME);
            const allScreenTime = screenTime ? JSON.parse(screenTime) : {};
            const userScreenTime = allScreenTime[userId] || 0;
            debugLogger.logStorageOperation('GET', 'screen_time_localStorage_fallback', { userId, screenTime: userScreenTime }, true);
            return userScreenTime;
        }
    },
    
    addScreenTime: async (userId, minutes) => {
        debugLogger.log('STORAGE', `Adding ${minutes} minutes screen time for user ${userId}`);
        
        try {
            // Get current screen time first
            const currentScreenTime = localStorage.getItem(STORAGE_KEYS.SCREEN_TIME);
            const allScreenTime = currentScreenTime ? JSON.parse(currentScreenTime) : {};
            const oldAmount = allScreenTime[userId] || 0;
            
            debugLogger.log('SCREEN_TIME', `Current screen time before adding: ${oldAmount} minutes`);
            
            if (isOnline()) {
                debugLogger.logWordPressOperation('ADD_SCREEN_TIME', '/wp-json/warrior-kid/v1/screen-time', { userId, minutes }, false);
                await wordpressUserAPI.addScreenTime(userId, minutes);
                debugLogger.logWordPressOperation('ADD_SCREEN_TIME', '/wp-json/warrior-kid/v1/screen-time', { userId, minutes }, true);
            }
            
            // Always update localStorage as backup
            allScreenTime[userId] = oldAmount + minutes;
            localStorage.setItem(STORAGE_KEYS.SCREEN_TIME, JSON.stringify(allScreenTime));
            
            const newAmount = allScreenTime[userId];
            debugLogger.logStorageOperation('ADD', 'screen_time_localStorage', { userId, oldAmount, newAmount, added: minutes }, true);
            debugLogger.logScreenTimeSuccess(userId, oldAmount, newAmount);
            
        } catch (error) {
            debugLogger.logWordPressOperation('ADD_SCREEN_TIME', '/wp-json/warrior-kid/v1/screen-time', { userId, minutes }, false, error);
            debugLogger.logScreenTimeError(userId, error);
            console.warn('Failed to add screen time to WordPress, saved locally:', error);
            
            // Fallback to localStorage only
            const screenTime = localStorage.getItem(STORAGE_KEYS.SCREEN_TIME);
            const allScreenTime = screenTime ? JSON.parse(screenTime) : {};
            const oldAmount = allScreenTime[userId] || 0;
            allScreenTime[userId] = oldAmount + minutes;
            localStorage.setItem(STORAGE_KEYS.SCREEN_TIME, JSON.stringify(allScreenTime));
            
            const newAmount = allScreenTime[userId];
            debugLogger.logStorageOperation('ADD', 'screen_time_localStorage_fallback', { userId, oldAmount, newAmount, added: minutes }, true);
        }
    },
    
    useScreenTime: async (userId, minutes) => {
        try {
            if (isOnline()) {
                await wordpressUserAPI.useScreenTime(userId, minutes);
            }
            
            // Always update localStorage as backup
            const screenTime = localStorage.getItem(STORAGE_KEYS.SCREEN_TIME);
            const allScreenTime = screenTime ? JSON.parse(screenTime) : {};
            allScreenTime[userId] = Math.max(0, (allScreenTime[userId] || 0) - minutes);
            localStorage.setItem(STORAGE_KEYS.SCREEN_TIME, JSON.stringify(allScreenTime));
        } catch (error) {
            console.warn('Failed to use screen time in WordPress, saved locally:', error);
            // Fallback to localStorage only
            const screenTime = localStorage.getItem(STORAGE_KEYS.SCREEN_TIME);
            const allScreenTime = screenTime ? JSON.parse(screenTime) : {};
            allScreenTime[userId] = Math.max(0, (allScreenTime[userId] || 0) - minutes);
            localStorage.setItem(STORAGE_KEYS.SCREEN_TIME, JSON.stringify(allScreenTime));
        }
    },
    
    // Pull-up progress tracking
    getPullupProgress: async (userId) => {
        try {
            if (isOnline()) {
                return await wordpressUserAPI.getPullupProgress(userId);
            } else {
                // Fallback to localStorage when offline
                const progress = localStorage.getItem(STORAGE_KEYS.PULLUP_PROGRESS);
                const allProgress = progress ? JSON.parse(progress) : {};
                return allProgress[userId] || [];
            }
        } catch (error) {
            console.warn('WordPress API unavailable, using localStorage fallback:', error);
            const progress = localStorage.getItem(STORAGE_KEYS.PULLUP_PROGRESS);
            const allProgress = progress ? JSON.parse(progress) : {};
            return allProgress[userId] || [];
        }
    },
    
    savePullupProgress: async (userId, reps, date) => {
        try {
            if (isOnline()) {
                await wordpressUserAPI.savePullupProgress(userId, reps, date);
            }
            
            // Always save to localStorage as backup
            const progress = localStorage.getItem(STORAGE_KEYS.PULLUP_PROGRESS);
            const allProgress = progress ? JSON.parse(progress) : {};
            
            if (!allProgress[userId]) {
                allProgress[userId] = [];
            }
            
            allProgress[userId].push({ date, reps, timestamp: Date.now() });
            localStorage.setItem(STORAGE_KEYS.PULLUP_PROGRESS, JSON.stringify(allProgress));
        } catch (error) {
            console.warn('Failed to save pullup progress to WordPress, saved locally:', error);
            // Fallback to localStorage only
            const progress = localStorage.getItem(STORAGE_KEYS.PULLUP_PROGRESS);
            const allProgress = progress ? JSON.parse(progress) : {};
            
            if (!allProgress[userId]) {
                allProgress[userId] = [];
            }
            
            allProgress[userId].push({ date, reps, timestamp: Date.now() });
            localStorage.setItem(STORAGE_KEYS.PULLUP_PROGRESS, JSON.stringify(allProgress));
        }
    },

    // Migration helper - run this once to migrate existing localStorage data to WordPress
    migrateToWordPress: async () => {
        try {
            console.log('Starting migration from localStorage to WordPress...');
            return await wordpressUserAPI.migrateFromLocalStorage();
        } catch (error) {
            console.error('Migration failed:', error);
            return false;
        }
    }
};
