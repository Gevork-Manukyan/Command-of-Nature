"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameListing } from "@command-of-nature/shared-types";
import { getFromLocalStorage, setToLocalStorage, removeFromLocalStorage, GAME_SESSION } from '@/lib/client/localstorage';

interface GameSessionContextType {
    currentSession: GameListing | null;
    isLoadingGameSession: boolean;
    setCurrentSession: (session: GameListing | null) => void;
}

const GameSessionContext = createContext<GameSessionContextType | undefined>(undefined);

export function GameSessionProvider({ children }: { children: ReactNode }) {
    const [currentSession, setCurrentSession] = useState<GameListing | null>(null);
    const [isLoadingGameSession, setIsLoadingGameSession] = useState(true);

    // Load game session from localStorage on mount
    useEffect(() => {
        setIsLoadingGameSession(true);
        const session = getFromLocalStorage<GameListing>(GAME_SESSION);
        if (session) {
            setCurrentSession(session);
        }
        setIsLoadingGameSession(false);
    }, []);

    // Update localStorage when session changes
    useEffect(() => {
        setIsLoadingGameSession(true);
        if (currentSession) {
            setToLocalStorage(GAME_SESSION, currentSession);
        } else {
            removeFromLocalStorage(GAME_SESSION);
        }
        setIsLoadingGameSession(false);
    }, [currentSession]);

    return (
        <GameSessionContext.Provider
            value={{
                currentSession,
                isLoadingGameSession,
                setCurrentSession,
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