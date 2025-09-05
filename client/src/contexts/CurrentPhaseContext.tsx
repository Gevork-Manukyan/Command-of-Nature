"use client";

import { getCurrentPhase } from "@/services/game-api";
import { State } from "@shared-types/gamestate-types";
import { createContext, useContext, useEffect, useState } from "react";
import { useGameSessionContext } from "./GameSessionContext";

type CurrentPhaseContextType = {
    currentPhase: State | null;
    setCurrentPhase: (phase: State) => void;
};

const CurrentPhaseContext = createContext<CurrentPhaseContextType | undefined>(undefined);

type CurrentPhaseProviderProps = {
    children: React.ReactNode;
}

export function CurrentPhaseProvider({ children }: CurrentPhaseProviderProps) {
    const [currentPhase, setCurrentPhase] = useState<State | null>(null);
    const { currentGameSession } = useGameSessionContext();
    const gameId = currentGameSession?.id || "";


    useEffect(() => {
        const fetchCurrentPhase = async () => {
            const currentPhase = await getCurrentPhase(gameId);
            setCurrentPhase(currentPhase);
        };
        
        fetchCurrentPhase();
    }, [gameId])

    return (
        <CurrentPhaseContext.Provider value={{ currentPhase, setCurrentPhase }}>
            {children}
        </CurrentPhaseContext.Provider>
    )
}

export function useCurrentPhaseContext() {
    const context = useContext(CurrentPhaseContext);
    if (!context) {
        throw new Error("useCurrentPhaseContext must be used within a CurrentPhaseProvider");
    }
    return context;
}