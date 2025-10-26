"use client";

import { GameplayGameState, State } from "@shared-types";
import { useGameStateContext } from "@/contexts/GameStateContext";
import { useDaybreakActivation } from "@/hooks/useDaybreakActivation";
import BattlefieldCard from "./BattlefieldCard";

type BattlefieldDisplayProps = {
    gameState: GameplayGameState;
}

export default function BattlefieldDisplay({ gameState }: BattlefieldDisplayProps) {
    const { currentPhase } = useGameStateContext();
    const { activatedCards, activateDaybreak, isActivating } = useDaybreakActivation();
    
    const myTeam = gameState.myTeam;
    const opponentTeam = gameState.teams.find(t => t.teamNumber !== myTeam.teamNumber);
    
    if (!opponentTeam) return null;

    const isPhase1 = currentPhase === State.PHASE1;
    const isMyTurn = gameState.activeTeamNumber === myTeam.teamNumber;
    const canActivateDaybreak = isPhase1 && isMyTurn;

    const handleCardClick = (spaceNumber: number) => {
        if (canActivateDaybreak && !activatedCards.has(spaceNumber as any)) {
            activateDaybreak(spaceNumber as any);
        }
    };

    const renderBattlefield = (team: typeof myTeam, isOpponent: boolean) => {
        // Helper function to get space layout based on team size
        const getSpaceLayout = (numPlayersOnTeam: 1 | 2) => {
            if (numPlayersOnTeam === 1) {
                // 2-player game
                return {
                    row1: [1],
                    row2: [2, 3],  
                    row3: [4, 5, 6]
                };
            } else {
                // 4-player game
                return {
                    row1: [1, 2],
                    row2: [3, 4, 5, 6],
                    row3: [7, 8, 9, 10, 11, 12]
                };
            }
        };

        const numPlayersOnTeam = team.playerIds.length as 1 | 2;
        const layout = getSpaceLayout(numPlayersOnTeam);
        
        // For opponent, reverse the rows (3-2-1 or 6-4-2)
        const rows = isOpponent 
            ? [layout.row3, layout.row2, layout.row1]
            : [layout.row1, layout.row2, layout.row3];

        return (
            <div className="space-y-2">
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-2">
                        {row.map(spaceNumber => {
                            const card = team.battlefield?.spaces?.[spaceNumber.toString()] || null;
                            const isDaybreak = card?.isDayBreak || false;
                            const isActivated = activatedCards.has(spaceNumber as any);
                            const isClickable = canActivateDaybreak && !isOpponent && isDaybreak && !isActivated;
                            
                            return (
                                <div key={spaceNumber} className="relative">
                                    <BattlefieldCard
                                        spaceNumber={spaceNumber}
                                        card={card}
                                        isDaybreak={isDaybreak}
                                        isActivated={isActivated}
                                        isClickable={isClickable}
                                        onCardClick={handleCardClick}
                                    />
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Battlefield</h2>
            
            {isPhase1 && isMyTurn && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                        <strong>Phase 1 - Daybreak:</strong> Click on glowing cards to activate their daybreak abilities.
                        {isActivating && <span className="ml-2 text-yellow-600">Activating...</span>}
                    </p>
                </div>
            )}
            
            <div className="space-y-1">
                {/* Opponent Team Battlefield */}
                <div>
                    <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-sm">
                                <p className="font-medium text-gray-700">Gold: {opponentTeam.gold}</p>
                            </div>
                        </div>
                        {renderBattlefield(opponentTeam, true)}
                    </div>
                </div>

                {/* My Team Battlefield */}
                <div>
                    <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-sm">
                                <p className="font-medium text-gray-700">Gold: {myTeam.gold}</p>
                            </div>
                        </div>
                        {renderBattlefield(myTeam, false)}
                    </div>
                </div>
            </div>
        </div>
    );
}
