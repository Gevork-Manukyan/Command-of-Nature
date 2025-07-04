import { useEffect, useState } from "react";
import { GameListing } from "@shared-types";
import { apiClient } from "@/lib/client/api-client";
import { useGameSessionContext } from "@/contexts/GameSessionContext";


export default function useLobby() {
    const [currentGames, setCurrentGames] = useState<GameListing[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isFetchingGames, setIsFetchingGames] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const { currentSession } = useGameSessionContext();
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
                setError('Failed to fetch games');
            } finally {
                setIsFetchingGames(false);
            }
        };
        fetchGames();
    }, []);

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