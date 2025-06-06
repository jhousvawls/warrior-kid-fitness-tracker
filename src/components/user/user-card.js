import React from 'react';

function UserCard({ userName, userData, onSelect, onDelete }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 hover:bg-blue-50 transition-colors border-2 border-gray-200 hover:border-blue-400">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg text-gray-800">{userName}</h3>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          ✕
        </button>
      </div>
      <div className="space-y-1 text-sm text-gray-600 mb-4">
        <p>Workouts: {Object.keys(userData.workouts || {}).length}</p>
        <p>Total Pull-ups: {userData.totalPullups || 0}</p>
        <p>Screen Time: {userData.screenTimeEarned || 0} min</p>
      </div>
      <button
        onClick={onSelect}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
      >
        Start Workout
      </button>
    </div>
  );
}

export default UserCard;