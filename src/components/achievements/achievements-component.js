import React from 'react';
import { useApp } from '../../App';
import AchievementGrid from './AchievementGrid';
import { allAchievements } from '../../utils/achievements';

function Achievements() {
  const { getCurrentUserData, currentUser } = useApp();
  const userData = getCurrentUserData();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          🏅 {currentUser}'s Achievements
        </h2>
        
        {userData.achievements && userData.achievements.length > 0 ? (
          <AchievementGrid achievements={userData.achievements} earned={true} />
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-500 text-lg">No achievements yet!</p>
            <p className="text-gray-400">Complete workouts to start earning badges.</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          🎯 Available Achievements
        </h2>
        
        <AchievementGrid 
          achievements={allAchievements} 
          earned={false}
          userAchievements={userData.achievements || []}
        />
      </div>
    </div>
  );
}

export default Achievements;