"use client";

import { GameListing } from "@shared-types";
import { createContext, useContext, useEffect, useState } from "react";
import { useGameSessionContext } from "./GameSessionContext";
import { getGameListings } from "@/actions/game-actions";

type LobbyContextType = {
    currentGameSession: GameListing | null;
    error: string;
    isFetchingGames: boolean;
    isJoining: boolean;
    setIsJoining: (isJoining: boolean) => void;
    currentGames: GameListing[];
    showModal: boolean;
    setShowModal: (showModal: boolean) => void;
    refreshGames: () => Promise<void>;
};

const LobbyContext = createContext<LobbyContextType | null>(null);

type LobbyProviderProps = {
    children: React.ReactNode;
};

export function LobbyProvider({ children }: LobbyProviderProps) {
    const [currentGames, setCurrentGames] = useState<GameListing[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isFetchingGames, setIsFetchingGames] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const { currentGameSession } = useGameSessionContext();
    const [error, setError] = useState<string>("");

    // Fetch all games from the server
    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            setIsFetchingGames(true);
            const games = await getGameListings(false);
            setCurrentGames(games);
        } catch (err) {
            setError("Failed to fetch games");
        } finally {
            setIsFetchingGames(false);
        }
    };

    const refreshGames = async () => {
        await fetchGames();
    };

    return (
        <LobbyContext.Provider
            value={{
                currentGameSession,
                error,
                isFetchingGames,
                isJoining,
                setIsJoining,
                currentGames,
                showModal,
                setShowModal,
                refreshGames,
            }}
        >
            {children}
        </LobbyContext.Provider>
    );
}

export function useLobbyContext() {
    const context = useContext(LobbyContext);
    if (!context) {
        throw new Error("useLobbyContext must be used within a LobbyProvider");
    }
    return context;
}
