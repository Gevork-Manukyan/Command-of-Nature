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
            #{game.id.slice(-6)}
          </span>
          <span className="text-sm text-gray-500">
            {game.isPrivate ? "🔒 Private" : "🔓 Public"}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {game.numCurrentPlayers}/{game.numPlayersTotal} players
        </span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{game.gameName}</h3>
    </div>
  </div>
); 