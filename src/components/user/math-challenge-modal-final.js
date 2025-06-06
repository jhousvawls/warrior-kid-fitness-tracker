import React from 'react';

function MathChallengeModal({ mathChallenge, setMathChallenge, onComplete, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">🤔 Quick Math Check!</h3>
          <p className="text-gray-600 mb-6">Just to make sure you're a real person:</p>
          
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <p className="text-3xl font-bold text-blue-600 mb-4">
              {mathChallenge.num1} + {mathChallenge.num2} = ?
            </p>
            <input
              type="number"
              value={mathChallenge.answer}
              onChange={(e) => setMathChallenge(prev => ({...prev, answer: e.target.value}))}
              onKeyPress={(e) => e.key === 'Enter' && onComplete()}
              className="w-24 p-3 border-2 rounded-lg text-center text-xl font-bold"
              placeholder="?"
              autoFocus
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onComplete}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              ✓ Check Answer
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MathChallengeModal;