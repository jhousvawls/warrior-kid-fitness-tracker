// Date utility functions for Warrior Kid App

export const dateHelpers = {
    // Get today's date in YYYY-MM-DD format
    getTodayString: () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    },
    
    // Get the start of the current week (Monday)
    getWeekStart: (date = new Date()) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        const monday = new Date(d.setDate(diff));
        return monday.toISOString().split('T')[0];
    },
    
    // Get the end of the current week (Sunday)
    getWeekEnd: (date = new Date()) => {
        const weekStart = new Date(dateHelpers.getWeekStart(date));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return weekEnd.toISOString().split('T')[0];
    },
    
    // Get array of dates for current week
    getWeekDates: (date = new Date()) => {
        const weekStart = new Date(dateHelpers.getWeekStart(date));
        const dates = [];
        
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(weekStart);
            currentDate.setDate(weekStart.getDate() + i);
            dates.push(currentDate.toISOString().split('T')[0]);
        }
        
        return dates;
    },
    
    // Check if a date is today
    isToday: (dateString) => {
        return dateString === dateHelpers.getTodayString();
    },
    
    // Check if a date is in the current week
    isThisWeek: (dateString) => {
        const weekStart = dateHelpers.getWeekStart();
        const weekEnd = dateHelpers.getWeekEnd();
        return dateString >= weekStart && dateString <= weekEnd;
    },
    
    // Get days worked out this week
    getWorkoutDaysThisWeek: (workouts) => {
        // Safety check: ensure workouts is an array
        if (!Array.isArray(workouts)) {
            console.warn('getWorkoutDaysThisWeek received non-array:', workouts);
            return 0;
        }
        
        const thisWeekDates = dateHelpers.getWeekDates();
        const workoutDates = workouts.map(w => w.date);
        
        return thisWeekDates.filter(date => workoutDates.includes(date)).length;
    },
    
    // Format date for display
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
    },
    
    // Get month name
    getMonthName: (date = new Date()) => {
        return date.toLocaleDateString('en-US', { month: 'long' });
    },
    
    // Check if date is in current month
    isThisMonth: (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    }
};
