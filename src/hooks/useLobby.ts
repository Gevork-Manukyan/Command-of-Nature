import { useEffect, useState } from "react";
import { GameListing } from "@command-of-nature/shared-types";
import { apiClient } from "@/lib/client/api-client";
import { socketService } from "@/services/socket.service";
import { useGameSessionContext } from "@/contexts/GameSessionContext";
import { useRouter } from "next/navigation";


export default function useLobby() {
    const router = useRouter();
    const [currentGames, setCurrentGames] = useState<GameListing[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isFetchingGames, setIsFetchingGames] = useState(false);
    const { currentSession, setCurrentSession } = useGameSessionContext();
    const [error, setError] = useState<string>('');

    // Fetch all games from the server
    useEffect(() => {
        const fetchGames = async () => {
            try {
                setIsFetchingGames(true);
                const response = await apiClient.getAllNewGames();
                if (response.error) {
                    throw new Error(response.error);
                }
                setCurrentGames(response.data || []);
            } catch (err) {
                console.error('Failed to fetch games:', err);
            } finally {
                setIsFetchingGames(false);
            }
        };

        fetchGames();
    }, []);


    // Setup socket event listeners
    useEffect(() => {
        const handleGameCreated = (gameData: any) => {
            setError('');
            const gameSession: GameListing = {
                id: gameData.id,
                gameName: gameData.gameName,
                isPrivate: gameData.isPrivate,
                numPlayersTotal: gameData.numPlayersTotal,
                numCurrentPlayers: gameData.numCurrentPlayers,
            };
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
            setCurrentSession(gameSession);
            router.push(`/game/${gameSession.id}`);
        };

        // Register event listeners
        socketService.onGameCreated(handleGameCreated);
        socketService.onGameJoined(handleGameJoined);
    }, [router]);

    return {
        currentSession,
        error,
        isFetchingGames,
        currentGames,
        showModal,
        setShowModal,
    };
}