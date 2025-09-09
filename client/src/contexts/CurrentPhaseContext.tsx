"use client";

import { getCurrentPhase } from "@/services/game-api";
import { State } from "@shared-types/gamestate-types";
import { createContext, useContext, useEffect, useState } from "react";
import { useGameSessionContext } from "./GameSessionContext";
import { NextStateData, NextStateDataSchema } from "@shared-types";

type CurrentPhaseContextType = {
    currentPhase: State | null;
    updateCurrentPhase: (data: NextStateData) => void;
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

    function updateCurrentPhase(data: NextStateData) {
        const validatedData = NextStateDataSchema.parse(data);
        setCurrentPhase(validatedData.nextState);
    }

    return (
        <CurrentPhaseContext.Provider value={{ currentPhase, updateCurrentPhase }}>
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