"use client";

import { useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useGameSessionContext } from '@/contexts/GameSessionContext';
import {
    allPlayersJoined,
    allSagesSelected,
    allTeamsJoined,
    clearTeams,
    joinTeam,
    selectSage,
    startGame,
    toggleReady,
} from '@/services/game-api';
import { Sage } from '@shared-types';

export function useSetupActions() {
    const { data: session } = useSession();
    const { currentGameSession } = useGameSessionContext();
    const gameId = currentGameSession?.id || "";
    const userId = session?.user.id!;

    const handleAllPlayersJoined = useCallback(async () => {
        await allPlayersJoined(gameId, { userId });
    }, [gameId, userId]);

    const handleSageConfirm = useCallback(async (sage: Sage) => {
        if (!currentGameSession || !userId) return;
        await selectSage(gameId, { userId: userId, sage });
    }, [gameId, userId, currentGameSession]);

    const handleAllSagesSelected = useCallback(async () => {
        await allSagesSelected(gameId, { userId });
    }, [gameId, userId]);

    const handleTeamJoin = useCallback(async (team: 1 | 2) => {
        await joinTeam(gameId, { userId: userId, team });
    }, [gameId, userId]);

    const handleClearTeams = useCallback(async () => {
        await clearTeams(gameId, { userId });
    }, [gameId, userId]);

    const handleAllTeamsJoined = useCallback(async () => {
        await allTeamsJoined(gameId, { userId });
    }, [gameId, userId]);

    const handleToggleReady = useCallback(async () => {
        await toggleReady(gameId, { userId });
    }, [gameId, userId]);

    const handleAllPlayersReady = useCallback(async () => {
        await startGame(gameId, { userId });
    }, [gameId, userId]);

    return {
        handleAllPlayersJoined,
        handleSageConfirm,
        handleAllSagesSelected,
        handleTeamJoin,
        handleClearTeams,
        handleAllTeamsJoined,
        handleToggleReady,
        handleAllPlayersReady,
    };
}