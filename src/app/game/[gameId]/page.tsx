"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSocket } from '@/hooks/useSocket';
import { GameSession } from '@/lib/types';
import { getFromLocalStorage, removeFromLocalStorage } from '@/lib/client/localstorage';

export default function GamePage() {
    const params = useParams();
    const router = useRouter();
    const gameId = params.gameId as string;
    const { socket, isConnected } = useSocket();
    const [session, setSession] = useState<GameSession | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        // Load the game session
        const loadedSession = getFromLocalStorage<GameSession>(`game_${gameId}`);
        if (loadedSession) {
            // Verify this is the correct game
            if (loadedSession.gameId === gameId) {
                setSession(loadedSession);
            } else {
                // Clear invalid session
                removeFromLocalStorage(`game_${gameId}`);
            }
        }
    }, [gameId]);

    // Cleanup socket connection only
    useEffect(() => {
        return () => {
            socket.disconnect();
        };
    }, [socket]);

    const handleLeaveGame = () => {
        // Notify server that player is leaving
        socket.emit('leave-game', { gameId });
        // Clear the session
        removeFromLocalStorage(`game_${gameId}`);
        // Redirect to lobby using Next.js router
        router.push('/lobby');
    };

    if (error) {
        return (
            <div className="p-6 max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-bold mb-4">Error</h1>
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={() => router.push('/lobby')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Return to Lobby
                </button>
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className="p-6 max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-bold mb-4">Connecting...</h1>
                <p className="text-yellow-500">Attempting to connect to game server...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Game Room: {gameId}</h1>
                <button
                    onClick={handleLeaveGame}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Leave Game
                </button>
            </div>
            
            <div className="mb-4">
                <p>Role: {session?.isHost ? 'Host' : 'Player'}</p>
                <p>Players needed: {session?.numPlayers}</p>
            </div>

            {/* Add your game UI components here */}
            <div className="border rounded p-4">
                <h2 className="text-xl font-bold mb-4">Game Area</h2>
                <p className="text-gray-500">Game interface will be implemented here</p>
            </div>
        </div>
    );
} 