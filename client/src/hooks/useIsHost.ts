"use client";

import { useGameStateContext } from "@/contexts/GameStateContext";
import { useSession } from "next-auth/react";

export function useIsHost() {
    const { gameState, isSetupState } = useGameStateContext();
    const { data: session } = useSession();
    const currentUserId = session?.user.id;

    if (isSetupState(gameState)) {
        return gameState.hostUserId === currentUserId;
    }

    return false;
}