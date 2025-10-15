"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { exitGame, leaveGame as leaveGameApi } from '@/services/game-api';
import { useGameSessionContext } from '@/contexts/GameSessionContext';

export function useGameNavigation(gameId: string, userId: string) {
    const router = useRouter();
    const { currentGameSession, updateCurrentSession } = useGameSessionContext();
    const [isLeaving, setIsLeaving] = useState(false);

    const goToLobby = async () => {
        setIsLeaving(true);
        router.push('/app/lobby');
        if (!currentGameSession) return;
        await exitGame(gameId, { userId });
    };

    const leaveGame = async () => {
        if (!currentGameSession) {
            router.push('/app/lobby');
            return;
        };

        setIsLeaving(true);

        try {
            await leaveGameApi(gameId, { userId });
        } catch (err) {
            console.error('Failed to leave game:', err);
        }

        router.push('/app/lobby');
        updateCurrentSession(null);
    };

    return {
        isLeaving,
        goToLobby,
        leaveGame,
    };
} 