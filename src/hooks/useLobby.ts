import { useEffect, useState } from "react";
import { GameListing } from "@command-of-nature/shared-types";
import { apiClient } from "@/lib/client/api-client";
import { useGameSession } from "./useGameSession";

interface GameSettings {
    gameName: string;
    numPlayers: number;
    isPrivate: boolean;
    password?: string;
}

export default function useLobby() {
    const [currentGames, setCurrentGames] = useState<GameListing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isCreatingGame, setIsCreatingGame] = useState(false);
    const { createGame, joinGame, error, currentSession } = useGameSession();

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

    const handleCreateGame = async (settings: GameSettings) => {
        setIsCreatingGame(true);
        try {
            await createGame(settings);
        } finally {
            setIsCreatingGame(false);
        }
    };

    const handleJoinGame = async (gameId: string, password?: string) => {
        await joinGame(gameId, password);
    };

    return {
        currentGames,
        isLoading,
        error,
        currentSession,
        showModal,
        setShowModal,
        isCreatingGame,
        handleCreateGame,
        handleJoinGame,
    };
}