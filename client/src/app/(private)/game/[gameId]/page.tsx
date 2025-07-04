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
    const { currentSession } = useGameSessionContext();
    const [error, setError] = useState<string>('');
    const [hasFinishedSetup, setHasFinishedSetup] = useState(false);
    
    // TODO: This is a temporary solution to check if the game has finished setup.
    // Setup socket event listeners
    useEffect(() => {
        if (!currentSession) return;

        const handleSetupComplete = () => {
            setHasFinishedSetup(true);
        };

        // Register event listeners
        socketService.on('setup-complete', handleSetupComplete);

        return () => {
            socketService.off('setup-complete', handleSetupComplete);
        };
    }, [currentSession]);

    // Redirect to setup if game hasn't finished setup
    useEffect(() => {
        if (currentSession && !hasFinishedSetup) {
            router.push(`/game/${gameId}/setup`);
        }
    }, [currentSession, hasFinishedSetup, gameId, router]);

    if (error) {
        return <ErrorScreen message={error} />;
    }

    return (
        <div className="flex flex-col min-h-screen">

        </div>
    );
} 