"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { getFromLocalStorage, removeFromLocalStorage, USER } from '@/lib/client/localstorage';

interface UserContextType {
    userId: string | null;
    logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        // Load user from localStorage on mount
        const storedUserId = getFromLocalStorage<string>(USER);
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    const logout = () => {
        setUserId(null);
        removeFromLocalStorage(USER);
    };

    return (
        <UserContext.Provider value={{ userId, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
} 