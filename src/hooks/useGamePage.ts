import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { socketService } from '@/services/socket.service';
import { useUserContext } from '@/contexts/UserContext';
import { useGameSessionContext } from '@/contexts/GameSessionContext';

export function useGamePage() {
    const router = useRouter();
    const { userId } = useUserContext();
    const { currentSession, setCurrentSession } = useGameSessionContext();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [isConnecting, setIsConnecting] = useState(false);

    // Handle socket connection and game rejoining
    useEffect(() => {
        if (!userId || !currentSession) return;

        const connectAndRejoin = async () => {
            try {
                setIsConnecting(true);
                setError('');

                if (!socketService.getConnected()) {
                    await socketService.connect();
                }

                await socketService.rejoinGame(userId, currentSession.id);
                setIsConnecting(false);
            } catch (err) {
                console.error('Failed to rejoin game:', err);
                setError(err instanceof Error ? err.message : 'Failed to rejoin game');
                setIsConnecting(false);
            }
        };

        connectAndRejoin();
    }, [userId, currentSession]);

    const leaveGame = async () => {
        setIsLoading(true);
        router.push('/lobby');
        if (!currentSession) return;

        try {
            await socketService.leaveGame(currentSession.id);
            setCurrentSession(null);
        } catch (err) {
            console.error('Failed to leave game:', err);
            setError(err instanceof Error ? err.message : 'Failed to leave game');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        isConnecting,
        leaveGame,
    };
} 