"use client";

import { GameplayGameState, State } from "@shared-types";
import { useGameStateContext } from "@/contexts/GameStateContext";
import { useDaybreakActivation } from "@/hooks/useDaybreakActivation";

interface ActionPanelProps {
    gameState: GameplayGameState;
    onAction: (action: string) => void;
}

export default function ActionPanel({ gameState, onAction }: ActionPanelProps) {
    const { currentPhase } = useGameStateContext();
    const { activatedCards, completePhase1, isCompletingPhase, error } = useDaybreakActivation();
    
    const isMyTurn = gameState.activeTeamNumber === gameState.myTeam.teamNumber;
    const hasActionPoints = gameState.actionPoints > 0;
    const isPhase1 = currentPhase === State.PHASE1;
    
    const handleAction = (action: string) => {
        if (!isMyTurn || !hasActionPoints) return;
        onAction(action);
    };

    const handleCompletePhase1 = async () => {
        await completePhase1();
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}
            
            {!isMyTurn ? (
                <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">Waiting for opponent's turn</p>
                </div>
            ) : isPhase1 ? (
                <div className="space-y-3">
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h3 className="font-medium text-yellow-800 mb-2">Phase 1 - Daybreak</h3>
                        <p className="text-sm text-yellow-700 mb-2">
                            Activate daybreak cards on your battlefield by clicking them.
                        </p>
                        <p className="text-xs text-yellow-600">
                            Activated: {activatedCards.size} cards
                        </p>
                    </div>
                    
                    <button 
                        className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleCompletePhase1}
                        disabled={isCompletingPhase}
                    >
                        {isCompletingPhase ? 'Completing Phase...' : 'Complete Phase 1'}
                    </button>
                </div>
            ) : !hasActionPoints ? (
                <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No action points remaining</p>
                    <button 
                        className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        onClick={() => handleAction('end-turn')}
                    >
                        End Turn
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="text-sm text-gray-600 mb-3">
                        Action Points: {gameState.actionPoints}/{gameState.maxActionPoints}
                    </div>
                    
                    <button 
                        className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
                        onClick={() => handleAction('draw-card')}
                    >
                        Draw Card
                    </button>
                    
                    <button 
                        className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 disabled:opacity-50"
                        onClick={() => handleAction('summon-card')}
                    >
                        Summon Card
                    </button>
                    
                    <button 
                        className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 disabled:opacity-50"
                        onClick={() => handleAction('play-item')}
                    >
                        Play Item
                    </button>
                    
                    <button 
                        className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50"
                        onClick={() => handleAction('attack')}
                    >
                        Attack
                    </button>
                    
                    <button 
                        className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 disabled:opacity-50"
                        onClick={() => handleAction('sage-skill')}
                    >
                        Sage Skill
                    </button>
                    
                    <div className="pt-2 border-t border-gray-200">
                        <button 
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                            onClick={() => handleAction('end-turn')}
                        >
                            End Turn
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
