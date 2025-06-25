"use client";

import { useGamePage } from './useGamePage';
import { useParams, useRouter } from 'next/navigation';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorScreen } from '@/components/ErrorScreen';
import { useGameSessionContext } from '@/contexts/GameSessionContext';
import { useEffect } from 'react';

export default function GamePage() {
    const params = useParams();
    const router = useRouter();
    const gameId = params.gameId as string;
    const { currentSession } = useGameSessionContext();
    const { error, isLoadingGame, hasFinishedSetup } = useGamePage();

    // Redirect to setup if game hasn't finished setup
    useEffect(() => {
        if (!isLoadingGame && currentSession && !hasFinishedSetup) {
            router.push(`/game/${gameId}/setup`);
        }
    }, [isLoadingGame, currentSession, hasFinishedSetup, gameId, router]);

    if (isLoadingGame) {
        return <LoadingScreen message="Connecting to game..." />;
    }

    if (error) {
        return <ErrorScreen message={error} />;
    }

    return (
        <div className="flex flex-col min-h-screen">

        </div>
    );
} 