// Debug Logger for Warrior Kid Fitness Tracker
// Helps track screen time rewards and leaderboard updates

class DebugLogger {
    constructor() {
        this.logs = [];
        this.isEnabled = true; // Set to false to disable logging
    }

    log(category, message, data = null) {
        if (!this.isEnabled) return;

        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            category,
            message,
            data: data ? JSON.parse(JSON.stringify(data)) : null
        };

        this.logs.push(logEntry);
        
        // Console log with color coding
        const colors = {
            'WORKOUT': '🏋️',
            'SCREEN_TIME': '🎮',
            'LEADERBOARD': '🏆',
            'STORAGE': '💾',
            'WORDPRESS': '🌐',
            'ERROR': '❌',
            'SUCCESS': '✅',
            'WARNING': '⚠️',
            'DEBUG': '🔍'
        };

        const icon = colors[category] || '📝';
        console.log(`${icon} [${category}] ${message}`, data || '');
    }

    // Specific logging methods for different areas
    logWorkoutStart(user, workoutType = 'regular') {
        this.log('WORKOUT', `Workout started for user: ${user.name} (ID: ${user.id})`, {
            userId: user.id,
            userName: user.name,
            userAge: user.age,
            workoutType,
            timestamp: new Date().toISOString()
        });
    }

    logWorkoutComplete(user, workoutData) {
        this.log('WORKOUT', `Workout completed for user: ${user.name}`, {
            userId: user.id,
            userName: user.name,
            workoutData,
            timestamp: new Date().toISOString()
        });
    }

    logScreenTimeAttempt(userId, minutesToAdd) {
        this.log('SCREEN_TIME', `Attempting to add ${minutesToAdd} minutes to user ${userId}`);
    }

    logScreenTimeSuccess(userId, oldAmount, newAmount) {
        this.log('SCREEN_TIME', `Screen time updated successfully`, {
            userId,
            oldAmount,
            newAmount,
            added: newAmount - oldAmount
        });
    }

    logScreenTimeError(userId, error) {
        this.log('ERROR', `Screen time update failed for user ${userId}`, {
            userId,
            error: error.message || error,
            stack: error.stack
        });
    }

    logLeaderboardAttempt(userId, workoutData) {
        this.log('LEADERBOARD', `Attempting to update leaderboard for user ${userId}`, workoutData);
    }

    logLeaderboardSuccess(userId, leaderboardData) {
        this.log('LEADERBOARD', `Leaderboard updated successfully for user ${userId}`, leaderboardData);
    }

    logLeaderboardError(userId, error) {
        this.log('ERROR', `Leaderboard update failed for user ${userId}`, {
            userId,
            error: error.message || error,
            stack: error.stack
        });
    }

    logStorageOperation(operation, key, data, success) {
        this.log('STORAGE', `Storage ${operation}: ${key}`, {
            operation,
            key,
            data: typeof data === 'object' ? JSON.stringify(data) : data,
            success
        });
    }

    logWordPressOperation(operation, endpoint, data, success, error = null) {
        this.log('WORDPRESS', `WordPress ${operation}: ${endpoint}`, {
            operation,
            endpoint,
            data,
            success,
            error: error ? error.message || error : null
        });
    }

    // Get all logs for a specific category
    getLogsByCategory(category) {
        return this.logs.filter(log => log.category === category);
    }

    // Get recent logs (last N entries)
    getRecentLogs(count = 20) {
        return this.logs.slice(-count);
    }

    // Export logs for debugging
    exportLogs() {
        return {
            totalLogs: this.logs.length,
            logs: this.logs,
            summary: this.getSummary()
        };
    }

    // Get summary of log categories
    getSummary() {
        const summary = {};
        this.logs.forEach(log => {
            summary[log.category] = (summary[log.category] || 0) + 1;
        });
        return summary;
    }

    // Clear logs
    clearLogs() {
        this.logs = [];
        this.log('DEBUG', 'Logs cleared');
    }

    // Display debug panel in console
    showDebugPanel() {
        console.group('🔍 Warrior Kid Debug Panel');
        console.log('📊 Log Summary:', this.getSummary());
        console.log('📝 Recent Logs:', this.getRecentLogs(10));
        console.log('🎮 Screen Time Logs:', this.getLogsByCategory('SCREEN_TIME'));
        console.log('🏆 Leaderboard Logs:', this.getLogsByCategory('LEADERBOARD'));
        console.log('❌ Error Logs:', this.getLogsByCategory('ERROR'));
        console.groupEnd();
    }
}

// Create global debug logger instance
const debugLogger = new DebugLogger();

// Make it available globally for console debugging
if (typeof window !== 'undefined') {
    window.debugLogger = debugLogger;
    window.showDebugPanel = () => debugLogger.showDebugPanel();
    
    // Add helpful console commands
    console.log('🔍 Debug commands available:');
    console.log('  debugLogger.showDebugPanel() - Show debug panel');
    console.log('  debugLogger.exportLogs() - Export all logs');
    console.log('  debugLogger.clearLogs() - Clear all logs');
}

export default debugLogger;
