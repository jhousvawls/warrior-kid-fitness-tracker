import React from 'react';
import AchievementCard from './AchievementCard';

function AchievementGrid({ achievements, earned, userAchievements = [] }) {
  if (earned) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            earned={true}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((achievement) => {
        const isEarned = userAchievements.find(a => a.id === achievement.id);
        return (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            earned={!!isEarned}
          />
        );
      })}
    </div>
  );
}

export default AchievementGrid;