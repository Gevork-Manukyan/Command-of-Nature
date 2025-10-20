"use client";

import Gameplay from '@/components/game/gameplay/Gameplay';
import WarriorSelection from '@/components/game/setup/warrior-pages/warrior-selection';
import { LoadingScreen } from '@/components/loading/loading-screen';
import { ErrorScreen } from '@/components/error/error-screen';
import { useGameStateContext } from '@/contexts/GameStateContext';
import { State } from '@shared-types/gamestate-types';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GamePage() {
    const params = useParams();
    const router = useRouter();
    const gameId = params.gameId as string;
    const { currentPhase, isLoading, error, isGameplayPhase, isSetupPhase } = useGameStateContext();

    // Handle redirects based on phase
    useEffect(() => {
        if (!currentPhase) return;

        if (isSetupPhase) {
            if (window.location.pathname === `/app/game/${gameId}`) {
                router.replace(`/app/game/${gameId}/setup`);
            }
        } else if (isGameplayPhase) {
            if (window.location.pathname === `/app/game/${gameId}/setup`) {
                router.replace(`/app/game/${gameId}`);
            }
        }
    }, [currentPhase, isSetupPhase, isGameplayPhase, gameId, router]);

    // Show loading while state is being determined
    if (isLoading) {
        return <LoadingScreen />
    }

    // Show error if there's an issue
    if (error) {
        return <ErrorScreen message={error} />
    }

    // Only render if we're actually in a gameplay phase
    if (!isGameplayPhase) {
        return null; 
    }

    // Determine if we're in warrior selection phase
    const isSelectionPhase = (currentPhase === State.WARRIOR_SELECTION) || (currentPhase === State.SETUP_COMPLETE);

    return (
        <div className="flex flex-col items-center min-h-screen">
            {isSelectionPhase && <WarriorSelection />}
            {!isSelectionPhase && <Gameplay />}
        </div>
    );
} 