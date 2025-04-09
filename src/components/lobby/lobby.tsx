"use client";

import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useRouter } from 'next/navigation';
import { GameSession } from '@/lib/types';
import { getFromLocalStorage, setToLocalStorage } from '@/lib/client/localstorage';
import { CreateGameModal } from './create-game-modal';

interface GameSettings {
  numPlayers: number;
  gameName: string;
  isPrivate: boolean;
  password?: string;
}

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