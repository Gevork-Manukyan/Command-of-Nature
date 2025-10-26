"use client";

import { useRouter } from "next/navigation";

interface ActiveGamesProps {
    activeGames: Array<{ gameId: string }>;
}

export function ActiveGames({ activeGames }: ActiveGamesProps) {
    const router = useRouter();

    if (activeGames.length === 0) {
        return null;
    }

    const handleRejoinGame = (gameId: string) => {
        router.push(`/app/game/${gameId}`);
    };

    return (
        <div className="bg-blue-50 rounded-xl shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">
                My Active Games ({activeGames.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeGames.map((userGame) => (
                    <div
                        key={userGame.gameId}
                        className="bg-white rounded-lg p-4 border border-blue-200 hover:border-blue-400 transition-colors cursor-pointer"
                        onClick={() => handleRejoinGame(userGame.gameId)}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    Game {userGame.gameId.slice(-6)}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Click to rejoin
                                </p>
                            </div>
                            <div className="text-blue-600">
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
