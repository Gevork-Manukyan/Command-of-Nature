import { useEffect, useState } from "react";
import { GameListing } from "@command-of-nature/shared-types";
import { apiClient } from "@/lib/client/api-client";
import { useGameSession } from "./useGameSession";

export default function useLobby() {
    const [currentGames, setCurrentGames] = useState<GameListing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { createGame, joinGame, error, currentSession, isCreatingGame } = useGameSession();

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await apiClient.getAllNewGames();
                if (response.error) {
                    throw new Error(response.error);
                }
                setCurrentGames(response.data || []);
            } catch (err) {
                console.error('Failed to fetch games:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGames();
    }, []);

    return {
        currentGames,
        isLoading,
        error,
        currentSession,
        showModal,
        setShowModal,
        isCreatingGame,
        createGame,
        joinGame,
    };
}