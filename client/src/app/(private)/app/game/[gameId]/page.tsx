"use client";

import WarriorSelection from '@/components/game/setup/warrior-selection';
import { LoadingScreen } from '@/components/loading/loading-screen';
import { useGameStartedManager } from '@/hooks/useGameStartedManager';
import { State } from '@shared-types/gamestate-types';
import { useParams } from 'next/navigation';

export default function GamePage() {
    const params = useParams();
    const gameId = params.gameId as string;
    const { isGameplayPhase, currentPhase } = useGameStartedManager(gameId);

    // Show loading while phase is being determined
    if (currentPhase === null) {
        return <LoadingScreen />
    }

    // Only render if we're actually in a gameplay phase
    // The useGameStartedManager hook will handle redirecting to setup
    if (!isGameplayPhase) {
        return null; 
    }

    return (
        <div className="flex flex-col min-h-screen">
            {currentPhase === State.WARRIOR_SELECTION && <WarriorSelection />}
        </div>
    );
} 