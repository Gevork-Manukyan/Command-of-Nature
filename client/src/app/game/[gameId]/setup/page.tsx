"use client";

import { useGameSetup } from '../../../../hooks/useGameSetup';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorScreen } from '@/components/ErrorScreen';
import { useGameSessionContext } from '@/contexts/GameSessionContext';
import SageSelection from './SageSelection';
import TeamSelection from './TeamSelection';

export default function GameSetupPage() {
    const { currentSession, isLoadingGameSession } = useGameSessionContext();
    const { 
        error, 
        isLoadingGame, 
        isLeaving, 
        currentPhase,
        selectedSage,
        availableSages,
        handleSageConfirm,
        handleTeamJoin,
    } = useGameSetup();

    if (isLoadingGame || isLoadingGameSession) {
        return <LoadingScreen message="Connecting to game..." />;
    }

    if (isLeaving) {
        return <LoadingScreen message="Leaving game..." />;
    }

    if (error) {
        return <ErrorScreen message={error} />;
    }

    if (!currentSession) {
        return <ErrorScreen message="Game session not found" />;
    }

    return (
        <section className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
            {/* Sage Selection */}
            {currentPhase === 'sage-selection' && (
                <SageSelection 
                    selectedSage={selectedSage}     
                    onSageConfirm={handleSageConfirm} 
                    availableSages={availableSages}
                />
            )}
            
            {/* Team Formation */}
            {currentPhase === 'team-formation' && (
                <TeamSelection handleTeamJoin={handleTeamJoin} />
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