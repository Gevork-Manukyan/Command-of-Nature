"use client";

import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useRouter } from 'next/navigation';
import { GameSession } from '@/types/game';
import { getFromLocalStorage, setToLocalStorage } from '@/lib/client/localstorage';

export function Lobby() {
    const router = useRouter();
    const { socket, isConnected } = useSocket();
    const [numPlayers, setNumPlayers] = useState<number>(2);
    const [error, setError] = useState<string>('');
    const [currentSession, setCurrentSession] = useState<GameSession | null>(null);

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
            console.log('Game created successfully!');
            
            // Save the game session
            const session: GameSession = {
                gameId: `game-${Date.now()}`,
                isHost: true,
                numPlayers
            };
            setToLocalStorage('gameSession', session);
            setCurrentSession(session);

            // Redirect to the game page
            router.push(`/game/${session.gameId}`);
        });

        // Listen for successful game join
        socket.on('join-game--success', (gameData: { gameId: string, numPlayers: number }) => {
            setError('');
            console.log('Joined game successfully!');
            
            // Save the game session
            const session: GameSession = {
                gameId: gameData.gameId,
                isHost: false,
                numPlayers: gameData.numPlayers
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
            numPlayers: 2,
            isHost: true,
        };
        setToLocalStorage('gameSession', session);
        setCurrentSession(session);
    };

    // If they're already in a game, show a message and a button to return to their game
    if (currentSession) {
        return (
            <div className="p-6 max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-bold mb-4">You&apos;re Already in a Game</h1>
                <p className="mb-4">You are currently in game: {currentSession.gameId}</p>
                <button
                    onClick={() => router.push(`/game/${currentSession.gameId}`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Return to Game
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Game Lobby</h1>
                <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-2">
                        <label htmlFor="numPlayers" className="font-medium">
                            Number of Players:
                        </label>
                        <select
                            id="numPlayers"
                            value={numPlayers}
                            onChange={(e) => setNumPlayers(Number(e.target.value))}
                            className="border rounded px-2 py-1"
                        >
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                        </select>
                    </div>
                    <button
                        onClick={handleCreateGame}
                        disabled={!isConnected}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        Create New Game
                    </button>
                </div>
                {error && (
                    <p className="text-red-500 mt-2">{error}</p>
                )}
                {!isConnected && (
                    <p className="text-yellow-500 mt-2">
                        Not connected to server. Please wait... (Check console for connection details)
                    </p>
                )}
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Available Games</h2>
                <p className="text-gray-500">Loading available games...</p>
            </div>
        </div>
    );
}
