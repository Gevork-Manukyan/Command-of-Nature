"use client";

import { useLobbyContext } from "@/contexts/LobbyContext";
import { ErrorMessage } from "../error/error-message";
import { LoadingSpinner } from "../loading/loading-spinner";
import { EmptyState } from "./empty-state";
import { GameCard } from "./game-card/game-card";
import { LoadingScreen } from "../loading/loading-screen";

export function ActiveGames() {
    const { isFetchingGames, error, currentGames, isJoining } = useLobbyContext();
    
    if (isFetchingGames) {
        return <LoadingSpinner />;
    } else if (error) {
        return <ErrorMessage message={error} />;
    } else if (!isFetchingGames && currentGames.length === 0) {
        return <EmptyState />;
    }

    if (isJoining) {
        return <LoadingScreen message="Joining game..." />;
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {currentGames.map((game) => (
                <GameCard
                    key={game.id}
                    game={game}
                />
            ))}
        </div>
    )
}