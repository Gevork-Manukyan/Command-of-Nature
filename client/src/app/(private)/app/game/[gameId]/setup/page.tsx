"use client";

import { ErrorScreen } from "@/components/error/error-screen";
import JoiningGame from "@/components/game/setup/joining-game";
import ReadyUp from "@/components/game/setup/ready-up";
import SageSelection from "@/components/game/setup/sage-selection";
import TeamSelection from "@/components/game/setup/team-selection";
import { LoadingScreen } from "@/components/loading/loading-screen";
import { useCurrentPhaseContext } from "@/contexts/CurrentPhaseContext";
import { useGameSetupContext } from "@/contexts/GameSetupContext";
import { useGameStartedManager } from "@/hooks/useGameStartedManager";
import { State } from "@shared-types";
import { useParams } from "next/navigation";

export default function GameSetupPage() {
    const { error } = useGameSetupContext();
    const { currentPhase } = useCurrentPhaseContext();
    const params = useParams();
    const gameId = params.gameId as string;
    const { isSetupPhase } = useGameStartedManager(gameId);
    
    // Show loading while phase is being determined
    if (currentPhase === null) {
        return <LoadingScreen />
    }

    // Only render if we're actually in a setup phase
    // The useGameStartedManager hook will handle redirecting to setup
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

            {/* Action Buttons */}
            {/* <div className="flex justify-center gap-4">
                {currentPhase === State.WARRIOR_SELECTION && (
                    <button
                        onClick={() => console.log("Select Warriors")}
                        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        Select Warriors
                    </button>
                )}
                {currentPhase === State.READY_UP && (
                    <button
                        onClick={() => console.log("Toggle Ready")}
                        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        Toggle Ready
                    </button>
                )}
                {currentPhase === State.SETUP_COMPLETE && (
                    <button
                        onClick={() => console.log("Finish Setup")}
                        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        Start Game
                    </button>
                )}
            </div> */}
        </section>
    );
}
