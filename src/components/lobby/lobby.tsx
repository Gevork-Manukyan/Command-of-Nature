"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GameSession } from '@/lib/types';
import { getFromLocalStorage, setToLocalStorage, USER, removeFromLocalStorage } from '@/lib/client/localstorage';
import { CreateGameModal } from './create-game-modal';
import { socketService } from '@/services/socket.service';
import { apiClient } from "@/lib/client/api-client";

interface GameSettings {
  numPlayers: number;
  gameName: string;
  isPrivate: boolean;
  password?: string;
}

export function Lobby() {
    const router = useRouter();
    const [error, setError] = useState<string>('');
    const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [connectionError, setConnectionError] = useState<string>('');
    const [isCreatingGame, setIsCreatingGame] = useState(false);

    // Load existing session on mount
    useEffect(() => {
        const session = getFromLocalStorage<GameSession>('gameSession');
        if (session) {
            setCurrentSession(session);
        }
    }, []);

    function setupSocketListeners() {
        // Set up event handlers using the socket service
        socketService.onGameCreated((gameData) => {
            setError('');
            setShowModal(false);
            setIsCreatingGame(false);
            
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
    
        socketService.onGameJoined((gameData) => {
            setError('');
            setIsCreatingGame(false);
            
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
    
        socketService.onGameError((error) => {
            console.error('Game error:', error);
            setError(error.message || 'An error occurred');
            setIsCreatingGame(false);
        });

        // Listen for connection errors
        socketService.on('connection-error', (error) => {
            console.error('Connection error:', error);
            setConnectionError(error.message || 'Failed to connect to game server');
            setIsCreatingGame(false);
        });
    }

    const handleCreateGame = async (settings: GameSettings) => {
        try {
            setConnectionError(''); // Clear any previous connection errors
            setError(''); // Clear any previous game errors
            setIsCreatingGame(true);

            // Connect to the socket server
            await socketService.connect();
            
            // Set up listeners first
            setupSocketListeners();
            
            const userId = getFromLocalStorage(USER) as string;
            if (!userId) {
                throw new Error('User ID not found');
            }

            await socketService.createGame(userId, settings);
        } catch (error) {
            console.error('Failed to create game:', error);
            setError('Failed to create game. Please try again.');
            setIsCreatingGame(false);
        }
    };

    const handleLogout = async () => {
        try {
            const { error } = await apiClient.logout();
            if (error) {
                throw new Error(error);
            }
            removeFromLocalStorage(USER);
            router.push('/login');
        } catch (error) {
            // Still clear localStorage and redirect even if API call fails
            console.error('Logout error:', error);
            removeFromLocalStorage(USER);
            router.push('/login');
        }
    };

    // If they're already in a game, show a message and a button to return to their game
    if (currentSession) {
        return (
            <div className="p-6 max-w-4xl mx-auto text-center bg-white rounded-xl shadow-lg">
                <div className="absolute top-4 right-4">
                    <button
                        onClick={handleLogout}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
                    >
                        Logout
                    </button>
                </div>
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
                    <div className="flex gap-4">
                        <button
                            onClick={handleLogout}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
                        >
                            Logout
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            disabled={isCreatingGame}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isCreatingGame ? 'Creating Game...' : 'Create New Game'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}
                {connectionError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                        {connectionError}
                    </div>
                )}
            </div>

            <CreateGameModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onCreateGame={handleCreateGame}
                isCreatingGame={isCreatingGame}
            />
        </div>
    );
}