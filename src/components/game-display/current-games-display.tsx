"use client";

import { useState, useEffect } from "react";
import { GameCard } from "./game-card";
import { LoadingSpinner } from "./loading-spinner";
import { ErrorMessage } from "./error-message";
import { EmptyState } from "./empty-state";
import { apiClient } from "@/lib/client/api-client";
import { GameListing } from "@command-of-nature/shared-types";

interface CurrentGamesDisplayProps {
  error: string;
  handleJoinGame: (gameId: string, password?: string) => Promise<void>;
}

export default function CurrentGamesDisplay({ error, handleJoinGame }: CurrentGamesDisplayProps) {
  const [currentGames, setCurrentGames] = useState<GameListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.getAllNewGames();
        
        if (response.error) {
          throw new Error(response.error);
        }

        setCurrentGames(response.data || []);
      } catch (err) {
        console.error('Failed to fetch games:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (currentGames.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {currentGames.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          onJoin={handleJoinGame}
        />
      ))}
    </div>
  );
}
