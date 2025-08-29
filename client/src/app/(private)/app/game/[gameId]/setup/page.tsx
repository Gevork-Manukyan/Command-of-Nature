"use client";

import { ErrorScreen } from '@/components/error/error-screen';
import SageSelection from '@/components/game/setup/sage-selection';
import TeamSelection from '@/components/game/setup/team-selection';
import { useGameSetupContext } from '@/contexts/GameSetupContext';

export default function GameSetupPage() {
    const { 
        error, 
        currentPhase,
    } = useGameSetupContext();

    if (error) {
        return <ErrorScreen message={error} />;
    }

    return (
        <section className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
            {/* Sage Selection */}
            {currentPhase === 'sage-selection' && (
                <SageSelection />
            )}
            
            {/* Team Formation */}
            {currentPhase === 'team-formation' && (
                <TeamSelection />
            )}

            {/* Action Buttons */}
            {/* <div className="flex justify-center gap-4">
                {currentPhase === 'warrior-selection' && (
                    <button
                        onClick={() => console.log("Select Warriors")}
                        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        Select Warriors
                    </button>
                )}
                {currentPhase === 'ready' && (
                    <button
                        onClick={() => console.log("Toggle Ready")}
                        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        Toggle Ready
                    </button>
                )}
                {currentPhase === 'setup-complete' && (
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