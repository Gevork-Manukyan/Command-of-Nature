import { useState } from "react";

import { socketService } from "@/services/socket.service";

export default function useSocket() {
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string>('');
    const [isConnecting, setIsConnecting] = useState(false);

    const connectToSocket = async () => {
        if (socketService.getConnected()) {
            return;
        }

        setIsConnecting(true);
        await socketService.connect();
        setConnected(true);
        setIsConnecting(false);
    }

    return{
        connected,
        error,
        isConnecting,
        connectToSocket,
    }
}