import { handleDisconnect, socket } from "@/lib/server/socket";
import { useEffect, useCallback, useState } from "react";

export function useSocket() {
    const [isConnected, setIsConnected] = useState(socket.connected);

    const connect = useCallback(() => {
        console.log("Attempting to connect to socket server...");
        if (!socket.connected) {
            socket.connect();
        }
    }, []);

    useEffect(() => {
        // Connect to the server
        connect();

        // Connection event handlers
        socket.on("connect", () => {
            console.log("Connected to server");
            setIsConnected(true);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
            setIsConnected(false);
        });

        socket.on("error", (error: Error) => {
            console.error("Socket error:", error);
            setIsConnected(false);
        });

        socket.on("connect_error", (error) => {
            console.error("Connection error:", error);
            setIsConnected(false);
        });

        // Game-specific event handlers
        socket.on("update", (data) => {
            console.log("Received update:", data);
        });

        // Cleanup on unmount
        return () => {
            handleDisconnect();
            socket.off("connect");
            socket.off("disconnect");
            socket.off("error");
            socket.off("connect_error");
            socket.off("update");
        };
    }, [connect]);

    return {
        socket,
        isConnected,
        connect,
        disconnect: handleDisconnect
    };
}