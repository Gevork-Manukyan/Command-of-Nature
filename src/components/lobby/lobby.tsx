"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { CreateGameModal } from './create-game-modal';
import { GameCard } from './game-display/game-card';
import { LoadingSpinner } from './game-display/loading-spinner';
import { ErrorMessage } from './game-display/error-message';
import { EmptyState } from './game-display/empty-state';
import { apiClient } from "@/lib/client/api-client";
import { GameListing } from '@command-of-nature/shared-types';
import useLobby from "@/hooks/useLobby";

interface LobbyProps {
    error: string;
    connectionError: string;
    currentSession: GameListing | null;
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    isCreatingGame: boolean;
    handleCreateGame: (settings: GameSettings) => Promise<void>;
    handleLogout: () => Promise<void>;
    handleJoinGame: (gameId: string, password?: string) => Promise<void>;
}

interface GameSettings {
    numPlayers: number;
    gameName: string;
    isPrivate: boolean;
    password?: string;
}

export function Lobby({
    error,
    connectionError,
    currentSession,
    showModal,
    setShowModal,
    isCreatingGame,
    handleCreateGame,
    handleLogout,
    handleJoinGame,
}: LobbyProps) {
    const router = useRouter();
    const { currentGames, isLoading } = useLobby();

    // If they're already in a game, show a message and a button to return to their game
    if (currentSession) {
        return (
            <div className="p-6 max-w-4xl mx-auto text-center bg-white rounded-xl shadow-lg">
                <div className="absolute top-4 right-4">
                    <button
                        onClick={handleLogout}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
                    >
                        Logout
                    </button>
                </div>
                <h1 className="text-4xl font-bold mb-4 text-gray-800">You&apos;re Already in a Game</h1>
                <p className="mb-6 text-gray-600">You are currently in game: <span className="font-mono bg-gray-100 px-3 py-1 rounded">{currentSession.id}</span></p>
                <button
                    onClick={() => router.push(`/game/${currentSession.id}`)}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-md"
                >
                    Return to Game
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Available Games</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={handleLogout}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
                        >
                            Logout
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            disabled={isCreatingGame}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isCreatingGame ? 'Creating Game...' : 'Create New Game'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}
                {connectionError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                        {connectionError}
                    </div>
                )}
            </div>

            <CreateGameModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onCreateGame={handleCreateGame}
                isCreatingGame={isCreatingGame}
            />

            {isLoading ? (
                <LoadingSpinner />
            ) : error ? (
                <ErrorMessage message={error} />
            ) : currentGames.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {currentGames.map((game) => (
                        <GameCard
                            key={game.id}
                            game={game}
                            onJoin={handleJoinGame}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}