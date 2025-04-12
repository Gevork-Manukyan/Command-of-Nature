import { GameListing } from "@command-of-nature/shared-types";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getFromLocalStorage, removeFromLocalStorage, GAME_SESSION } from '@/lib/client/localstorage';
import { socketService } from '@/services/socket.service';
import useSocket from "./useSocket";

export function useGameInstance() {
    const params = useParams();
    const router = useRouter();
    const gameId = params.gameId as string;
    const shortGameId = gameId.toString().slice(-6);
    const [session, setSession] = useState<GameListing | null>(null);
    const [error, setError] = useState<string>('');
    const { connectToSocket } = useSocket();

    useEffect(() => {
        const connect = async () => {
            await connectToSocket();
        }

        connect();

        return () => {
            console.log('disconnecting from socket');
            socketService.disconnect();
        }
    }, []);

    /**
     * Load the game session from local storage if it exists and is the correct game id 
     */
    useEffect(() => {
        const loadedSession = getFromLocalStorage<GameListing>(GAME_SESSION);
        if (loadedSession) {
            if (loadedSession.id === gameId) {
                setSession(loadedSession);
            } else {
                removeFromLocalStorage(GAME_SESSION);
            }
        }
    }, [gameId]);

    /**
     * Navigate to the lobby
     */
    const handleToLobby = () => {
        router.push('/lobby');
    };

    /**
     * Leave the game and navigate to the lobby
     */
    const handleLeaveGame = async () => {
        removeFromLocalStorage(GAME_SESSION);
        router.push('/lobby');
        await socketService.leaveGame(gameId);
        socketService.disconnect();
    };

    return {
        error,
        session,
        shortGameId,
        router,
        handleToLobby,
        handleLeaveGame,
    };
}