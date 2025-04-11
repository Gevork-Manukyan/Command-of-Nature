"use client";

import { useState, useEffect } from "react";
import { Game } from "@/lib/types";
import { GameCard } from "./game-card";
import { LoadingSpinner } from "./loading-spinner";
import { ErrorMessage } from "./error-message";
import { EmptyState } from "./empty-state";
import { apiClient } from "@/lib/client/api-client";

export default function CurrentGamesDisplay() {
  const [currentGames, setCurrentGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.getAllNewGames<Game[]>();
        
        if (response.error) {
          throw new Error(response.error);
        }

        setCurrentGames(response.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
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
    <div className="grid gap-6">
      {currentGames.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
