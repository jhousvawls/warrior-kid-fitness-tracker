import React from 'react';
import { Plus } from '../common/Icons';

function AddUserForm({ showAddUser, setShowAddUser, newUserName, setNewUserName, onAddUser, userCount }) {
  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 border-4 border-dashed border-gray-400 hover:border-blue-500 transition-all">
      {showAddUser ? (
        <div>
          <input
            type="text"
            placeholder="Enter name (3-20 characters)..."
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onAddUser(newUserName)}
            className="w-full p-4 border-4 border-blue-400 rounded-xl mb-4 text-xl font-medium"
            autoFocus
            maxLength={20}
          />
          <div className="flex space-x-3">
            <button
              onClick={() => onAddUser(newUserName)}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 font-bold text-lg"
            >
              Add
            </button>
            <button
              onClick={() => { setShowAddUser(false); setNewUserName(''); }}
              className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all transform hover:scale-105 font-bold text-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddUser(true)}
          className="w-full h-full flex flex-col items-center justify-center text-blue-600 hover:text-blue-800 transition-all min-h-[200px]"
        >
          <Plus className="w-16 h-16 mb-3" />
          <span className="text-2xl font-bold">Add New Warrior</span>
          <span className="text-lg mt-2">({userCount}/20 warriors)</span>
        </button>
      )}
    </div>
  );
}

export default AddUserForm;