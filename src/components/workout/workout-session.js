import React, { useState } from 'react';
import { useApp } from '../../App';
import { exercises, weeklySchedule } from '../../constants/exercises';
import ExerciseSection from './ExerciseSection';
import { Trophy, Clock } from '../common/Icons';
import { getDayKey, getTodayName } from '../../utils/dateHelpers';
import { checkAchievements } from '../../utils/achievements';

function WorkoutSession() {
  const { 
    activeWorkout, 
    setActiveWorkout, 
    currentWeek, 
    currentUser,
    getCurrentUserData,
    updateUserData 
  } = useApp();
  
  const [completedExercises, setCompletedExercises] = useState({});

  const completeExercise = (section, index, value = null) => {
    const key = `${section}-${index}`;
    if (value !== null) {
      setCompletedExercises(prev => ({ ...prev, [key]: value }));
    } else {
      setCompletedExercises(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const completeWorkout = () => {
    const dayKey = getDayKey();
    const today = getTodayName();
    const userData = getCurrentUserData();
    const pullupKey = 'main-7';
    const pullups = completedExercises[pullupKey] || 0;
    
    const newWorkout = {
      day: today,
      week: currentWeek,
      completed: true,
      pullups: pullups,
      focus: weeklySchedule[today]?.focus || 'General',
      date: new Date().toISOString()
    };

    // Calculate streak
    const workoutDates = Object.keys(userData.workouts).map(key => new Date(key.split('-').join('/')));
    const today_date = new Date();
    const yesterday = new Date(today_date);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let newStreak = 1;
    if (workoutDates.some(date => date.toDateString() === yesterday.toDateString())) {
      newStreak = userData.currentStreak + 1;
    }

    const newTotalPullups = userData.totalPullups + pullups;
    
    // Check for new achievements
    const newAchievements = checkAchievements(
      userData,
      newTotalPullups,
      pullups,
      newStreak
    );

    updateUserData({
      workouts: { ...userData.workouts, [dayKey]: newWorkout },
      screenTimeEarned: userData.screenTimeEarned + 10,
      totalPullups: newTotalPullups,
      currentStreak: newStreak,
      longestStreak: Math.max(userData.longestStreak || 0, newStreak),
      achievements: newAchievements
    });
    
    setActiveWorkout(null);
    setCompletedExercises({});
  };

  const todayFocus = weeklySchedule[activeWorkout]?.focus;
  const totalExercises = exercises.warmup.length + exercises.main.length + exercises.cooldown.length;
  const completedCount = Object.keys(completedExercises).length;
  const allCompleted = totalExercises === completedCount;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {activeWorkout} Workout - Week {currentWeek}
            </h2>
            <p className="text-sm text-gray-600">👤 {currentUser}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Today's Focus:</p>
            <p className="font-semibold text-purple-600">{todayFocus}</p>
            <div className="mt-2 text-lg font-bold">
              <span className="text-blue-600">{completedCount}</span>
              <span className="text-gray-400"> / </span>
              <span className="text-gray-600">{totalExercises}</span>
              <span className="text-sm text-gray-500 block">exercises done</span>
            </div>
          </div>
        </div>

        <ExerciseSection
          title="Warm-Up (3 minutes)"
          exerciseList={exercises.warmup}
          section="warmup"
          completedExercises={completedExercises}
          onComplete={completeExercise}
        />
        
        <ExerciseSection
          title="Main Circuit (2-3 Rounds)"
          exerciseList={exercises.main}
          section="main"
          completedExercises={completedExercises}
          onComplete={completeExercise}
        />
        
        <ExerciseSection
          title="Cool-Down (2 minutes)"
          exerciseList={exercises.cooldown}
          section="cooldown"
          completedExercises={completedExercises}
          onComplete={completeExercise}
        />

        <div className="mt-8 flex space-x-4">
          <button
            onClick={() => setActiveWorkout(null)}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel Workout
          </button>
          {allCompleted ? (
            <button
              onClick={completeWorkout}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center animate-pulse"
            >
              <Trophy className="w-5 h-5 mr-2" />
              🎉 Earn 10 Minutes Screen Time! 🎉
            </button>
          ) : (
            <div className="px-6 py-3 bg-gray-300 text-gray-600 rounded-lg flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Complete all exercises to earn screen time
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkoutSession;