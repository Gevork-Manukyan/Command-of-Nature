"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { exitGame, leaveGame as leaveGameApi } from '@/services/game-api';
import { useGameSessionContext } from '@/contexts/GameSessionContext';

export function useGameNavigation(gameId: string, userId: string) {
    const router = useRouter();
    const { currentGameSession, updateCurrentSession } = useGameSessionContext();
    const [error, setError] = useState<string>('');
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
            router.push('/app/lobby');
            updateCurrentSession(null);
        } catch (err) {
            console.error('Failed to leave game:', err);
            setError(err instanceof Error ? err.message : 'Failed to leave game');
            setIsLeaving(false);
        }
    };

    return {
        error,
        isLeaving,
        goToLobby,
        leaveGame,
    };
} 