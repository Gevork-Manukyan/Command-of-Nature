"use client";

import { useGamePage } from '@/hooks/useGamePage';
import { useParams, useRouter } from 'next/navigation';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorScreen } from '@/components/ErrorScreen';
import { useGameSessionContext } from '@/contexts/GameSessionContext';
import { useEffect } from 'react';

export default function GamePage() {
    const params = useParams();
    const router = useRouter();
    const gameId = params.gameId as string;
    const { currentSession, isLoadingGameSession } = useGameSessionContext();
    const { error, isLoadingGame, isLeaving, hasFinishedSetup } = useGamePage();

    // Redirect to setup if game hasn't finished setup
    useEffect(() => {
        if (!isLoadingGameSession && !isLoadingGame && currentSession && !hasFinishedSetup) {
            router.push(`/game/${gameId}/setup`);
        }
    }, [isLoadingGameSession, isLoadingGame, currentSession, hasFinishedSetup, gameId, router]);

    if (isLoadingGame || isLoadingGameSession) {
        return <LoadingScreen message="Connecting to game..." />;
    }

    if (isLeaving) {
        return <LoadingScreen message="Leaving game..." />;
    }

    if (error) {
        return <ErrorScreen message={error} />;
    }

    if (!currentSession) {
        return <ErrorScreen message="Game session not found" />;
    }

    return (
        <div className="flex flex-col min-h-screen">

        </div>
    );
} 