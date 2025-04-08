"use client";

import { useState, useEffect } from "react";
import { Game } from "@/lib/types";
import { GameCard } from "./game-display/game-card";
import { LoadingSpinner } from "./game-display/loading-spinner";
import { ErrorMessage } from "./game-display/error-message";
import { EmptyState } from "./game-display/empty-state";

export default function CurrentGamesDisplay() {
  const [currentGames, setCurrentGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/games');
        
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        
        const data = await response.json();
        setCurrentGames(data);
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
