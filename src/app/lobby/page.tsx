"use client";

import CurrentGamesDisplay from "@/components/game-display/current-games-display";
import { Lobby } from "@/components/lobby/lobby";
import { useGameState } from '@/hooks/useGameState';

export default function LobbyPage() {
  const {
    error,
    connectionError,
    currentSession,
    showModal,
    setShowModal,
    isCreatingGame,
    handleCreateGame,
    handleLogout,
    handleJoinGame,
  } = useGameState();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Lobby 
          error={error}
          connectionError={connectionError}
          currentSession={currentSession}
          showModal={showModal}
          setShowModal={setShowModal}
          isCreatingGame={isCreatingGame}
          handleCreateGame={handleCreateGame}
          handleLogout={handleLogout}
        />
        <CurrentGamesDisplay 
          error={error}
          handleJoinGame={handleJoinGame}
        />
      </div>
    </div>
  );
}
