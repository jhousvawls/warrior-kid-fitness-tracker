import React from 'react';
import { useApp } from '../../App';
import { TrendingUp } from '../common/Icons';

function WeekSelector() {
  const { currentWeek, setCurrentWeek } = useApp();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-center space-x-4">
        <TrendingUp className="w-6 h-6 text-orange-500" />
        <h3 className="font-bold text-gray-800">Week</h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            ←
          </button>
          <p className="text-2xl font-bold text-orange-600 px-4">{currentWeek}</p>
          <button 
            onClick={() => setCurrentWeek(currentWeek + 1)}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

export default WeekSelector;