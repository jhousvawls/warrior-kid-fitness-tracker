import React from 'react';
import { useApp } from '../../App';

function AllTimeChampions() {
  const { currentUser, users } = useApp();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        👑 All-Time Champions
      </h2>
      
      <div className="space-y-4">
        {Object.entries(users)
          .sort(([,a], [,b]) => (b.totalPullups || 0) - (a.totalPullups || 0))
          .map(([userName, userData], index) => (
            <div key={userName} className={`flex items-center justify-between p-4 rounded-lg ${
              userName === currentUser ? 'bg-blue-100 border-2 border-blue-400' : 'bg-gray-50'
            }`}>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white mr-4 ${
                  index === 0 ? 'bg-yellow-500' : 
                  index === 1 ? 'bg-gray-400' : 
                  index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{userName}</p>
                  <p className="text-sm text-gray-600">
                    {Object.keys(userData.workouts || {}).length} total workouts
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-yellow-600 text-lg">{userData.totalPullups || 0}</p>
                <p className="text-sm text-gray-600">lifetime pull-ups</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default AllTimeChampions;