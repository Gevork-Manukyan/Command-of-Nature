"use client";

import { socketService } from "@/services/socket";
import { createContext, useContext, useEffect, useState } from "react";

type SocketContextType = {
    isSocketConnected: boolean;
    setIsSocketConnected: (isSocketConnected: boolean) => void;
};

const SocketContext = createContext<SocketContextType | null>(null);

type SocketProviderProps = {
    children: React.ReactNode;
    userId: string;
}

export function SocketProvider({ children, userId }: SocketProviderProps) {
    const [isSocketConnected, setIsSocketConnected] = useState(false);

    useEffect(() => {
        const connectToSocket = async () => {
            try {
                if (!socketService.getConnected()) {
                    await socketService.connect(userId);
                    setIsSocketConnected(true);
                }
            } catch (error) {
                console.error("Failed to connect to socket:", error);
            }
        };

        connectToSocket();

        // Cleanup function to disconnect when component unmounts or user logs out
        return () => {
            if (socketService.getConnected()) {
                socketService.disconnect();
                setIsSocketConnected(false);
            }
        };
    }, [userId]);

    return (
        <SocketContext.Provider
            value={{ isSocketConnected, setIsSocketConnected }}
        >
            {children}
        </SocketContext.Provider>
    );
}

export function useSocketContext() {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error(
            "useSocketContext must be used within a SocketProvider"
        );
    }
    return context;
}
