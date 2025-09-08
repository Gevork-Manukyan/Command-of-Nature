"use client";

import { isPlayerHostOfGame } from "@/actions/game-actions";
import { useGameSessionContext } from "@/contexts/GameSessionContext";
import { useEffect, useState } from "react";

export function useIsHost(userId: string) {
    const { currentGameSession } = useGameSessionContext();
    const [isHost, setIsHost] = useState(false);

    const checkIsHost = async () => {
        if (!userId || !currentGameSession) return;
        const isHost = await isPlayerHostOfGame(
            userId,
            currentGameSession.id
        );
        setIsHost(isHost);
    };

    useEffect(() => {
        checkIsHost();
    }, [currentGameSession, userId]);

    return {
        isHost,
        checkIsHost
    }
}