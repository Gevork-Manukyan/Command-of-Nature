'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGameNavigation } from '@/hooks/useGameNavigation';
import { useGameSessionContext } from '@/contexts/GameSessionContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorScreen } from '@/components/ErrorScreen';

export default function GameLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { currentSession, isLoadingGameSession } = useGameSessionContext();
    const { error: navigationError, isLeaving, goToLobby, leaveGame } = useGameNavigation();
    const params = useParams();
    const gameId = params.gameId as string;
    const shortGameId = gameId.toString().slice(-6);

    // Handle loading states
    if (isLoadingGameSession) {
        return <LoadingScreen message="Loading game session..." />;
    }

    if (isLeaving) {
        return <LoadingScreen message="Leaving game..." />;
    }

    // Handle error states
    if (navigationError) {
        return <ErrorScreen message={navigationError} />;
    }

    if (!currentSession) {
        return <ErrorScreen message="Game session not found" />;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <section className="h-24 flex flex-row items-center justify-around">
                <div>
                    <h1 className="text-4xl font-bold">Game: {currentSession?.gameName}</h1>
                    <p className="text-xl">Game ID: {shortGameId}</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={goToLobby}
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
            </section>
            {children}
        </div>
    );
} 