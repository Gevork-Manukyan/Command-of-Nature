import CurrentGamesDisplay from "@/components/current-games-display";
import Lobby from "@/components/lobby";

export default function LobbyPage() {
  return (
    <div className="h-[100vh] flex flex-col justify-center items-center">
      <Lobby />
      <CurrentGamesDisplay />
    </div>
  );
}
