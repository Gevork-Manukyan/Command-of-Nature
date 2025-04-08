import { Game } from "@/lib/types";

interface GameCardProps {
  game: Game;
}

export const GameCard = ({ game }: GameCardProps) => (
  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono bg-gray-100 px-3 py-1 rounded text-gray-700">
            Game ID: {game.id}
          </span>
          <span className="font-mono bg-indigo-100 px-3 py-1 rounded text-indigo-700">
            Room Code: {game.roomCode}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {game.players.length} players
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {game.players.map((player) => (
          <span
            key={player.id}
            className="bg-gray-50 px-3 py-1 rounded-full text-sm text-gray-700"
          >
            {player.username}
          </span>
        ))}
      </div>
    </div>
  </div>
); 