import { handleDisconnect, socket } from "@/lib/socket";
import { useEffect } from "react";

export function useSocket() {
    return (
        useEffect(() => {        
            socket.on("update", (data) => {
                console.log("Received update:", data);
            });
        
            socket.on("connect", () => {
                console.log("Connected to server");
            });
        
            return () => {
                handleDisconnect();
            };
        }, [])
    )
}