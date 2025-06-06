# WordPress + React Integration Guide
## Migrating from localStorage to WordPress Custom Post Types

This guide shows you how to update your React app to use WordPress as the backend instead of localStorage.

## Overview

We'll update your existing React components to use the new `wordpressUserAPI.js` service instead of the localStorage utility.

---

## Step 1: Update Environment Variables

Add the WordPress API URL to your `.env` file:

```env
REACT_APP_WORDPRESS_API_URL=https://fitness4.wpenginepowered.com/wp-json/wp/v2
```

---

## Step 2: Update Components to Use WordPress API

### 2.1 Update LoginForm.js

Replace the localStorage imports and usage:

```javascript
// OLD - Remove this import
// import { storage } from '../../utils/localStorage';

// NEW - Add this import
import { wordpressUserAPI } from '../../services/wordpressUserAPI';

// In the component, replace storage calls:

// OLD
const [users] = useState(storage.getUsers());

// NEW
const [users, setUsers] = useState([]);

// Add useEffect to load users
useEffect(() => {
    const loadUsers = async () => {
        const fetchedUsers = await wordpressUserAPI.getUsers();
        setUsers(fetchedUsers);
    };
    loadUsers();
}, []);

// OLD
const handleMathSuccess = () => {
    let user = users.find(u => u.name.toLowerCase() === formData.name.toLowerCase());
    
    if (!user) {
        user = {
            id: Date.now().toString(),
            name: formData.name.trim(),
            age: parseInt(formData.age),
            createdAt: new Date().toISOString()
        };
        storage.saveUser(user);
    }
    
    storage.setCurrentUser(user.id);
    onLogin(user);
};

// NEW
const handleMathSuccess = async () => {
    let user = users.find(u => u.name.toLowerCase() === formData.name.toLowerCase());
    
    if (!user) {
        user = {
            id: Date.now().toString(),
            name: formData.name.trim(),
            age: parseInt(formData.age),
            createdAt: new Date().toISOString()
        };
        await wordpressUserAPI.saveUser(user);
    }
    
    wordpressUserAPI.setCurrentUser(user.id);
    onLogin(user);
};
```

### 2.2 Update Dashboard.js

Replace localStorage usage with WordPress API:

```javascript
// OLD - Remove this import
// import { storage } from '../../utils/localStorage';

// NEW - Add this import
import { wordpressUserAPI } from '../../services/wordpressUserAPI';

// Update the loadUserData function:

// OLD
const loadUserData = useCallback(() => {
    const userScreenTime = storage.getScreenTime(user.id);
    const userWorkouts = storage.getWorkouts(user.id);
    const today = dateHelpers.getTodayString();
    
    setScreenTime(userScreenTime);
    
    // Calculate weekly progress (5/7 days goal)
    const daysThisWeek = dateHelpers.getWorkoutDaysThisWeek(userWorkouts);
    setWeeklyProgress(daysThisWeek);
    
    // Count today's completed cycles
    const todayCycles = userWorkouts.filter(w => w.date === today).length;
    setTodayWorkouts(todayCycles);
}, [user.id]);

// NEW
const loadUserData = useCallback(async () => {
    try {
        const userScreenTime = await wordpressUserAPI.getScreenTime(user.id);
        const userWorkouts = await wordpressUserAPI.getWorkouts(user.id);
        const today = dateHelpers.getTodayString();
        
        setScreenTime(userScreenTime);
        
        // Calculate weekly progress (5/7 days goal)
        const daysThisWeek = dateHelpers.getWorkoutDaysThisWeek(userWorkouts);
        setWeeklyProgress(daysThisWeek);
        
        // Count today's completed cycles
        const todayCycles = userWorkouts.filter(w => w.date === today).length;
        setTodayWorkouts(todayCycles);
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}, [user.id]);
```

### 2.3 Update WorkoutSession.js

Replace workout saving logic:

```javascript
// OLD - Remove this import
// import { storage } from '../../utils/localStorage';

// NEW - Add this import
import { wordpressUserAPI } from '../../services/wordpressUserAPI';

// Update the handleWorkoutComplete function:

// OLD
const handleWorkoutComplete = () => {
    const workout = {
        id: Date.now().toString(),
        userId: user.id,
        date: dateHelpers.getTodayString(),
        exercises: exercises.map(exercise => ({
            id: exercise.id,
            name: exercise.name,
            completed: completedExercises[exercise.id] || false,
            reps: completedExercises[exercise.id] ? exercise.target : 0
        })),
        duration: Math.floor((Date.now() - startTime) / 1000),
        completedAt: new Date().toISOString()
    };

    storage.saveWorkout(workout);
    storage.addScreenTime(user.id, 10);
    
    onWorkoutComplete();
};

// NEW
const handleWorkoutComplete = async () => {
    try {
        const workout = {
            userId: user.id,
            date: dateHelpers.getTodayString(),
            exercises: exercises.map(exercise => ({
                exercise_id: exercise.id,
                exercise_name: exercise.name,
                reps_completed: completedExercises[exercise.id] ? exercise.target : 0,
                target_reps: exercise.target,
                completed: completedExercises[exercise.id] || false
            })),
            duration: Math.floor((Date.now() - startTime) / 1000),
            screenTimeEarned: 10,
            completedAt: new Date().toISOString()
        };

        await wordpressUserAPI.saveWorkout(workout);
        
        onWorkoutComplete();
    } catch (error) {
        console.error('Error saving workout:', error);
        // Fallback to localStorage if WordPress fails
        // ... existing localStorage code as backup
    }
};
```

### 2.4 Update ProgressTracker.js

Replace progress tracking:

```javascript
// OLD - Remove this import
// import { storage } from '../../utils/localStorage';

// NEW - Add this import
import { wordpressUserAPI } from '../../services/wordpressUserAPI';

// Update progress loading:

// OLD
useEffect(() => {
    const userWorkouts = storage.getWorkouts(user.id);
    const pullupData = storage.getPullupProgress(user.id);
    
    // ... existing logic
}, [user.id]);

// NEW
useEffect(() => {
    const loadProgressData = async () => {
        try {
            const userWorkouts = await wordpressUserAPI.getWorkouts(user.id);
            const pullupData = await wordpressUserAPI.getPullupProgress(user.id);
            
            // ... existing logic
        } catch (error) {
            console.error('Error loading progress data:', error);
        }
    };
    
    loadProgressData();
}, [user.id]);

// Update pullup progress saving:

// OLD
const handlePullupSubmit = (e) => {
    e.preventDefault();
    if (pullupReps > 0) {
        storage.savePullupProgress(user.id, pullupReps, dateHelpers.getTodayString());
        setPullupReps('');
        // Reload data
    }
};

// NEW
const handlePullupSubmit = async (e) => {
    e.preventDefault();
    if (pullupReps > 0) {
        try {
            await wordpressUserAPI.savePullupProgress(user.id, pullupReps, dateHelpers.getTodayString());
            setPullupReps('');
            // Reload data
        } catch (error) {
            console.error('Error saving pullup progress:', error);
        }
    }
};
```

### 2.5 Update Leaderboard.js

Replace user data fetching:

```javascript
// OLD - Remove this import
// import { storage } from '../../utils/localStorage';

// NEW - Add this import
import { wordpressUserAPI } from '../../services/wordpressUserAPI';

// Update leaderboard data loading:

// OLD
useEffect(() => {
    const users = storage.getUsers();
    const leaderboardData = users.map(user => {
        const userWorkouts = storage.getWorkouts(user.id);
        // ... calculate stats
    });
    setLeaderboard(leaderboardData);
}, []);

// NEW
useEffect(() => {
    const loadLeaderboardData = async () => {
        try {
            const users = await wordpressUserAPI.getUsers();
            const leaderboardData = await Promise.all(
                users.map(async (user) => {
                    const userWorkouts = await wordpressUserAPI.getWorkouts(user.id);
                    // ... calculate stats
                    return {
                        // ... user stats
                    };
                })
            );
            setLeaderboard(leaderboardData);
        } catch (error) {
            console.error('Error loading leaderboard data:', error);
        }
    };
    
    loadLeaderboardData();
}, []);
```

---

## Step 3: Add Migration Feature

Create a migration button in your admin panel or add it temporarily to test the migration:

```javascript
// Add to AdminPanel.js or create a temporary migration component

import { wordpressUserAPI } from '../../services/wordpressUserAPI';

const MigrationButton = () => {
    const [migrating, setMigrating] = useState(false);
    const [migrationStatus, setMigrationStatus] = useState('');

    const handleMigration = async () => {
        setMigrating(true);
        setMigrationStatus('Starting migration...');
        
        try {
            const success = await wordpressUserAPI.migrateFromLocalStorage();
            if (success) {
                setMigrationStatus('Migration completed successfully!');
            } else {
                setMigrationStatus('Migration failed. Check console for errors.');
            }
        } catch (error) {
            setMigrationStatus(`Migration error: ${error.message}`);
        }
        
        setMigrating(false);
    };

    return (
        <div className="card">
            <h3>Data Migration</h3>
            <p>Migrate your localStorage data to WordPress backend.</p>
            <button 
                className="btn btn-primary"
                onClick={handleMigration}
                disabled={migrating}
            >
                {migrating ? 'Migrating...' : 'Migrate Data to WordPress'}
            </button>
            {migrationStatus && (
                <p style={{ marginTop: '1rem', color: 'var(--navy-blue)' }}>
                    {migrationStatus}
                </p>
            )}
        </div>
    );
};
```

---

## Step 4: Add Error Handling and Fallbacks

Create a hybrid approach that falls back to localStorage if WordPress is unavailable:

```javascript
// Create src/services/hybridStorage.js

import { storage } from '../utils/localStorage';
import { wordpressUserAPI } from './wordpressUserAPI';

class HybridStorage {
    constructor() {
        this.useWordPress = true;
        this.testConnection();
    }

    async testConnection() {
        try {
            await wordpressUserAPI.getUsers();
            this.useWordPress = true;
            console.log('WordPress API connected successfully');
        } catch (error) {
            this.useWordPress = false;
            console.warn('WordPress API unavailable, falling back to localStorage');
        }
    }

    async getUsers() {
        if (this.useWordPress) {
            try {
                return await wordpressUserAPI.getUsers();
            } catch (error) {
                console.warn('WordPress failed, using localStorage fallback');
                this.useWordPress = false;
            }
        }
        return storage.getUsers();
    }

    async saveUser(user) {
        if (this.useWordPress) {
            try {
                const result = await wordpressUserAPI.saveUser(user);
                // Also save to localStorage as backup
                storage.saveUser(user);
                return result;
            } catch (error) {
                console.warn('WordPress failed, using localStorage fallback');
                this.useWordPress = false;
            }
        }
        return storage.saveUser(user);
    }

    // Add similar methods for other operations...
}

export const hybridStorage = new HybridStorage();
```

---

## Step 5: Testing the Integration

1. **Set up WordPress custom post types** using the guide in `WORDPRESS_CUSTOM_POST_TYPES_SETUP.md`
2. **Update your React components** with the new API calls
3. **Test the migration** by running the migration function
4. **Verify data persistence** by checking the WordPress admin panel
5. **Test offline functionality** by ensuring localStorage fallback works

---

## Step 6: Performance Optimizations

### Add Caching
```javascript
// Add to wordpressUserAPI.js
class WordPressUserAPI {
    constructor() {
        // ... existing code
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    async getUsers() {
        const cacheKey = 'users';
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        try {
            const users = await this.fetchUsers(); // your existing fetch logic
            this.cache.set(cacheKey, {
                data: users,
                timestamp: Date.now()
            });
            return users;
        } catch (error) {
            // Return cached data if available, even if expired
            if (cached) return cached.data;
            throw error;
        }
    }
}
```

### Add Loading States
```javascript
// Add loading states to components
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await wordpressUserAPI.getUsers();
            // ... handle data
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    loadData();
}, []);
```

---

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure CORS headers are added to WordPress functions.php
2. **ACF Fields Not Showing**: Verify "Show in REST API" is enabled for all field groups
3. **Authentication Issues**: WordPress may require authentication for POST requests
4. **Slow Performance**: Implement caching and consider pagination for large datasets

### Debug Mode:
Add this to your .env for detailed API logging:
```env
REACT_APP_DEBUG_API=true
```

This integration gives you the best of both worlds: the reliability of WordPress as a backend with the speed and offline capability of localStorage as a fallback!
