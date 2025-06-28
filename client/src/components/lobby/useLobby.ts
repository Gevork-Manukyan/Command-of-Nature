import { useEffect, useState } from "react";
import { GameListing } from "@shared-types";
import { apiClient } from "@/lib/client/api-client";
import { socketService } from "@/services/socket.service";
import { useGameSessionContext } from "@/contexts/GameSessionContext";
import { useRouter } from "next/navigation";


export default function useLobby() {
    const router = useRouter();
    const [currentGames, setCurrentGames] = useState<GameListing[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isFetchingGames, setIsFetchingGames] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const { currentSession, updateCurrentSession } = useGameSessionContext();
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

        const connectToWebsocket = async () => {
            if (!socketService.getConnected()) {
                await socketService.connect();
            }
        }
        connectToWebsocket();
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
            router.push(`/game/${gameSession.id}`);
            updateCurrentSession(gameSession);
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
            router.push(`/game/${gameSession.id}`);
            updateCurrentSession(gameSession);
        };

        // Register event listeners
        socketService.onGameCreated(handleGameCreated);
        socketService.onGameJoined(handleGameJoined);
    }, [router]);

    return {
        currentSession,
        error,
        isFetchingGames,
        isJoining,
        setIsJoining,
        currentGames,
        showModal,
        setShowModal,
    };
}