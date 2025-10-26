"use client";

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useGameSessionContext } from '@/contexts/GameSessionContext';
import { activateDayBreakCard, completePhase1 } from '@/services/game-api';
import { SpaceOption } from '@shared-types';

interface UseDaybreakActivationReturn {
    activatedCards: Set<SpaceOption>;
    isActivating: boolean;
    isCompletingPhase: boolean;
    activateDaybreak: (spaceOption: SpaceOption) => Promise<void>;
    completePhase1: () => Promise<void>;
    error: string | null;
}

export function useDaybreakActivation(): UseDaybreakActivationReturn {
    const { data: session } = useSession();
    const { currentGameSession } = useGameSessionContext();
    const [activatedCards, setActivatedCards] = useState<Set<SpaceOption>>(new Set());
    const [isActivating, setIsActivating] = useState(false);
    const [isCompletingPhase, setIsCompletingPhase] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const activateDaybreak = useCallback(async (spaceOption: SpaceOption) => {
        if (!session?.user?.id || !currentGameSession?.id) {
            setError('No user session or game session found');
            return;
        }

        if (activatedCards.has(spaceOption)) {
            setError('This daybreak card has already been activated');
            return;
        }

        setIsActivating(true);
        setError(null);

        try {
            await activateDayBreakCard(currentGameSession.id, { userId: session.user.id, spaceOption });
            
            // Add to local state
            setActivatedCards(prev => new Set(prev).add(spaceOption));
        } catch (err) {
            console.error('Failed to activate daybreak card:', err);
            setError(err instanceof Error ? err.message : 'Failed to activate daybreak card');
        } finally {
            setIsActivating(false);
        }
    }, [session?.user?.id, currentGameSession?.id, activatedCards]);

    const handleCompletePhase1 = useCallback(async () => {
        if (!session?.user?.id || !currentGameSession?.id) {
            setError('No user session or game session found');
            return;
        }

        setIsCompletingPhase(true);
        setError(null);

        try {
            await completePhase1(currentGameSession.id, { userId: session.user.id });
        } catch (err) {
            console.error('Failed to complete Phase 1:', err);
            setError(err instanceof Error ? err.message : 'Failed to complete Phase 1');
        } finally {
            setIsCompletingPhase(false);
        }
    }, [session?.user?.id, currentGameSession?.id]);

    return {
        activatedCards,
        isActivating,
        isCompletingPhase,
        activateDaybreak,
        completePhase1: handleCompletePhase1,
        error,
    };
}
