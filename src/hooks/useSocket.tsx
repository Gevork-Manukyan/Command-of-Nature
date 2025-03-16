import { handleDisconnect, socket } from "@/lib/socket";
import { useEffect, useCallback } from "react";

export function useSocket() {
    const connect = useCallback(() => {
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
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        socket.on("error", (error: Error) => {
            console.error("Socket error:", error);
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
            socket.off("update");
        };
    }, [connect]);

    return {
        socket,
        isConnected: socket.connected,
        connect,
        disconnect: handleDisconnect
    };
}