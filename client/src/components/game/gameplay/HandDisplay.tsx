"use client";

import { PlayerGameData } from "@shared-types";

interface HandDisplayProps {
    players: PlayerGameData[];
    currentUserId: string;
}

export default function HandDisplay({ players, currentUserId }: HandDisplayProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Team Hands</h2>
            <div className="space-y-3">
                {players.map((player, index) => (
                    <div key={player.userId} className="bg-gray-50 p-3 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                    {player.userId === currentUserId ? 'You' : `Teammate ${index + 1}`}
                                </span>
                                {player.sage && (
                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                        {player.sage}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-gray-500">
                                Level {player.level}
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                            <div className="text-center">
                                <p className="font-medium">{player.hand.length}</p>
                                <p className="text-gray-500">Hand</p>
                            </div>
                            <div className="text-center">
                                <p className="font-medium">{player.deckCount}</p>
                                <p className="text-gray-500">Deck</p>
                            </div>
                            <div className="text-center">
                                <p className="font-medium">{player.discardCount}</p>
                                <p className="text-gray-500">Discard</p>
                            </div>
                        </div>
                        
                        {/* Hand cards preview */}
                        {player.hand.length > 0 && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1">Hand Cards:</p>
                                <div className="flex gap-1 flex-wrap">
                                    {player.hand.slice(0, 5).map((card, cardIndex) => (
                                        <div 
                                            key={cardIndex} 
                                            className="w-8 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded text-white text-xs flex items-center justify-center font-bold"
                                            title={typeof card === 'object' && card.name ? card.name : 'Card'}
                                        >
                                            {typeof card === 'object' && card.name ? card.name.charAt(0) : '?'}
                                        </div>
                                    ))}
                                    {player.hand.length > 5 && (
                                        <div className="w-8 h-12 bg-gray-400 rounded text-white text-xs flex items-center justify-center font-bold">
                                            +{player.hand.length - 5}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
