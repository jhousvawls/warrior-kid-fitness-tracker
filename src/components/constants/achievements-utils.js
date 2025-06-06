export const checkAchievements = (userData, newTotalPullups, pullups, newStreak) => {
  const achievements = [...(userData.achievements || [])];
  
  // First workout
  if (Object.keys(userData.workouts).length === 0) {
    achievements.push({
      id: 'first-workout',
      name: 'First Steps',
      description: 'Completed your first workout!',
      emoji: '🎯',
      earned: new Date().toISOString()
    });
  }

  // First pullup
  if (pullups > 0 && userData.totalPullups === 0) {
    achievements.push({
      id: 'first-pullup',
      name: 'Pull-Up Warrior',
      description: 'Did your first pull-up!',
      emoji: '💪',
      earned: new Date().toISOString()
    });
  }

  // 3-day streak
  if (newStreak === 3 && !achievements.find(a => a.id === 'streak-3')) {
    achievements.push({
      id: 'streak-3',
      name: 'On Fire!',
      description: '3-day workout streak',
      emoji: '🔥',
      earned: new Date().toISOString()
    });
  }

  // 7-day streak
  if (newStreak === 7 && !achievements.find(a => a.id === 'streak-7')) {
    achievements.push({
      id: 'streak-7',
      name: 'Week Warrior',
      description: '7-day workout streak',
      emoji: '⚡',
      earned: new Date().toISOString()
    });
  }

  // 10 pullups
  if (newTotalPullups >= 10 && userData.totalPullups < 10) {
    achievements.push({
      id: 'pullups-10',
      name: 'Double Digits',
      description: '10 total pull-ups!',
      emoji: '🎉',
      earned: new Date().toISOString()
    });
  }

  // 50 pullups
  if (newTotalPullups >= 50 && userData.totalPullups < 50) {
    achievements.push({
      id: 'pullups-50',
      name: 'Half Century',
      description: '50 total pull-ups!',
      emoji: '🏆',
      earned: new Date().toISOString()
    });
  }

  return achievements;
};

export const allAchievements = [
  { id: 'first-workout', name: 'First Steps', description: 'Complete your first workout', emoji: '🎯' },
  { id: 'first-pullup', name: 'Pull-Up Warrior', description: 'Do your first pull-up', emoji: '💪' },
  { id: 'streak-3', name: 'On Fire!', description: '3-day workout streak', emoji: '🔥' },
  { id: 'streak-7', name: 'Week Warrior', description: '7-day workout streak', emoji: '⚡' },
  { id: 'pullups-10', name: 'Double Digits', description: '10 total pull-ups', emoji: '🎉' },
  { id: 'pullups-50', name: 'Half Century', description: '50 total pull-ups', emoji: '🏆' }
];