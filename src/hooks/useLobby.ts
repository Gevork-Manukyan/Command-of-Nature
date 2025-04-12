import { apiClient } from "@/lib/client/api-client";
import { GameListing } from "@command-of-nature/shared-types";
import { useEffect, useState } from "react";

function useLobby() {
    const [currentGames, setCurrentGames] = useState<GameListing[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                setIsLoading(true);
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
    };
}

export default useLobby;