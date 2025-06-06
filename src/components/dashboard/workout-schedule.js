import React from 'react';
import { useApp } from '../../App';
import { Calendar, CheckCircle } from '../common/Icons';
import { weeklySchedule } from '../../constants/exercises';
import { getDayKey, getTodayName } from '../../utils/dateHelpers';

function WorkoutSchedule() {
  const { currentWeek, setActiveWorkout, getCurrentUserData } = useApp();
  const userData = getCurrentUserData();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Calendar className="w-6 h-6 mr-2 text-blue-500" />
        Weekly Schedule - Week {currentWeek}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {Object.entries(weeklySchedule).map(([day, info]) => {
          const dayKey = getDayKey();
          const isToday = getTodayName() === day;
          const isCompleted = userData.workouts[dayKey]?.day === day;
          
          return (
            <div key={day} className={`p-4 rounded-lg border-2 transition-all ${
              isToday ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
            }`}>
              <div className="text-center">
                <h3 className="font-bold text-gray-800">{day}</h3>
                <div className={`w-4 h-4 rounded-full mx-auto my-2 ${info.color}`}></div>
                <p className="text-sm text-gray-600 mb-3">Focus: {info.focus}</p>
                
                {isCompleted ? (
                  <div className="flex items-center justify-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-1" />
                    <span className="text-sm font-semibold">Complete!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveWorkout(day)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                  >
                    Start Workout
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WorkoutSchedule;