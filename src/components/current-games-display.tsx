"use client";

import { Game } from "@/lib/types";
import { useState, useEffect } from "react";

export default function CurrentGamesDisplay() {
  const [currentGames, setCurrentGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
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
    return (
      <section className="w-4/5 mx-[40px] mt-5 py-6 px-9 border-solid border-black border-2 rounded-md">
        <h2 className="mb-3">Game Lobbies</h2>
        <p>Loading games...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-4/5 mx-[40px] mt-5 py-6 px-9 border-solid border-black border-2 rounded-md">
        <h2 className="mb-3">Game Lobbies</h2>
        <p className="text-red-500">Error: {error}</p>
      </section>
    );
  }

  return (
    <section className="w-4/5 mx-[40px] mt-5 py-6 px-9 border-solid border-black border-2 rounded-md">
      <h2 className="mb-3">Game Lobbies</h2>
      {currentGames.length === 0 ? (
        <p>No active games found</p>
      ) : (
        <ol className="list-decimal flex flex-col gap-y-6">
          {currentGames.map((gameItem, index) => (
            <li key={gameItem.id} className="flex flex-col gap-2">
              <span>{`${index + 1}.) Game ID: ${gameItem.id}`}</span>
              <span>Room Code: {gameItem.roomCode}</span>
              <span>Players ({gameItem.players.length}):</span>
              <ul className="list-disc ml-4">
                {gameItem.players.map((player) => (
                  <li key={player.id}>{player.username}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
