import { useState } from "react";
import { useRouter } from 'next/navigation';
import { socketService } from '@/services/socket.service';
import { useGameSessionContext } from '@/contexts/GameSessionContext';

export function useGameNavigation() {
    const router = useRouter();
    const { currentSession, updateCurrentSession } = useGameSessionContext();
    const [error, setError] = useState<string>('');
    const [isLeaving, setIsLeaving] = useState(false);

    const goToLobby = async () => {
        setIsLeaving(true);
        router.push('/lobby');
        if (!currentSession) return;
        await socketService.exitGame(currentSession.id);
    };

    const leaveGame = async () => {
        setIsLeaving(true);
        if (!currentSession) return;

        try {
            await socketService.leaveGame(currentSession.id);
            updateCurrentSession(null);
            router.push('/lobby');
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