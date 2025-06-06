import React from 'react';

function ExerciseCard({ exercise, section, index, isCompleted, onComplete }) {
  return (
    <div className={`p-4 rounded-lg border-2 transition-all ${
      isCompleted ? 'bg-green-100 border-green-400' : 'bg-white border-gray-300'
    }`}>
      <div className="flex items-center">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h4 className="font-bold text-gray-800 text-lg">{exercise.name}</h4>
            {exercise.video && (
              <a 
                href={exercise.video} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="ml-3 text-blue-500 hover:text-blue-700 text-lg"
              >
                📹 Watch How
              </a>
            )}
          </div>
          <p className="text-base text-gray-700 font-medium">
            {exercise.type === 'time' && `${exercise.duration} seconds`}
            {exercise.type === 'reps' && `${exercise.reps} reps`}
            {exercise.type === 'sets' && `${exercise.sets} sets`}
          </p>
          {exercise.note && (
            <p className="text-sm text-gray-600 italic mt-1">{exercise.note}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {exercise.name === 'Pull-ups' ? (
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                placeholder="0"
                className="w-20 p-2 border-2 rounded-lg text-center text-lg font-bold"
                onChange={(e) => onComplete(section, index, parseInt(e.target.value) || 0)}
              />
              <span className="text-sm text-gray-600">total</span>
            </div>
          ) : (
            <button
              onClick={() => onComplete(section, index)}
              className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all font-bold text-lg ${
                isCompleted 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : 'bg-white border-gray-400 hover:border-green-400 hover:bg-green-50'
              }`}
            >
              {isCompleted ? '✓' : '□'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExerciseCard;