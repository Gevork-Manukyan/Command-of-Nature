"use client";

import { Game } from "@/lib/types";
import { useState } from "react";

export default function CurrentGamesDisplay() {
  const [currentGames, setCurrentGames] = useState<Game[]>([]);


  return (
    <section className="w-4/5 mx-[40px] mt-5 py-6 px-9 border-solid border-black border-2 rounded-md">
      <h2 className="mb-3">Game Lobbies</h2>
      <ol className="list-decimal flex flex-col gap-y-6">
        {currentGames.map((gameItem, index) => (
          <li key={gameItem.id} className="flex flex-col">
            <span>{`${index + 1}.) Game ID: ${gameItem.id}`}</span>
            <span>Players</span>
            <ul>
              {gameItem.players.map((player) => (
                <li key={player}>{player}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
