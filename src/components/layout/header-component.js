import React from 'react';
import { useApp } from '../../App';

function Header() {
  const { currentUser, setCurrentUser, activeTab, setActiveTab } = useApp();

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">💪 Summer Strength Challenge</h1>
        <p className="text-lg text-gray-600">Welcome back, {currentUser}!</p>
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-semibold ${
              activeTab === 'dashboard' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('competition')}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-semibold ${
              activeTab === 'competition' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🏆 Competition
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-semibold ${
              activeTab === 'achievements' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🏅 Achievements
          </button>
        </div>
        <button
          onClick={() => setCurrentUser(null)}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
        >
          Switch User
        </button>
      </div>
    </>
  );
}

export default Header;