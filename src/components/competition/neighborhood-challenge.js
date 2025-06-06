import React, { useState } from 'react';
import { useApp } from '../../App';

function NeighborhoodChallenge() {
  const { currentWeek, challengeGoal, setChallengeGoal, users } = useApp();
  const [showSetChallenge, setShowSetChallenge] = useState(false);

  const getProgressToChallenge = () => {
    const weeklyStats = Object.entries(users)
      .map(([userName, userData]) => ({
        weeklyPullups: Object.values(userData.workouts || {})
          .filter(w => w.week === currentWeek)
          .reduce((total, workout) => total + (workout.pullups || 0), 0)
      }));
    const totalWeeklyPullups = weeklyStats.reduce((sum, user) => sum + user.weeklyPullups, 0);
    return {
      current: totalWeeklyPullups,
      goal: challengeGoal,
      percentage: Math.min(100, Math.round((totalWeeklyPullups / challengeGoal) * 100))
    };
  };

  const progress = getProgressToChallenge();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          🎯 Neighborhood Challenge - Week {currentWeek}
        </h2>
        <button
          onClick={() => setShowSetChallenge(!showSetChallenge)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          Set Goal
        </button>
      </div>

      {showSetChallenge && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weekly Pull-up Challenge Goal:
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              min="1"
              value={challengeGoal}
              onChange={(e) => setChallengeGoal(parseInt(e.target.value) || 50)}
              className="w-20 p-2 border-2 rounded-lg text-center"
            />
            <span className="text-gray-600">pull-ups for the whole neighborhood</span>
            <button
              onClick={() => setShowSetChallenge(false)}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="text-center">
        <div className="mb-4">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {progress.current} / {challengeGoal}
          </div>
          <p className="text-gray-600">Total neighborhood pull-ups this week</p>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>
        
        <p className="text-lg font-semibold text-gray-800">
          {progress.percentage}% Complete! 
          {progress.current >= challengeGoal ? " 🎉 GOAL ACHIEVED!" : ""}
        </p>
      </div>
    </div>
  );
}

export default NeighborhoodChallenge;