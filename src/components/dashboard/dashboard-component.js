import React from 'react';
import { useApp } from '../../App';
import StatsGrid from './StatsGrid';
import WeekSelector from './WeekSelector';
import WorkoutSchedule from './WorkoutSchedule';
import WorkoutHistory from './WorkoutHistory';

function Dashboard() {
  const { getCurrentUserData, currentUser } = useApp();
  const userData = getCurrentUserData();

  return (
    <>
      <StatsGrid />
      <WeekSelector />
      <WorkoutSchedule />
      {Object.keys(userData.workouts).length > 0 && (
        <WorkoutHistory currentUser={currentUser} userData={userData} />
      )}
    </>
  );
}

export default Dashboard;