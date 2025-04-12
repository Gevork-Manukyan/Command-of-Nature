"use client";

import { useGameSession } from '@/hooks/useGameSession';
import { useParams, useRouter } from 'next/navigation';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorScreen } from '@/components/ErrorScreen';

export default function GamePage() {
    const params = useParams();
    const router = useRouter();
    const gameId = params.gameId as string;
    const shortGameId = gameId.toString().slice(-6);
    const { currentSession, error, isRejoining, isLoading, leaveGame } = useGameSession();

    const handleToLobby = () => {
        router.push('/lobby');
    };

    if (isLoading || isRejoining) {
        return <LoadingScreen message="Connecting to game..." />;
    }

    if (error) {
        return <ErrorScreen message={error} />;
    }

    if (!currentSession) {
        return <ErrorScreen message="Game session not found" />;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold mb-4">Game: {currentSession.gameName}</h1>
            <p className="text-xl mb-4">Game ID: {shortGameId}</p>
            <div className="flex gap-4">
                <button
                    onClick={handleToLobby}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Back to Lobby
                </button>
                <button
                    onClick={leaveGame}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Leave Game
                </button>
            </div>
        </div>
    );
} 