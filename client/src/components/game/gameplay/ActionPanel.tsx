"use client";

import { GameplayGameState } from "@shared-types";

interface ActionPanelProps {
    gameState: GameplayGameState;
    onAction: (action: string) => void;
}

export default function ActionPanel({ gameState, onAction }: ActionPanelProps) {
    const isMyTurn = gameState.activeTeamNumber === gameState.myTeam.teamNumber;
    const hasActionPoints = gameState.actionPoints > 0;
    
    const handleAction = (action: string) => {
        if (!isMyTurn || !hasActionPoints) return;
        onAction(action);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            
            {!isMyTurn ? (
                <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">Waiting for opponent's turn</p>
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
