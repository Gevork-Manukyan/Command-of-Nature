"use client";

import { useRouter } from "next/navigation";
import { CreateGameModal } from "./create-game-modal";
import { GameCard } from "./game-card";
import { LoadingSpinner } from "../../../../components/loading/loading-spinner";
import { ErrorMessage } from "../../../../components/error/error-message";
import { EmptyState } from "./empty-state";
import useLobby from "@/app/(private)/app/lobby/useLobby";
import { LoadingScreen } from "../../../../components/loading/loading-screen";
import { LogoutBtn } from "@/components/logout-btn";

export default function LobbyPage() {
  const router = useRouter();
  const {
    currentGameSession,
    currentGames,
    showModal,
    setShowModal,
    isFetchingGames,
    isJoining,
    setIsJoining,
    error,
  } = useLobby();

  const renderActiveGames = () => {
    if (isFetchingGames) {
      return <LoadingSpinner />;
    } else if (error) {
      return <ErrorMessage message={error} />;
    } else if (!isFetchingGames && currentGames.length === 0) {
      return <EmptyState />;
    } else {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {currentGames.map((game) => (
            <GameCard key={game.id} game={game} setIsJoining={setIsJoining} />
          ))}
        </div>
      );
    }
  };

  if (isJoining) {
    return <LoadingScreen message="Joining game..." />;
  }

  // If they're already in a game, show a message and a button to return to their game
  if (currentGameSession) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center bg-white rounded-xl shadow-lg">
        <div className="absolute top-4 right-4">
          <LogoutBtn />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          You&apos;re Already in a Game
        </h1>
        <p className="mb-6 text-gray-600">
          You are currently in game:{" "}
          <span className="font-mono bg-gray-100 px-3 py-1 rounded">
            {currentGameSession.id}
          </span>
        </p>
        <button
          onClick={() => router.push(`/game/${currentGameSession.id}`)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-md"
        >
          Return to Game
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800">
                Available Games
              </h1>
              <div className="flex gap-4">
                <LogoutBtn />
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-md"
                >
                  Create New Game
                </button>
              </div>
            </div>
          </div>

          <CreateGameModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            setIsJoining={setIsJoining}
          />

          {renderActiveGames()}
        </div>
      </div>
    </div>
  );
}
