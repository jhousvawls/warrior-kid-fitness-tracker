import React from 'react';

function ChangelogModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">📋 Version History</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-8">
          <div className="border-l-4 border-purple-500 pl-6">
            <div className="flex items-center mb-3">
              <h3 className="text-xl font-bold text-purple-600">v4.0.0 - Competition Update</h3>
              <span className="ml-3 px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">LATEST</span>
            </div>
            <p className="text-gray-600 mb-3">The ultimate neighborhood fitness competition platform!</p>
            <div className="space-y-2 text-sm">
              <h4 className="font-semibold text-gray-800">🔥 Major Features Added:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li><strong>Weekly Competitions</strong> - Fresh leaderboards every week</li>
                <li><strong>Achievement Badge System</strong> - 6 different badges to earn</li>
                <li><strong>Neighborhood Challenge Goals</strong> - Community-wide pull-up targets</li>
                <li><strong>Progress Streaks</strong> - Track consecutive workout days</li>
                <li><strong>Tabbed Interface</strong> - Dashboard, Competition, and Achievements</li>
                <li><strong>Dual Leaderboards</strong> - Weekly and all-time rankings</li>
                <li><strong>Enhanced Instructions</strong> - Updated with competition features</li>
                <li><strong>Fraud Prevention</strong> - Name validation, rate limiting, math challenges</li>
              </ul>
            </div>
          </div>

          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="text-xl font-bold text-blue-600 mb-3">v3.0.0 - Multi-User System</h3>
            <p className="text-gray-600 mb-3">Expanded from single user to neighborhood-wide tracking!</p>
            <div className="space-y-2 text-sm">
              <h4 className="font-semibold text-gray-800">👥 Multi-User Features:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li><strong>User Profile System</strong> - Add unlimited kids</li>
                <li><strong>Individual Progress Tracking</strong> - Separate stats for each user</li>
                <li><strong>User Switching</strong> - Easy profile selection</li>
                <li><strong>Basic Leaderboard</strong> - All-time pull-up rankings</li>
                <li><strong>Data Persistence</strong> - Local storage for all users</li>
              </ul>
            </div>
          </div>

          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-xl font-bold text-green-600 mb-3">v2.0.0 - Enhanced Features</h3>
            <p className="text-gray-600 mb-3">Added comprehensive instructions and improved user experience.</p>
            <div className="space-y-2 text-sm">
              <h4 className="font-semibold text-gray-800">📖 Documentation & UX:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li><strong>Comprehensive Instructions</strong> - Warrior Kid inspired welcome</li>
                <li><strong>Collapsible Help Section</strong> - Tips and motivation</li>
                <li><strong>Getting Started Guide</strong> - Parent and kid guidance</li>
                <li><strong>Summer Goals Section</strong> - Motivation ideas</li>
              </ul>
            </div>
          </div>

          <div className="border-l-4 border-yellow-500 pl-6">
            <h3 className="text-xl font-bold text-yellow-600 mb-3">v1.0.0 - Core Foundation</h3>
            <p className="text-gray-600 mb-3">The original single-user workout tracking system.</p>
            <div className="space-y-2 text-sm">
              <h4 className="font-semibold text-gray-800">💪 Core Features:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li><strong>7-Day Workout Schedule</strong> - Monday through Sunday</li>
                <li><strong>Exercise Tracking</strong> - Warm-up, main circuit, cool-down</li>
                <li><strong>Pull-up Counter</strong> - Special input for pull-up tracking</li>
                <li><strong>Screen Time Rewards</strong> - 10 minutes per workout</li>
                <li><strong>Video Exercise Demos</strong> - YouTube links for proper form</li>
                <li><strong>Weekly Focus Areas</strong> - Different emphasis each day</li>
                <li><strong>Progress Dashboard</strong> - Stats and workout history</li>
                <li><strong>Responsive Design</strong> - Works on all devices</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangelogModal;