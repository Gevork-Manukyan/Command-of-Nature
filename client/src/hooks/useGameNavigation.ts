import { useState } from "react";
import { useRouter } from 'next/navigation';
import { gameApiClient } from '@/services/game-api';
import { useGameSessionContext } from '@/contexts/GameSessionContext';

export function useGameNavigation(gameId: string) {
    const router = useRouter();
    const { currentSession, updateCurrentSession } = useGameSessionContext();
    const [error, setError] = useState<string>('');
    const [isLeaving, setIsLeaving] = useState(false);

    const goToLobby = async () => {
        setIsLeaving(true);
        router.push('/lobby');
        if (!currentSession) return;
        await gameApiClient.exitGame(gameId, { userId: currentSession.id });
    };

    const leaveGame = async () => {
        if (!currentSession) {
            router.push('/lobby');
            return;
        };

        setIsLeaving(true);

        try {
            await gameApiClient.leaveGame(gameId, { userId: currentSession.id });
            router.push('/lobby');

            // Wait for the router to push to the lobby before updating the current session
            // This is a temporary solution to avoid race conditions (visual bug)
            setTimeout(() => {
                updateCurrentSession(null);
            }, 100);
        } catch (err) {
            console.error('Failed to leave game:', err);
            setError(err instanceof Error ? err.message : 'Failed to leave game');
        }

        setIsLeaving(false);
    };

    return {
        error,
        isLeaving,
        goToLobby,
        leaveGame,
    };
} 