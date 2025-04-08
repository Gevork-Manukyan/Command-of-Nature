"use client";

import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useRouter } from 'next/navigation';
import { GameSession } from '@/lib/types';
import { getFromLocalStorage, setToLocalStorage } from '@/lib/client/localstorage';

export function Lobby() {
    const router = useRouter();
    const { socket, isConnected } = useSocket();
    const [numPlayers, setNumPlayers] = useState<number>(2);
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
        socket.on('create-game--success', () => {
            setError('');
            setShowModal(false);
            
            // Save the game session
            const session: GameSession = {
                gameId: `game-${Date.now()}`,
                isHost: true,
                numPlayers,
                status: 'waiting',
                createdAt: new Date()
            };
            setToLocalStorage('gameSession', session);
            setCurrentSession(session);

            // Redirect to the game page
            router.push(`/game/${session.gameId}`);
        });

        // Listen for successful game join
        socket.on('join-game--success', (gameData: { gameId: string, numPlayers: number }) => {
            setError('');
            
            // Save the game session
            const session: GameSession = {
                gameId: gameData.gameId,
                isHost: false,
                numPlayers: gameData.numPlayers,
                status: 'waiting',
                createdAt: new Date()
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
    }, [socket, numPlayers, router]);

    const handleCreateGame = async () => {
        const session: GameSession = {
            gameId: Math.random().toString(36).substring(7),
            numPlayers,
            isHost: true,
            status: 'waiting',
            createdAt: new Date()
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

            {/* Create Game Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Create New Game</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                <label htmlFor="numPlayers" className="font-medium text-gray-700">
                                    Number of Players:
                                </label>
                                <select
                                    id="numPlayers"
                                    value={numPlayers}
                                    onChange={(e) => setNumPlayers(Number(e.target.value))}
                                    className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateGame}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
                                >
                                    Create Game
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
