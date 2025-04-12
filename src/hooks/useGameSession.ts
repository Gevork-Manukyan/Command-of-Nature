import { GameListing } from "@command-of-nature/shared-types";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { getFromLocalStorage, setToLocalStorage, removeFromLocalStorage, GAME_SESSION } from '@/lib/client/localstorage';
import { socketService } from '@/services/socket.service';
import { useUser } from '@/contexts/UserContext';

interface GameSettings {
    gameName: string;
    numPlayers: number;
    isPrivate: boolean;
    password?: string;
}

export function useGameSession() {
    const router = useRouter();
    const { userId } = useUser();
    const [currentSession, setCurrentSession] = useState<GameListing | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [isRejoining, setIsRejoining] = useState(false);
    const [isCreatingGame, setIsCreatingGame] = useState(false);

    // Load game session from localStorage on mount
    useEffect(() => {
        const session = getFromLocalStorage<GameListing>(GAME_SESSION);
        if (session) {
            setCurrentSession(session);
        }
        setIsLoading(false);
    }, []);

    // Setup socket event listeners
    useEffect(() => {
        const handleGameCreated = (gameData: any) => {
            console.log('Game created:', gameData);
            setError('');
            const gameSession: GameListing = {
                id: gameData.id,
                gameName: gameData.gameName,
                isPrivate: gameData.isPrivate,
                numPlayersTotal: gameData.numPlayersTotal,
                numCurrentPlayers: gameData.numCurrentPlayers,
            };
            setToLocalStorage(GAME_SESSION, gameSession);
            setCurrentSession(gameSession);
            router.push(`/game/${gameSession.id}`);
        };

        const handleGameJoined = (gameData: any) => {
            setError('');
            const gameSession: GameListing = {
                id: gameData.id,
                gameName: gameData.gameName,
                isPrivate: gameData.isPrivate,
                numPlayersTotal: gameData.numPlayersTotal,
                numCurrentPlayers: gameData.numCurrentPlayers,
            };
            setToLocalStorage(GAME_SESSION, gameSession);
            setCurrentSession(gameSession);
            router.push(`/game/${gameSession.id}`);
        };

        const handleGameError = (error: any) => {
            console.error('Game error:', error);
            const errorMessages: Record<string, string> = {
                'A player with this socket ID already exists in the game': 'You are already connected to this game',
                'You are already in this game': 'You are already in this game',
                'Cannot add more players': 'This game is full',
                'Game not found': 'This game no longer exists',
                'Invalid password': 'Incorrect password for this game'
            };
            setError(errorMessages[error.message] || error.message || 'An error occurred');
        };

        const handleConnectionError = (error: any) => {
            console.error('Connection error:', error);
            setError(error.message || 'Failed to connect to game server');
        };

        // Register event listeners
        socketService.onGameCreated(handleGameCreated);
        socketService.onGameJoined(handleGameJoined);
        socketService.onGameError(handleGameError);
        socketService.on('connection-error', handleConnectionError);
    }, [router]);

    // Handle socket connection and game rejoining
    useEffect(() => {
        if (!userId || !currentSession) return;

        const connectAndRejoin = async () => {
            try {
                setIsRejoining(true);
                setError('');

                if (!socketService.getConnected()) {
                    await socketService.connect();
                }

                await socketService.rejoinGame(userId, currentSession.id);
                setIsRejoining(false);
            } catch (err) {
                console.error('Failed to rejoin game:', err);
                setError(err instanceof Error ? err.message : 'Failed to rejoin game');
                setIsRejoining(false);
            }
        };

        connectAndRejoin();
    }, [userId, currentSession]);

    const createGame = async (settings: GameSettings) => {
        if (!userId) throw new Error('User ID not found');

        try {
            setError('');
            setIsCreatingGame(true);

            if (!socketService.getConnected()) {
                await socketService.connect();
            }

            await socketService.createGame(userId, settings);
        } catch (err) {
            console.error('Failed to create game:', err);
            setError(err instanceof Error ? err.message : 'Failed to create game');
        } finally {
            setIsCreatingGame(false);
        }
    };

    const joinGame = async (gameId: string, password?: string) => {
        if (!userId) throw new Error('User ID not found');

        try {
            setError('');
            setIsLoading(true);

            if (!socketService.getConnected()) {
                await socketService.connect();
            }

            await socketService.joinGame(userId, gameId, password);
        } catch (err) {
            console.error('Failed to join game:', err);
            setError(err instanceof Error ? err.message : 'Failed to join game');
        } finally {
            setIsLoading(false);
        }
    };

    const leaveGame = async () => {
        if (!currentSession) return;

        try {
            await socketService.leaveGame(currentSession.id);
            removeFromLocalStorage(GAME_SESSION);
            setCurrentSession(null);
            router.push('/lobby');
        } catch (err) {
            console.error('Failed to leave game:', err);
            setError(err instanceof Error ? err.message : 'Failed to leave game');
        }
    };

    return {
        currentSession,
        isLoading,
        error,
        isRejoining,
        isCreatingGame,
        createGame,
        joinGame,
        leaveGame,
    };
} 