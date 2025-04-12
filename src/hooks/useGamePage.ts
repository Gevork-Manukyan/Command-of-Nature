import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { socketService } from '@/services/socket.service';
import { useUserContext } from '@/contexts/UserContext';
import { useGameSessionContext } from '@/contexts/GameSessionContext';

export function useGamePage() {
    const router = useRouter();
    const { userId } = useUserContext();
    const { currentSession, setCurrentSession } = useGameSessionContext();
    const [error, setError] = useState<string>('');
    const [isLeaving, setIsLeaving] = useState(false);
    const [isLoadingGame, setIsLoadingGame] = useState(false);

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

    const goToLobby = async () => {
        setIsLeaving(true);
        router.push('/lobby');
        if (!currentSession) return;
        await socketService.exitGame(currentSession.id);
    }

    const leaveGame = async () => {
        setIsLeaving(true);
        router.push('/lobby');
        if (!currentSession) return;

        try {
            await socketService.leaveGame(currentSession.id);
            setCurrentSession(null);
        } catch (err) {
            console.error('Failed to leave game:', err);
            setError(err instanceof Error ? err.message : 'Failed to leave game');
            setIsLeaving(false);
        } 
    };

    return {
        isLeaving,
        error,
        isLoadingGame,
        goToLobby,
        leaveGame,
    };
} 