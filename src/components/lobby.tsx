"use client";

import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useRouter } from 'next/navigation';
import { GameSession } from '@/lib/types';
import { getFromLocalStorage, setToLocalStorage } from '@/lib/client/localstorage';

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGame: (settings: GameSettings) => void;
}

interface GameSettings {
  numPlayers: number;
  gameName: string;
  isPrivate: boolean;
  password?: string;
}

const CreateGameModal = ({ isOpen, onClose, onCreateGame }: CreateGameModalProps) => {
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
              <input
                type="checkbox"
                id="isPrivate"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isPrivate" className="text-gray-600">
                Make this game private
              </label>
            </div>
          </div>

          {/* Password Input (only shown if private) */}
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
                placeholder="Enter game password"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!gameName || (isPrivate && !password)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Create Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function Lobby() {
    const router = useRouter();
    const { socket, isConnected } = useSocket();
    const [error, setError] = useState<string>('');
    const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Load existing session on mount
    useEffect(() => {
        const session = getFromLocalStorage<GameSession>('gameSession');
        if (session) {
            setCurrentSession(session);
        }
    }, []);

    useEffect(() => {
        // Listen for successful game creation
        socket.on('create-game--success', (gameData: { gameId: string, numPlayers: number, gameName: string, isPrivate: boolean }) => {
            setError('');
            setShowModal(false);
            
            // Save the game session
            const session: GameSession = {
                gameId: gameData.gameId,
                gameName: gameData.gameName,
                numPlayers: gameData.numPlayers,
                isHost: true,
                status: 'waiting',
                createdAt: new Date(),
                isPrivate: gameData.isPrivate
            };
            setToLocalStorage('gameSession', session);
            setCurrentSession(session);

            // Redirect to the game page
            router.push(`/game/${session.gameId}`);
        });

        // Listen for successful game join
        socket.on('join-game--success', (gameData: { gameId: string, numPlayers: number, gameName: string, isPrivate: boolean }) => {
            setError('');
            
            // Save the game session
            const session: GameSession = {
                gameId: gameData.gameId,
                gameName: gameData.gameName,
                numPlayers: gameData.numPlayers,
                isHost: false,
                status: 'waiting',
                createdAt: new Date(),
                isPrivate: gameData.isPrivate
            };
            setToLocalStorage('gameSession', session);
            setCurrentSession(session);

            // Redirect to the game page
            router.push(`/game/${gameData.gameId}`);
        });

        // Listen for game creation errors
        socket.on('create-game--error', (error) => {
            console.error('Game creation error:', error);
            setError(error.message || 'Failed to create game');
        });

        // Listen for game join errors
        socket.on('join-game--error', (error) => {
            console.error('Game join error:', error);
            setError(error.message || 'Failed to join game');
        });

        return () => {
            socket.off('create-game--success');
            socket.off('create-game--error');
            socket.off('join-game--success');
            socket.off('join-game--error');
        };
    }, [socket, router]);

    const handleCreateGame = async (settings: GameSettings) => {
        const session: GameSession = {
            gameId: Math.random().toString(36).substring(7),
            gameName: settings.gameName,
            numPlayers: settings.numPlayers,
            isHost: true,
            status: 'waiting',
            createdAt: new Date(),
            isPrivate: settings.isPrivate,
            password: settings.password
        };
        setToLocalStorage('gameSession', session);
        setCurrentSession(session);
    };

    // If they're already in a game, show a message and a button to return to their game
    if (currentSession) {
        return (
            <div className="p-6 max-w-4xl mx-auto text-center bg-white rounded-xl shadow-lg">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">You&apos;re Already in a Game</h1>
                <p className="mb-6 text-gray-600">You are currently in game: <span className="font-mono bg-gray-100 px-3 py-1 rounded">{currentSession.gameId}</span></p>
                <button
                    onClick={() => router.push(`/game/${currentSession.gameId}`)}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-md"
                >
                    Return to Game
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Available Games</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        disabled={!isConnected}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Create New Game
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}
                {!isConnected && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded-lg mb-4">
                        Not connected to server. Please wait...
                    </div>
                )}
            </div>

            <CreateGameModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onCreateGame={handleCreateGame}
            />
        </div>
    );
}
