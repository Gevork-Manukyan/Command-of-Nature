"use client";

import { useState } from 'react';

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGame: (settings: GameSettings) => void;
  isCreatingGame: boolean;
}

interface GameSettings {
  numPlayers: number;
  gameName: string;
  isPrivate: boolean;
  password?: string;
}

export const CreateGameModal = ({ isOpen, onClose, onCreateGame, isCreatingGame }: CreateGameModalProps) => {
  const [numPlayers, setNumPlayers] = useState<number>(2);
  const [gameName, setGameName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onCreateGame({
      numPlayers,
      gameName,
      isPrivate,
      password: isPrivate ? password : undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create New Game</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isCreatingGame}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Game Name Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="gameName" className="font-medium text-gray-700">
              Game Name:
            </label>
            <input
              id="gameName"
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Enter game name"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isCreatingGame}
            />
          </div>

          {/* Number of Players Selection */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">
              Number of Players:
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setNumPlayers(2)}
                className={`w-24 h-24 rounded-xl border-2 flex items-center justify-center font-bold text-xl transition-colors duration-200 ${
                  numPlayers === 2
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                    : 'border-gray-300 text-gray-600 hover:border-indigo-400'
                }`}
                disabled={isCreatingGame}
              >
                2
              </button>
              <button
                onClick={() => setNumPlayers(4)}
                className={`w-24 h-24 rounded-xl border-2 flex items-center justify-center font-bold text-xl transition-colors duration-200 ${
                  numPlayers === 4
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                    : 'border-gray-300 text-gray-600 hover:border-indigo-400'
                }`}
                disabled={isCreatingGame}
              >
                4
              </button>
            </div>
          </div>

          {/* Private Game Toggle */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">
              Game Privacy:
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPrivate(false)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  !isPrivate
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                disabled={isCreatingGame}
              >
                Public
              </button>
              <button
                onClick={() => setIsPrivate(true)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isPrivate
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                disabled={isCreatingGame}
              >
                Private
              </button>
            </div>
          </div>

          {/* Password Input (only shown for private games) */}
          {isPrivate && (
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="font-medium text-gray-700">
                Password:
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isCreatingGame}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isCreatingGame}
          >
            {isCreatingGame ? 'Creating Game...' : 'Create Game'}
          </button>
        </div>
      </div>
    </div>
  );
}; 