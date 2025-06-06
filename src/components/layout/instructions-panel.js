import React from 'react';
import { useApp } from '../../App';
import { ChevronUp, ChevronDown } from '../common/Icons';

function InstructionsPanel() {
  const { showInstructions, setShowInstructions } = useApp();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <button
        onClick={() => setShowInstructions(!showInstructions)}
        className="w-full flex items-center justify-between text-left"
      >
        <h2 className="text-2xl font-bold text-gray-800">📖 Instructions & Tips</h2>
        {showInstructions ? (
          <ChevronUp className="w-6 h-6 text-gray-500" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-500" />
        )}
      </button>
      
      {showInstructions && (
        <div className="mt-6 prose prose-lg max-w-none">
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Welcome to the Warrior Kid Workout App!</h3>
            <p className="text-gray-700 mb-4">
              Inspired by <em>Way of the Warrior Kid</em>, this app is your summer mission control — designed to help kids grow stronger, more confident, and conquer the pull-up bar one rep at a time.
            </p>
            <p className="text-gray-700">Complete tool to build discipline and track progress with:</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-700">
              <li>A workout tracker for all 7 days of the week</li>
              <li>Pull-up logs to measure weekly and lifetime progress</li>
              <li>Screen time rewards tied to workouts — with a reset button for parents</li>
              <li>Short video demos to teach every move</li>
              <li>A history of effort and progress</li>
              <li><strong>Weekly competitions</strong> and achievement