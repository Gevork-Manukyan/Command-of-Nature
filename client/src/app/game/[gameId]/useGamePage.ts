import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { socketService } from '@/services/socket.service';
import { useUserContext } from '@/contexts/UserContext';
import { useGameSessionContext } from '@/contexts/GameSessionContext';

export function useGamePage() {
    const router = useRouter();
    const { userId } = useUserContext();
    const { currentSession } = useGameSessionContext();
    const [error, setError] = useState<string>('');
    const [isLoadingGame, setIsLoadingGame] = useState(false);
    const [hasFinishedSetup, setHasFinishedSetup] = useState(false);

    // Handle socket connection and game rejoining
    useEffect(() => {
        if (!userId || !currentSession) return;

        const connectAndRejoin = async () => {
            try {
                setIsLoadingGame(true);
                setError('');

                if (!socketService.getConnected()) {
                    await socketService.connect();
                }

                await socketService.rejoinGame(userId, currentSession.id);
                setIsLoadingGame(false);
            } catch (err) {
                console.error('Failed to rejoin game:', err);
                setError(err instanceof Error ? err.message : 'Failed to rejoin game');
                setIsLoadingGame(false);
            }
        };

        connectAndRejoin();
    }, [userId, currentSession]);

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
        isLoadingGame,
        hasFinishedSetup
    };
} 