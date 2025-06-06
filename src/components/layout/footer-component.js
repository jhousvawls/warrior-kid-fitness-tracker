import React from 'react';

function Footer({ onShowChangelog }) {
  return (
    <footer className="mt-16 py-8 border-t border-gray-200 bg-white rounded-xl">
      <div className="text-center">
        <p className="text-gray-600 mb-4">💪 Summer Strength Challenge</p>
        <div className="flex justify-center space-x-6 text-sm">
          <button
            onClick={onShowChangelog}
            className="text-blue-500 hover:text-blue-700 underline"
          >
            📋 Version History
          </button>
          <span className="text-gray-400">v4.0.0</span>
          <span className="text-gray-400">Inspired by Way of the Warrior Kid</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;