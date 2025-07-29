"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { getFromLocalStorage, removeFromLocalStorage, setToLocalStorage, USER } from '@/lib/client/localstorage';
import { apiClient } from '@/lib/client/api-client';

type UserContextType = {
    userId: string | null;
    // login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
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

    // TODO: remove
    // const login = async (username: string, password: string) => {
    //     try {
    //         const { data, error } = await apiClient.login({ username, password });
            
    //         if (error) {
    //             return { success: false, error };
    //         }

    //         if (!data || !data.id) {
    //             return { success: false, error: "Login response missing user ID" };
    //         }

    //         setUserId(data.id);
    //         setToLocalStorage(USER, data.id);
    //         return { success: true };
    //     } catch (err) {
    //         return { success: false, error: err instanceof Error ? err.message : "Login failed" };
    //     }
    // };

    const register = async (username: string, password: string) => {
        try {
            const { data, error } = await apiClient.register({ username, password });
            
            if (error) {
                return { success: false, error };
            }

            if (!data || !data.id) {
                return { success: false, error: "Registration response missing user ID" };
            }

            setUserId(data.id);
            setToLocalStorage(USER, data.id);
            return { success: true };
        } catch (err) {
            return { success: false, error: err instanceof Error ? err.message : "Registration failed" };
        }
    };

    const logout = async () => {
        await apiClient.logout();
        setUserId(null);
        removeFromLocalStorage(USER);
    };

    return (
        <UserContext.Provider value={{ 
            userId, 
            // login, 
            register, 
            logout 
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
} 