import React from 'react';
import { Trophy } from '../common/Icons';

function WorkoutHistory({ currentUser, userData }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
        {currentUser}'s Workout History
      </h2>
      
      <div className="space-y-3">
        {Object.entries(userData.workouts)
          .sort(([a], [b]) => new Date(b) - new Date(a))
          .slice(0, 10)
          .map(([date, workout]) => (
            <div key={date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-800">{workout.day} - Week {workout.week}</p>
                <p className="text-sm text-gray-600">Focus: {workout.focus}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">{workout.pullups} pull-ups</p>
                <p className="text-sm text-purple-600">+10 min screen time</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default WorkoutHistory;