"use client";

import { useParams, useRouter } from 'next/navigation';
import { ErrorScreen } from '@/components/error/error-screen';
import { useGameSessionContext } from '@/contexts/GameSessionContext';
import { useEffect, useState } from 'react';
import { socketService } from '@/services/socket';

export default function GamePage() {
    const params = useParams();
    const router = useRouter();
    const gameId = params.gameId as string;
    const { currentGameSession } = useGameSessionContext();
    const [error, setError] = useState<string>('');
    const [hasFinishedSetup, setHasFinishedSetup] = useState(false);
    
    // TODO: This is a temporary solution to check if the game has finished setup.
    // Setup socket event listeners
    useEffect(() => {
        if (!currentGameSession) return;

        const handleSetupComplete = () => {
            setHasFinishedSetup(true);
        };

        // Register event listeners
        socketService.on('setup-complete', handleSetupComplete);

        return () => {
            socketService.off('setup-complete', handleSetupComplete);
        };
    }, [currentGameSession]);

    // Redirect to setup if game hasn't finished setup
    useEffect(() => {
        if (currentGameSession && !hasFinishedSetup) {
            router.push(`/game/${gameId}/setup`);
        }
    }, [currentGameSession, hasFinishedSetup, gameId, router]);

    if (error) {
        return <ErrorScreen message={error} />;
    }

    return (
        <div className="flex flex-col min-h-screen">

        </div>
    );
} 