"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { leaveGame as leaveGameApi } from '@/services/game-api';
import { useGameId } from '@/hooks/useGameId';

interface UseGameNavigationProps {
    userId: string;
}

export function useGameNavigation({ userId }: UseGameNavigationProps) {
    const router = useRouter();
    const gameId = useGameId();
    const [isLeaving, setIsLeaving] = useState(false);

    const goToLobby = async () => {
        setIsLeaving(true);
        router.push('/app/lobby');
    };

    const leaveGame = async () => {
        setIsLeaving(true);

        try {
            await leaveGameApi(gameId, { userId });
        } catch (err) {
            console.error('Failed to leave game:', err);
        }

        router.push('/app/lobby');
    };

    return {
        isLeaving,
        goToLobby,
        leaveGame,
    };
} 