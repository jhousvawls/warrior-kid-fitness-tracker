// Local Storage utilities for Warrior Kid App
const STORAGE_KEYS = {
    USERS: 'warrior_kid_users',
    CURRENT_USER: 'warrior_kid_current_user',
    WORKOUTS: 'warrior_kid_workouts',
    SCREEN_TIME: 'warrior_kid_screen_time',
    PULLUP_PROGRESS: 'warrior_kid_pullup_progress'
};

export const storage = {
    // User management
    getUsers: () => {
        const users = localStorage.getItem(STORAGE_KEYS.USERS);
        return users ? JSON.parse(users) : [];
    },
    
    saveUser: (user) => {
        const users = storage.getUsers();
        const existingIndex = users.findIndex(u => u.id === user.id);
        
        if (existingIndex >= 0) {
            users[existingIndex] = user;
        } else {
            users.push(user);
        }
        
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    },
    
    getCurrentUser: () => {
        const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (!userId) return null;
        
        const users = storage.getUsers();
        return users.find(u => u.id === userId) || null;
    },
    
    setCurrentUser: (userId) => {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId);
    },
    
    // Workout tracking
    getWorkouts: (userId) => {
        const workouts = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
        const allWorkouts = workouts ? JSON.parse(workouts) : [];
        return allWorkouts.filter(w => w.userId === userId);
    },
    
    saveWorkout: (workout) => {
        const workouts = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
        const allWorkouts = workouts ? JSON.parse(workouts) : [];
        allWorkouts.push(workout);
        localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(allWorkouts));
    },
    
    // Screen time tracking
    getScreenTime: (userId) => {
        const screenTime = localStorage.getItem(STORAGE_KEYS.SCREEN_TIME);
        const allScreenTime = screenTime ? JSON.parse(screenTime) : {};
        return allScreenTime[userId] || 0;
    },
    
    addScreenTime: (userId, minutes) => {
        const screenTime = localStorage.getItem(STORAGE_KEYS.SCREEN_TIME);
        const allScreenTime = screenTime ? JSON.parse(screenTime) : {};
        allScreenTime[userId] = (allScreenTime[userId] || 0) + minutes;
        localStorage.setItem(STORAGE_KEYS.SCREEN_TIME, JSON.stringify(allScreenTime));
    },
    
    useScreenTime: (userId, minutes) => {
        const screenTime = localStorage.getItem(STORAGE_KEYS.SCREEN_TIME);
        const allScreenTime = screenTime ? JSON.parse(screenTime) : {};
        allScreenTime[userId] = Math.max(0, (allScreenTime[userId] || 0) - minutes);
        localStorage.setItem(STORAGE_KEYS.SCREEN_TIME, JSON.stringify(allScreenTime));
    },
    
    // Pull-up progress tracking
    getPullupProgress: (userId) => {
        const progress = localStorage.getItem(STORAGE_KEYS.PULLUP_PROGRESS);
        const allProgress = progress ? JSON.parse(progress) : {};
        return allProgress[userId] || [];
    },
    
    savePullupProgress: (userId, reps, date) => {
        const progress = localStorage.getItem(STORAGE_KEYS.PULLUP_PROGRESS);
        const allProgress = progress ? JSON.parse(progress) : {};
        
        if (!allProgress[userId]) {
            allProgress[userId] = [];
        }
        
        allProgress[userId].push({ date, reps, timestamp: Date.now() });
        localStorage.setItem(STORAGE_KEYS.PULLUP_PROGRESS, JSON.stringify(allProgress));
    }
};
