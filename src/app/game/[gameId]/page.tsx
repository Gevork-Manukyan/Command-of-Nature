"use client";

import { useGameInstance } from "@/hooks/useGameInstance";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ErrorScreen } from "@/components/ErrorScreen";

export default function GamePage() {
    const { router, error, session, shortGameId, handleToLobby, handleLeaveGame, isRejoining } = useGameInstance();

    if (isRejoining) {
        return <LoadingScreen message="Rejoining game..." />;
    }

    if (error) {
        return <ErrorScreen message={error} />;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Game Room: {shortGameId}</h1>
                <div className="flex gap-4">
                    <button
                        onClick={handleToLobby}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                        To Lobby
                    </button>
                    <button
                        onClick={handleLeaveGame}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                        Leave Game
                    </button>
                </div>
            </div>
            
            <div className="mb-4">
                <p>Players needed: {session?.numPlayersTotal}</p>
            </div>

            {/* Add your game UI components here */}
            <div className="border rounded p-4">
                <h2 className="text-xl font-bold mb-4">Game Area</h2>
                <p className="text-gray-500">Game interface will be implemented here</p>
            </div>
        </div>
    );
} 