'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useGameNavigation } from '@/hooks/useGameNavigation';
import { useGameSessionContext } from '@/contexts/GameSessionContext';
import { useUserContext } from '@/contexts/UserContext';
import { LoadingScreen } from '@/components/loading/loading-screen';
import { ErrorScreen } from '@/components/error/error-screen';
import { gameApiClient } from '@/services/game-api';
import { useSocketContext } from '@/contexts/SocketContext';

export default function GameLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const { userId } = useUserContext();
    const { isSocketConnected } = useSocketContext();
    const { currentGameSession, isLoadingGameSession } = useGameSessionContext();
    const gameId = params.gameId === currentGameSession?.id ? currentGameSession?.id : '';
    const { error: navigationError, isLeaving, goToLobby, leaveGame } = useGameNavigation(gameId);
    const shortGameId = gameId.toString().slice(-6);
    
    // Rejoin game state
    const [isRejoiningGame, setIsRejoiningGame] = useState(false);
    const [rejoinError, setRejoinError] = useState<string>('');

    // Handle game rejoining - this happens once when entering any game page
    useEffect(() => {
        if (!userId || !currentGameSession || !isSocketConnected) return;

        const rejoinGame = async () => {
            try {
                setIsRejoiningGame(true);
                setRejoinError('');
                await gameApiClient.rejoinGame({ userId, gameId });
                setIsRejoiningGame(false);
            } catch (err) {
                console.error('Failed to rejoin game:', err);
                setRejoinError(err instanceof Error ? err.message : 'Failed to rejoin game');
                setIsRejoiningGame(false);
            }
        };

        rejoinGame();
    }, [userId, currentGameSession, isSocketConnected]);

    // Handle loading states
    if (isLoadingGameSession || isRejoiningGame) {
        return <LoadingScreen message={isRejoiningGame ? "Rejoining game..." : "Loading game session..."} />;
    }

    if (isLeaving) {
        return <LoadingScreen message="Leaving game..." />;
    }

    // Handle error states
    if (navigationError || rejoinError) {
        return <ErrorScreen message={rejoinError || navigationError} />;
    }

    if (!currentGameSession) {
        return (
            <div className="flex flex-col min-h-screen">
                <ErrorScreen message="Game session not found" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <section className="h-24 flex flex-row items-center justify-around">
                <div>
                    <h1 className="text-4xl font-bold">Game: {currentGameSession?.gameName}</h1>
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