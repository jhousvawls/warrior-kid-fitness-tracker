import React from 'react';

function AchievementCard({ achievement, earned }) {
  if (earned && achievement.earned) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border-2 border-yellow-200">
        <div className="text-center">
          <div className="text-4xl mb-2">{achievement.emoji}</div>
          <h3 className="font-bold text-gray-800 mb-1">{achievement.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
          <p className="text-xs text-gray-500">
            Earned: {new Date(achievement.earned).toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg border-2 ${
      earned 
        ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="text-center">
        <div className={`text-4xl mb-2 ${earned ? '' : 'grayscale opacity-50'}`}>
          {achievement.emoji}
        </div>
        <h3 className={`font-bold mb-1 ${earned ? 'text-green-800' : 'text-gray-600'}`}>
          {achievement.name}
        </h3>
        <p className={`text-sm mb-2 ${earned ? 'text-green-600' : 'text-gray-500'}`}>
          {achievement.description}
        </p>
        {earned && (
          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            ✓ EARNED
          </div>
        )}
      </div>
    </div>
  );
}

export default AchievementCard;