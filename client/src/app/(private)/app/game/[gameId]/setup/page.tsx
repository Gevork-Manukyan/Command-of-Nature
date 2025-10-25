"use client";

import { ErrorScreen } from "@/components/error/error-screen";
import JoiningGame from "@/components/game/setup/pre-game-pages/joining-game";
import ReadyUp from "@/components/game/setup/pre-game-pages/ready-up";
import SageSelection from "@/components/game/setup/pre-game-pages/sage-selection";
import TeamSelection from "@/components/game/setup/pre-game-pages/team-selection";
import { LoadingScreen } from "@/components/loading/loading-screen";
import { useGameStateContext } from "@/contexts/GameStateContext";
import { State } from "@shared-types";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function GameSetupPage() {
    const { currentPhase, isSetupPhase, isGameplayPhase, error } = useGameStateContext();
    const router = useRouter();
    const params = useParams();
    const gameId = params.gameId as string;
    
    // Handle redirects when phase changes
    useEffect(() => {
        if (!currentPhase) return;

        if (isGameplayPhase) {
            router.replace(`/app/game/${gameId}`);
        }
    }, [currentPhase, isGameplayPhase, gameId, router]);
    
    // Show loading while phase is being determined
    if (currentPhase === null) {
        return <LoadingScreen />
    }

    if (!isSetupPhase) {
        return null; 
    }

    if (error) {
        return <ErrorScreen message={error} />;
    }

    return (
        <section className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">

            {/* Joining Game */}
            {currentPhase === State.JOINING_GAME && <JoiningGame />}
            
            {/* Sage Selection */}
            {currentPhase === State.SAGE_SELECTION && <SageSelection />}

            {/* Team Formation */}
            {currentPhase === State.JOINING_TEAMS && <TeamSelection />}

            {/* Ready Up */}
            {currentPhase === State.READY_UP && <ReadyUp />}
        </section>
    );
}
