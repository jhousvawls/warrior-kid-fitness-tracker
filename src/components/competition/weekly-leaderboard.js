import React from 'react';
import { useApp } from '../../App';

function WeeklyLeaderboard() {
  const { currentWeek, currentUser, users } = useApp();

  const getWeeklyLeaderboard = () => {
    return Object.entries(users)
      .map(([userName, userData]) => ({
        name: userName,
        weeklyPullups: Object.values(userData.workouts || {})
          .filter(w => w.week === currentWeek)
          .reduce((total, workout) => total + (workout.pullups || 0), 0),
        weeklyWorkouts: Object.values(userData.workouts || {})
          .filter(w => w.week === currentWeek).length,
        currentStreak: userData.currentStreak || 0
      }))
      .sort((a, b) => b.weeklyPullups - a.weeklyPullups);
  };

  const leaderboard = getWeeklyLeaderboard();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        🏆 Weekly Leaderboard - Week {currentWeek}
      </h2>
      
      <div className="space-y-4">
        {leaderboard.map((user, index) => (
          <div key={user.name} className={`flex items-center justify-between p-4 rounded-lg ${
            user.name === currentUser ? 'bg-blue-100 border-2 border-blue-400' : 'bg-gray-50'
          }`}>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mr-4 ${
                index === 0 ? 'bg-yellow-500' : 
                index === 1 ? 'bg-gray-400' : 
                index === 2 ? 'bg-orange-600' : 'bg-blue-500'
              }`}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
              </div>
              <div>
                <p className="font-bold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-600">
                  {user.weeklyWorkouts} workouts • {user.currentStreak} day streak
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600 text-xl">{user.weeklyPullups}</p>
              <p className="text-sm text-gray-600">this week</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyLeaderboard;