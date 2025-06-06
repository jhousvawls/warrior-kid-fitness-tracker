import React from 'react';
import { Target, Play, Clock } from '../common/Icons';
import ExerciseCard from './ExerciseCard';

function ExerciseSection({ title, exerciseList, section, completedExercises, onComplete }) {
  const getIcon = () => {
    switch(section) {
      case 'main':
        return <Target className="w-5 h-5 mr-2 text-orange-500" />;
      case 'warmup':
        return <Play className="w-5 h-5 mr-2 text-green-500" />;
      case 'cooldown':
        return <Clock className="w-5 h-5 mr-2 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
        {getIcon()}
        {title}
      </h3>
      <div className="space-y-3">
        {exerciseList.map((exercise, index) => (
          <ExerciseCard
            key={index}
            exercise={exercise}
            section={section}
            index={index}
            isCompleted={completedExercises[`${section}-${index}`]}
            onComplete={onComplete}
          />
        ))}
      </div>
    </div>
  );
}

export default ExerciseSection;