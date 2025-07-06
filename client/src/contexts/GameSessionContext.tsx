"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameListing } from "@shared-types";
import { getFromLocalStorage, setToLocalStorage, removeFromLocalStorage, GAME_SESSION } from '@/lib/client/localstorage';

interface GameSessionContextType {
    currentGameSession: GameListing | null;
    isLoadingGameSession: boolean;
    updateCurrentSession: (session: GameListing | null) => void;
    clearCurrentSession: () => void;
}

const GameSessionContext = createContext<GameSessionContextType | undefined>(undefined);

export function GameSessionProvider({ children }: { children: ReactNode }) {
    const [currentGameSession, setCurrentGameSession] = useState<GameListing | null>(null);
    const [isLoadingGameSession, setIsLoadingGameSession] = useState(true);

    // Load game session from localStorage on mount
    useEffect(() => {
        setIsLoadingGameSession(true);
        const session = getFromLocalStorage<GameListing>(GAME_SESSION);
        if (session) {
            setCurrentGameSession(session);
        }
        setIsLoadingGameSession(false);
    }, []);

    const updateCurrentSession = (session: GameListing | null) => {
        setIsLoadingGameSession(true);
        setToLocalStorage(GAME_SESSION, session);
        setCurrentGameSession(session);
        setIsLoadingGameSession(false);
    };

    const clearCurrentSession = () => {
        setIsLoadingGameSession(true);
        removeFromLocalStorage(GAME_SESSION);
        setCurrentGameSession(null);
        setIsLoadingGameSession(false);
    };

    return (
        <GameSessionContext.Provider
            value={{
                currentGameSession,
                isLoadingGameSession,
                updateCurrentSession,
                clearCurrentSession,
            }}
        >
            {children}
        </GameSessionContext.Provider>
    );
}

export function useGameSessionContext() {
    const context = useContext(GameSessionContext);
    if (context === undefined) {
        throw new Error('useGameSessionContext must be used within a GameSessionProvider');
    }
    return context;
} 