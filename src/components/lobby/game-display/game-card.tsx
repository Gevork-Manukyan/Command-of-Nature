import { socketService } from "@/services/socket.service";
import { useUserContext } from "@/contexts/UserContext";
import { GameListing } from "@command-of-nature/shared-types";  
import { useState } from "react";

interface GameCardProps {
  game: GameListing;
}

export const GameCard = ({ game }: GameCardProps) => {
  const { userId } = useUserContext();
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const shortGameId = game.id.toString().slice(-6);
  const [isJoining, setIsJoining] = useState(false);

  const joinGame = async (gameId: string, password?: string) => {
    if (!userId) throw new Error('User ID not found');

    try {
        setIsJoining(true);

        if (!socketService.getConnected()) {
            await socketService.connect();
        }

        await socketService.joinGame(userId, gameId, password);
    } catch (err) {
        console.error('Failed to join game:', err);
    } finally {
        setIsJoining(false);
    }
  };

  const handleJoinClick = () => {
    if (game.isPrivate && !showPasswordInput) {
      setShowPasswordInput(true);
      return;
    }
    joinGame(game.id, game.isPrivate ? password : undefined);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono bg-gray-100 px-3 py-1 rounded text-gray-700">
              #{shortGameId}
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
      {showPasswordInput && (
        <div className="mt-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter game password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
      <button 
        onClick={handleJoinClick} 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
      >
        {showPasswordInput ? "Submit" : "Join Game"}
      </button>
    </div>
  );
}; 