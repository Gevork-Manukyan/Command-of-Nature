'use client'

import { GameSession, GuestSession } from "@/types/game";

export const STORAGE_KEYS = {
    GAME_SESSION: 'current_game_session',
    GUEST: 'guestSession'
} as const;

// Guest Storage Management
export const GuestStorage = {
    save: (guestSession: GuestSession) => {
        localStorage.setItem(STORAGE_KEYS.GUEST, JSON.stringify(guestSession));
    },

    get: (): GuestSession | null => {
        const result = localStorage.getItem(STORAGE_KEYS.GUEST);
        return result ? JSON.parse(result) : null;
    },

    getUserId: (): string | null => {
        const data = GuestStorage.get();
        return data ? data.userId : null;
    },

    getGuestName: (): string | null => {
        const data = GuestStorage.get();
        return data ? data.guestName : null;
    },

    clear: () => {
        localStorage.removeItem(STORAGE_KEYS.GUEST);
    }
};

// Game Storage Management
export const GameStorage = {
    saveGameSession: (session: GameSession) => {
        localStorage.setItem(STORAGE_KEYS.GAME_SESSION, JSON.stringify(session));
    },
    
    getGameSession: (): GameSession | null => {
        const saved = localStorage.getItem(STORAGE_KEYS.GAME_SESSION);
        if (!saved) return null;
        return JSON.parse(saved) as GameSession;
    },
    
    clearGameSession: () => {
        localStorage.removeItem(STORAGE_KEYS.GAME_SESSION);
    }
};