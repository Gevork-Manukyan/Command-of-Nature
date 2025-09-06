"use client";

import { useCurrentPhaseContext } from "@/contexts/CurrentPhaseContext";
import { State } from "@shared-types/gamestate-types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SETUP_PHASES = new Set([
    State.JOINING_GAME,
    State.SAGE_SELECTION,
    State.JOINING_TEAMS,
    State.READY_UP,
]);

const GAMEPLAY_PHASES = new Set([
    State.WARRIOR_SELECTION,
    State.SETUP_COMPLETE,
    State.PHASE1,
    State.PHASE2,
    State.PHASE3,
    State.RESOLVE_DAY_BREAK_CARDS,
    State.DISCARDING_CARDS,
    State.DRAWING_NEW_HAND,
    State.END_GAME,
    State.GAME_FINISHED,
]);

export function useGameStartedManager(gameId: string) {
    const { currentPhase } = useCurrentPhaseContext();
    const router = useRouter();

    useEffect(() => {
        if (!currentPhase) return;

        const isSetupPhase = SETUP_PHASES.has(currentPhase);
        const isGameplayPhase = GAMEPLAY_PHASES.has(currentPhase);

        if (isSetupPhase) {
            if (window.location.pathname === `/app/game/${gameId}`) {
                router.replace(`/app/game/${gameId}/setup`);
            }
        } else if (isGameplayPhase) {
            if (window.location.pathname === `/app/game/${gameId}/setup`) {
                router.replace(`/app/game/${gameId}`);
            }
        }
    }, [currentPhase, gameId, router]);

    return {
        isSetupPhase: currentPhase ? SETUP_PHASES.has(currentPhase) : null,
        isGameplayPhase: currentPhase ? GAMEPLAY_PHASES.has(currentPhase) : null,
        currentPhase,
    };
}