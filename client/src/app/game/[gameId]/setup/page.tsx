"use client";

import { useGameSetup } from '../../../../hooks/useGameSetup';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorScreen } from '@/components/ErrorScreen';
import { useGameSessionContext } from '@/contexts/GameSessionContext';

export default function GameSetupPage() {
    const { currentSession, isLoadingGameSession } = useGameSessionContext();
    const { 
        error, 
        isLoadingGame, 
        isLeaving, 
        currentPhase,
        selectedSage,
        handleSageSelect,
        handleSageSelection,
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
                <section>
                    <h3 className="text-xl font-semibold mb-4">Sage Selection</h3>
                    <div className="grid grid-cols-2 gap-8">
                        <button
                            onClick={() => handleSageSelect("Cedar")}
                            className={`p-4 border rounded-lg transition-colors ${
                                selectedSage === "Cedar" 
                                    ? "bg-blue-100 border-blue-500" 
                                    : "hover:bg-blue-50"
                            }`}
                        >
                            <h4 className="font-medium">Cedar</h4>
                        </button>
                        <button
                            onClick={() => handleSageSelect("Gravel")}
                            className={`p-4 border rounded-lg transition-colors ${
                                selectedSage === "Gravel" 
                                    ? "bg-blue-100 border-blue-500" 
                                    : "hover:bg-blue-50"
                            }`}
                        >
                            <h4 className="font-medium">Gravel</h4>
                        </button>
                        <button
                            onClick={() => handleSageSelect("Porella")}
                            className={`p-4 border rounded-lg transition-colors ${
                                selectedSage === "Porella" 
                                    ? "bg-blue-100 border-blue-500" 
                                    : "hover:bg-blue-50"
                            }`}
                        >
                            <h4 className="font-medium">Porella</h4>
                        </button>
                        <button
                            onClick={() => handleSageSelect("Torrent")}
                            className={`p-4 border rounded-lg transition-colors ${
                                selectedSage === "Torrent" 
                                    ? "bg-blue-100 border-blue-500" 
                                    : "hover:bg-blue-50"
                            }`}
                        >
                            <h4 className="font-medium">Torrent</h4>
                        </button>
                    </div>
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={() => selectedSage && handleSageSelection(selectedSage)}
                            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!selectedSage}
                        >
                            Confirm Sage Selection
                        </button>
                    </div>
                </section>
            )}
            
            {/* Team Formation */}
            {currentPhase === 'team-formation' && (
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Teams</h3>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-2">Team 1</h4>
                            
                            <button
                                onClick={() => handleTeamJoin(1)}
                                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Join Team 1
                            </button>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-2">Team 2</h4>
                            <button
                                onClick={() => handleTeamJoin(2)}
                                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Join Team 2
                            </button>
                        </div>
                    </div>
                </div>
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