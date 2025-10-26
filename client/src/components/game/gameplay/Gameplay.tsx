"use client";

import { useGameStateContext } from "@/contexts/GameStateContext";
import { useSession } from "next-auth/react";
import { LoadingScreen } from "@/components/loading/loading-screen";
import { ErrorScreen } from "@/components/error/error-screen";
import GameHeader from "./GameHeader";
import BattlefieldDisplay from "./BattlefieldDisplay/BattlefieldDisplay";
import HandDisplay from "./HandDisplay";
import ShopDisplay from "./ShopDisplay";
import ActionPanel from "./ActionPanel";

export default function Gameplay() {
    const { gameState, isLoading, error, isGameplayState } = useGameStateContext();
    const { data: session } = useSession();

    if (isLoading) return <LoadingScreen />;
    if (error) return <ErrorScreen message={error} />;
    if (!gameState || !isGameplayState(gameState)) return <ErrorScreen message="No game state available" />;
    if (!session?.user?.id) return <ErrorScreen message="User not authenticated" />;

    const handleAction = (action: string) => {
        console.log('Action triggered:', action);
        // TODO: Implement action handling
    };

    return (
        <div className="gameplay-container min-h-screen bg-gray-100 p-4">
            <div className="max-w-7xl mx-auto">
                <GameHeader 
                    gameState={gameState} 
                    gameName={gameState.gameId}
                />

                {/* Main Game Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Battlefield Area */}
                    <div className="lg:col-span-2">
                        <BattlefieldDisplay gameState={gameState} />
                    </div>

                    {/* Side Panel */}
                    <div className="space-y-4">
                        <HandDisplay 
                            players={gameState.myTeamPlayers} 
                            currentUserId={session.user.id} 
                        />
                        <ShopDisplay gameState={gameState} />
                        <ActionPanel 
                            gameState={gameState} 
                            onAction={handleAction} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}