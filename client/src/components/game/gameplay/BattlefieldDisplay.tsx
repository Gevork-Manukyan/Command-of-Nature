"use client";

import { GameStateData } from "@shared-types";

interface BattlefieldDisplayProps {
    gameState: GameStateData;
}

export default function BattlefieldDisplay({ gameState }: BattlefieldDisplayProps) {
    const myTeam = gameState.myTeam;
    const opponentTeam = gameState.teams.find(t => t.teamNumber !== myTeam.teamNumber);
    
    if (!opponentTeam) return null;

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Battlefield</h2>
            <div className="space-y-6">
                {/* My Team Battlefield */}
                <div>
                    <h3 className="text-md font-medium text-blue-600 mb-3 flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        Team {myTeam.teamNumber} (Your Team)
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-sm">
                                <p className="font-medium text-gray-700">Gold: {myTeam.gold}</p>
                                <p className="text-gray-600">Players: {myTeam.playerIds.length}</p>
                            </div>
                            <div className="text-sm">
                                <p className="text-gray-600">Battlefield spaces will be displayed here</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {JSON.stringify(myTeam.battlefield).length > 50 
                                        ? 'Battlefield data available' 
                                        : 'No battlefield data'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Opponent Team Battlefield */}
                <div>
                    <h3 className="text-md font-medium text-red-600 mb-3 flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        Team {opponentTeam.teamNumber} (Opponent)
                    </h3>
                    <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-sm">
                                <p className="font-medium text-gray-700">Gold: {opponentTeam.gold}</p>
                                <p className="text-gray-600">Players: {opponentTeam.playerIds.length}</p>
                            </div>
                            <div className="text-sm">
                                <p className="text-gray-600">Battlefield spaces will be displayed here</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {JSON.stringify(opponentTeam.battlefield).length > 50 
                                        ? 'Battlefield data available' 
                                        : 'No battlefield data'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
