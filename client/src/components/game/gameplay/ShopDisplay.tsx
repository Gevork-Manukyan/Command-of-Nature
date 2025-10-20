"use client";

import { GameStateData } from "@shared-types";

interface ShopDisplayProps {
    gameState: GameStateData;
}

export default function ShopDisplay({ gameState }: ShopDisplayProps) {
    const isMyTurn = gameState.activeTeamNumber === gameState.myTeam.teamNumber;
    
    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Shops</h2>
            <div className="space-y-4">
                {/* Creature Shop */}
                <div>
                    <h3 className="text-md font-medium text-green-600 mb-2 flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        Creature Shop
                    </h3>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        {gameState.creatureShop.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2">
                                {gameState.creatureShop.map((creature, index) => (
                                    <div 
                                        key={index}
                                        className="bg-white p-2 rounded border text-center"
                                    >
                                        <div className="w-full h-16 bg-gradient-to-br from-green-400 to-green-600 rounded mb-1 flex items-center justify-center text-white text-xs font-bold">
                                            {typeof creature === 'object' && creature.name ? creature.name.charAt(0) : '?'}
                                        </div>
                                        <p className="text-xs text-gray-600 truncate">
                                            {typeof creature === 'object' && creature.name ? creature.name : 'Creature'}
                                        </p>
                                        <p className="text-xs font-medium text-green-600">
                                            {typeof creature === 'object' && creature.price ? `${creature.price}G` : '?G'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600 text-center py-4">
                                No creatures available
                            </p>
                        )}
                    </div>
                </div>

                {/* Item Shop */}
                <div>
                    <h3 className="text-md font-medium text-purple-600 mb-2 flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        Item Shop
                    </h3>
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                        {gameState.itemShop.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2">
                                {gameState.itemShop.map((item, index) => (
                                    <div 
                                        key={index}
                                        className="bg-white p-2 rounded border text-center"
                                    >
                                        <div className="w-full h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded mb-1 flex items-center justify-center text-white text-xs font-bold">
                                            {typeof item === 'object' && item.name ? item.name.charAt(0) : '?'}
                                        </div>
                                        <p className="text-xs text-gray-600 truncate">
                                            {typeof item === 'object' && item.name ? item.name : 'Item'}
                                        </p>
                                        <p className="text-xs font-medium text-purple-600">
                                            {typeof item === 'object' && item.price ? `${item.price}G` : '?G'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600 text-center py-4">
                                No items available
                            </p>
                        )}
                    </div>
                </div>

                {/* Shop Actions */}
                {isMyTurn && (
                    <div className="pt-2 border-t border-gray-200">
                        <div className="flex gap-2">
                            <button 
                                className="flex-1 bg-green-500 text-white py-2 px-3 rounded text-sm hover:bg-green-600 disabled:opacity-50"
                                disabled={gameState.myTeam.gold < 1}
                            >
                                Buy Creature
                            </button>
                            <button 
                                className="flex-1 bg-purple-500 text-white py-2 px-3 rounded text-sm hover:bg-purple-600 disabled:opacity-50"
                                disabled={gameState.myTeam.gold < 1}
                            >
                                Buy Item
                            </button>
                            <button 
                                className="bg-gray-500 text-white py-2 px-3 rounded text-sm hover:bg-gray-600"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
