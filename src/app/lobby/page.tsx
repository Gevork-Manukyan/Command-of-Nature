import CurrentGamesDisplay from "@/components/game-display/current-games-display";
import { Lobby } from "@/components/lobby/lobby";

export default function LobbyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Lobby />
        <CurrentGamesDisplay />
      </div>
    </div>
  );
}
