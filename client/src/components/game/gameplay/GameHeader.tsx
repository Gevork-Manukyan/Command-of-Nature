"use client";

import { GameStateData } from "@shared-types";

interface GameHeaderProps {
    gameState: GameStateData;
    gameName: string;
}

export default function GameHeader({ gameState, gameName }: GameHeaderProps) {
    const isMyTurn = gameState.activeTeamNumber === gameState.myTeam.teamNumber;
    
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {gameName}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className={`px-3 py-1 rounded-full ${isMyTurn ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {isMyTurn ? 'Your Turn' : 'Opponent Turn'}
                </div>
                <div className="text-gray-600">
                    <span className="font-medium">Phase:</span> {gameState.currentPhase}
                </div>
                <div className="text-gray-600">
                    <span className="font-medium">Active Team:</span> {gameState.activeTeamNumber}
                </div>
                <div className="text-gray-600">
                    <span className="font-medium">Action Points:</span> {gameState.actionPoints}/{gameState.maxActionPoints}
                </div>
                <div className="text-gray-600">
                    <span className="font-medium">My Team Gold:</span> {gameState.myTeam.gold}
                </div>
            </div>
        </div>
    );
}
