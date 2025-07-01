import { useEffect, useState } from "react";
import { socketService } from '@/services/socket';
import { useGameSessionContext } from '@/contexts/GameSessionContext';

export function useGamePage() {
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

    return {
        error,
        hasFinishedSetup
    };
} 