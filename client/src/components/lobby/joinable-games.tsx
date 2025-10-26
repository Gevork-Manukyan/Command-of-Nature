"use client";

import { useLobbyContext } from "@/contexts/LobbyContext";
import { ErrorMessage } from "../error/error-message";
import { LoadingSpinner } from "../loading/loading-spinner";
import { EmptyState } from "./empty-state";
import { GameCard } from "./game-card/game-card";
import { LoadingScreen } from "../loading/loading-screen";
import { ActiveGames } from "./active-games";

interface JoinableGamesProps {
    activeGames: Array<{ gameId: string }>;
}

export function JoinableGames({ activeGames }: JoinableGamesProps) {
    const { isFetchingGames, error, currentGames, isJoining } = useLobbyContext();

    return (
        <>
            <ActiveGames activeGames={activeGames} />
            <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Available Games
                </h2>
                {isFetchingGames ? (
                    <LoadingSpinner />
                ) : error ? (
                    <ErrorMessage message={error} />
                ) : !isFetchingGames && currentGames.length === 0 ? (
                    <EmptyState />
                ) : isJoining ? (
                    <LoadingScreen message="Joining game..." />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {currentGames.map((game) => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
