"use client";

import { ElementalCard, ELEMENTS, GameplayGameState, State } from "@shared-types";
import { useGameStateContext } from "@/contexts/GameStateContext";
import { useDaybreakActivation } from "@/hooks/useDaybreakActivation";

interface BattlefieldDisplayProps {
    gameState: GameplayGameState;
}

interface BattlefieldCardProps {
    spaceNumber: number;
    card: ElementalCard | null;
    isDaybreak: boolean;
    isActivated: boolean;
    isClickable: boolean;
    onCardClick?: (spaceNumber: number) => void;
}

function BattlefieldCard({ 
    spaceNumber, 
    card, 
    isDaybreak, 
    isActivated, 
    isClickable, 
    onCardClick 
}: BattlefieldCardProps) {
    const handleClick = () => {
        if (isClickable && onCardClick) {
            onCardClick(spaceNumber);
        }
    };

    const getCardStyle = () => {
        let baseStyle = "w-20 h-28 border-2 rounded-lg flex flex-col items-center justify-center text-xs font-medium cursor-pointer transition-all duration-200";
        
        if (!card) {
            return `${baseStyle} bg-gray-100 border-gray-300 cursor-not-allowed`;
        }
        
        if (isActivated) {
            return `${baseStyle} bg-gray-300 border-gray-400 opacity-60`;
        }
        
        if (isClickable && isDaybreak) {
            return `${baseStyle} bg-yellow-100 border-yellow-400 shadow-lg hover:shadow-xl hover:scale-105 animate-pulse`;
        }
        
        return `${baseStyle} bg-white border-gray-400 hover:border-gray-600`;
    };

    const getElementColor = (element: ElementalCard["element"]) => {
        switch (element) {
            case ELEMENTS.TWIG: return 'bg-brown-600';
            case ELEMENTS.PEBBLE: return 'bg-gray-600';
            case ELEMENTS.LEAF: return 'bg-green-600';
            case ELEMENTS.DROPLET: return 'bg-blue-600';
            default: return 'bg-gray-600';
        }
    };

    return (
        <div className={getCardStyle()} onClick={handleClick}>
            {card ? (
                <>
                    <div className="flex justify-between w-full px-1">
                        <div className={`w-4 h-4 rounded-full ${getElementColor(card.element)} text-white text-xs flex items-center justify-center`}>
                            {card.attack}
                        </div>
                        <div className="w-4 h-4 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">
                            {card.health}
                        </div>
                    </div>
                    <div className="text-xs font-bold text-center px-1 mt-1">
                        {card.element}
                    </div>
                    <div className="text-xs text-center px-1 mt-auto mb-1 leading-tight">
                        {card.name}
                    </div>
                    {isDaybreak && (
                        <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 rounded-full border border-yellow-600"></div>
                    )}
                </>
            ) : (
                <div className="text-gray-400">Empty</div>
            )}
        </div>
    );
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

    const renderBattlefield = (team: typeof myTeam, isMyTeam: boolean) => {
        // Create a 3x4 grid for battlefield spaces (spaces 1-12)
        const battlefieldSpaces = Array.from({ length: 12 }, (_, i) => i + 1);
        
        return (
            <div className="grid grid-cols-3 gap-2 p-4">
                {battlefieldSpaces.map(spaceNumber => {
                    const card = team.battlefield?.spaces?.[spaceNumber] || null;
                    const isDaybreak = card?.isDayBreak || false;
                    const isActivated = activatedCards.has(spaceNumber as any);
                    const isClickable = canActivateDaybreak && isMyTeam && isDaybreak && !isActivated;
                    
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
            
            <div className="space-y-6">
                {/* My Team Battlefield */}
                <div>
                    <h3 className="text-md font-medium text-blue-600 mb-3 flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        Team {myTeam.teamNumber} (Your Team)
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-sm">
                                <p className="font-medium text-gray-700">Gold: {myTeam.gold}</p>
                                <p className="text-gray-600">Players: {myTeam.playerIds.length}</p>
                            </div>
                            <div className="text-sm">
                                <p className="text-gray-600">Activated Daybreak: {activatedCards.size}</p>
                            </div>
                        </div>
                        {renderBattlefield(myTeam, true)}
                    </div>
                </div>

                {/* Opponent Team Battlefield */}
                <div>
                    <h3 className="text-md font-medium text-red-600 mb-3 flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        Team {opponentTeam.teamNumber} (Opponent)
                    </h3>
                    <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-sm">
                                <p className="font-medium text-gray-700">Gold: {opponentTeam.gold}</p>
                                <p className="text-gray-600">Players: {opponentTeam.playerIds.length}</p>
                            </div>
                        </div>
                        {renderBattlefield(opponentTeam, false)}
                    </div>
                </div>
            </div>
        </div>
    );
}
