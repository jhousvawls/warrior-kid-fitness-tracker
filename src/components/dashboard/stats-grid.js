import React from 'react';
import { useApp } from '../../App';
import StatCard from './StatCard';
import { Calendar, Target, Trophy, Clock } from '../common/Icons';

function StatsGrid() {
  const { getCurrentUserData, updateUserData, currentWeek } = useApp();
  const userData = getCurrentUserData();

  const getWeeklyProgress = () => {
    const thisWeekWorkouts = Object.values(userData.workouts).filter(w => w.week === currentWeek);
    return thisWeekWorkouts.length;
  };

  const getWeeklyPullups = () => {
    const thisWeekWorkouts = Object.values(userData.workouts).filter(w => w.week === currentWeek);
    return thisWeekWorkouts.reduce((total, workout) => total + (workout.pullups || 0), 0);
  };

  const resetScreenTime = () => {
    updateUserData({ screenTimeEarned: 0 });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      <StatCard
        Icon={Calendar}
        iconColor="text-blue-500"
        title="This Week"
        value={`${getWeeklyProgress()}/7`}
        subtitle="workouts"
        valueColor="text-blue-600"
      />
      
      <StatCard
        Icon={Target}
        iconColor="text-green-500"
        title="This Week"
        value={getWeeklyPullups()}
        subtitle="pull-ups"
        valueColor="text-green-600"
      />
      
      <StatCard
        Icon={Trophy}
        iconColor="text-yellow-500"
        title="Total Ever"
        value={userData.totalPullups || 0}
        subtitle="pull-ups"
        valueColor="text-yellow-600"
      />
      
      <StatCard
        Icon={Clock}
        iconColor="text-purple-500"
        title="Screen Time"
        value={userData.screenTimeEarned || 0}
        subtitle="minutes earned"
        valueColor="text-purple-600"
        action={
          <button
            onClick={resetScreenTime}
            className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors"
          >
            Reset
          </button>
        }
      />
      
      <div className="bg-white rounded-xl p-6 shadow-lg text-center">
        <div className="text-2xl mb-2">🔥</div>
        <h3 className="font-bold text-gray-800">Streak</h3>
        <p className="text-2xl font-bold text-orange-600">{userData.currentStreak || 0}</p>
        <p className="text-sm text-gray-600">days</p>
        <p className="text-xs text-gray-500 mt-1">Best: {userData.longestStreak || 0}</p>
      </div>
    </div>
  );
}

export default StatsGrid;