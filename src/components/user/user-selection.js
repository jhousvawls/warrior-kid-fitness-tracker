import React, { useState } from 'react';
import { useApp } from '../../App';
import { Users, Plus } from '../common/Icons';
import UserCard from './UserCard';
import AddUserForm from './AddUserForm';
import MathChallengeModal from './MathChallengeModal';

function UserSelection() {
  const { users, setUsers, setCurrentUser } = useApp();
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [showMathChallenge, setShowMathChallenge] = useState(false);
  const [mathChallenge, setMathChallenge] = useState({ num1: 0, num2: 0, answer: '' });
  const [lastUserAddTime, setLastUserAddTime] = useState(0);

  const validateUserName = (name) => {
    const trimmed = name.trim();
    if (trimmed.length < 3 || trimmed.length > 20) {
      return { valid: false, error: "Name must be 3-20 characters long" };
    }
    if (!/^[a-zA-Z0-9\s]+$/.test(trimmed)) {
      return { valid: false, error: "Name can only contain letters, numbers, and spaces" };
    }
    const lowerName = trimmed.toLowerCase().replace(/\s/g, '');
    const repeatingChars = /(.)\1{3,}/.test(lowerName);
    const onlyNumbers = /^\d+$/.test(lowerName);
    if (repeatingChars || onlyNumbers) {
      return { valid: false, error: "Please enter a real name" };
    }
    if (users[trimmed]) {
      return { valid: false, error: "This name is already taken" };
    }
    return { valid: true };
  };

  const generateMathChallenge = () => {
    const num1 = Math.floor(Math.random() * 8) + 1;
    const num2 = Math.floor(Math.random() * 8) + 1;
    setMathChallenge({ num1, num2, answer: '' });
  };

  const checkRateLimit = () => {
    const now = Date.now();
    if (now - lastUserAddTime < 10000) {
      return { allowed: false, error: "Please wait a moment before adding another user" };
    }
    return { allowed: true };
  };

  const checkUserLimit = () => {
    if (Object.keys(users).length >= 20) {
      return { allowed: false, error: "Maximum of 20 users allowed. Please remove some users first." };
    }
    return { allowed: true };
  };

  const addUser = (name) => {
    const nameValidation = validateUserName(name);
    if (!nameValidation.valid) {
      alert(nameValidation.error);
      return;
    }
    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
      alert(rateLimitCheck.error);
      return;
    }
    const userLimitCheck = checkUserLimit();
    if (!userLimitCheck.allowed) {
      alert(userLimitCheck.error);
      return;
    }
    generateMathChallenge();
    setShowMathChallenge(true);
  };

  const completeMathChallenge = () => {
    const correctAnswer = mathChallenge.num1 + mathChallenge.num2;
    if (parseInt(mathChallenge.answer) !== correctAnswer) {
      alert("Oops! Try that math problem again.");
      generateMathChallenge();
      return;
    }
    const trimmed = newUserName.trim();
    const newUser = {
      name: trimmed,
      workouts: {},
      screenTimeEarned: 0,
      totalPullups: 0,
      currentStreak: 0,
      longestStreak: 0,
      achievements: [],
      created: new Date().toISOString()
    };
    setUsers(prev => ({ ...prev, [trimmed]: newUser }));
    setNewUserName('');
    setShowAddUser(false);
    setShowMathChallenge(false);
    setMathChallenge({ num1: 0, num2: 0, answer: '' });
    setLastUserAddTime(Date.now());
  };

  const deleteUser = (userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}? This will remove all their progress.`)) {
      setUsers(prev => {
        const newUsers = { ...prev };
        delete newUsers[userName];
        return newUsers;
      });
    }
  };

  const clearAllUsers = () => {
    if (window.confirm("⚠️ PARENT CONTROL: This will delete ALL users and their progress. Are you sure?")) {
      if (window.confirm("This cannot be undone. Really delete everyone's workout data?")) {
        setUsers({});
        setCurrentUser(null);
        localStorage.removeItem('workoutUsers');
        alert("All users have been removed.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">💪 Summer Strength Challenge</h1>
        <p className="text-lg text-gray-600">Choose your profile to start working out!</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Users className="w-6 h-6 mr-2 text-blue-500" />
          Select Your Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {Object.entries(users).map(([userName, userData]) => (
            <UserCard
              key={userName}
              userName={userName}
              userData={userData}
              onSelect={() => setCurrentUser(userName)}
              onDelete={() => deleteUser(userName)}
            />
          ))}

          <AddUserForm
            showAddUser={showAddUser}
            setShowAddUser={setShowAddUser}
            newUserName={newUserName}
            setNewUserName={setNewUserName}
            onAddUser={addUser}
            userCount={Object.keys(users).length}
          />
        </div>

        {Object.keys(users).length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No users yet! Add the first one to get started.</p>
          </div>
        )}

        {Object.keys(users).length > 0 && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-bold text-red-800 mb-2">👨‍👩‍👧‍👦 Parent Controls</h3>
            <p className="text-sm text-red-700 mb-3">Emergency reset if needed (this will delete all progress):</p>
            <button
              onClick={clearAllUsers}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              🗑️ Clear All Users
            </button>
          </div>
        )}
      </div>

      {showMathChallenge && (
        <MathChallengeModal
          mathChallenge={mathChallenge}
          setMathChallenge={setMathChallenge}
          onComplete={completeMathChallenge}
          onCancel={() => {
            setShowMathChallenge(false);
            setShowAddUser(false);
            setNewUserName('');
          }}
        />
      )}
    </div>
  );
}

export default UserSelection;