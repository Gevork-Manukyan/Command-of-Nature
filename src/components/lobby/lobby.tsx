"use client";

import { useRouter } from 'next/navigation';
import { CreateGameModal } from './create-game-modal';
import { GameCard } from './game-display/game-card';
import { LoadingSpinner } from './game-display/loading-spinner';
import { ErrorMessage } from './game-display/error-message';
import { EmptyState } from './game-display/empty-state';
import useLobby from "@/hooks/useLobby";

export function Lobby() {
    const router = useRouter();
    const { currentSession, currentGames, showModal, setShowModal, isFetchingGames, error } = useLobby();

    const renderActiveGames = () => {
        if (isFetchingGames) {
            return <LoadingSpinner />
        } else if (error) {
            return <ErrorMessage message={error} />
        } else if (!isFetchingGames && currentGames.length === 0) {
            return <EmptyState />
        } else {
            return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {currentGames.map((game) => (
                    <GameCard
                        key={game.id}
                        game={game}
                    />
                ))}
            </div>
            )
        }
    }

    // If they're already in a game, show a message and a button to return to their game
    if (currentSession) {
        return (
            <div className="p-6 max-w-4xl mx-auto text-center bg-white rounded-xl shadow-lg">
                <div className="absolute top-4 right-4">
                    <button
                        onClick={() => router.push('/login')}
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
                            onClick={() => router.push('/login')}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
                        >
                            Logout
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-md"
                        >
                            Create New Game
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}
            </div>

            <CreateGameModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />

            {renderActiveGames()}
        </div>
    );
}