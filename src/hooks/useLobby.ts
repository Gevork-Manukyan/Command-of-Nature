import { useEffect, useState } from "react";
import { GameListing } from "@command-of-nature/shared-types";
import { apiClient } from "@/lib/client/api-client";


export default function useLobby() {
    const [currentGames, setCurrentGames] = useState<GameListing[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isFetchingGames, setIsFetchingGames] = useState(false);

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

    return {
        isFetchingGames,
        currentGames,
        showModal,
        setShowModal,
    };
}