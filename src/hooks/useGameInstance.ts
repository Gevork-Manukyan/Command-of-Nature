import { GameListing } from "@command-of-nature/shared-types";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getFromLocalStorage, removeFromLocalStorage, GAME_SESSION } from '@/lib/client/localstorage';
import { socketService } from '@/services/socket.service';
import { useSocket } from '@/hooks/useSocket';

export function useGameInstance() {
    const { socket, isConnected } = useSocket();
    const params = useParams();
    const router = useRouter();
    const gameId = params.gameId as string;
    const shortGameId = gameId.toString().slice(-6);
    const [session, setSession] = useState<GameListing | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        // Load the game session
        const loadedSession = getFromLocalStorage<GameListing>(GAME_SESSION);
        if (loadedSession) {
            // Verify this is the correct game
            if (loadedSession.id === gameId) {
                setSession(loadedSession);
            } else {
                // Clear invalid session
                removeFromLocalStorage(GAME_SESSION);
            }
        }
    }, [gameId]);

    // Cleanup socket connection only
    useEffect(() => {
        return () => {
            socket.disconnect();
        };
    }, [socket]);

    const handleToLobby = () => {
        router.push('/lobby');
    };

    const handleLeaveGame = () => {
        socketService.leaveGame(gameId);
        socketService.disconnect();

        removeFromLocalStorage(GAME_SESSION);
        
        router.push('/lobby');
    };

    return {
        error,
        session,
        shortGameId,
        isConnected,
        router,
        handleToLobby,
        handleLeaveGame,
    };
}