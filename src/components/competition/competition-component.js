import React from 'react';
import NeighborhoodChallenge from './NeighborhoodChallenge';
import WeeklyLeaderboard from './WeeklyLeaderboard';
import AllTimeChampions from './AllTimeChampions';

function Competition() {
  return (
    <>
      <NeighborhoodChallenge />
      <WeeklyLeaderboard />
      <AllTimeChampions />
    </>
  );
}

export default Competition;