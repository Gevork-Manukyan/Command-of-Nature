"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGameNavigation } from "@/hooks/useGameNavigation";
import { useGameSessionContext } from "@/contexts/GameSessionContext";
import { LoadingScreen } from "@/components/loading/loading-screen";
import { ErrorScreen } from "@/components/error/error-screen";
import { useSocketContext } from "@/contexts/SocketContext";
import { useSession } from "next-auth/react";
import { verifySession } from "@/services/game-api";
import { isUserInGame } from "@/actions/user-actions";
import { CurrentPhaseProvider } from "@/contexts/CurrentPhaseContext";

export default function GameLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const { data: session } = useSession();
    const userId = session?.user.id!;
    const { isSocketConnected } = useSocketContext();
    const { currentGameSession, isLoadingGameSession, updateCurrentSession } = useGameSessionContext();
    const gameId = params.gameId === currentGameSession?.id ? currentGameSession?.id : "";
    const {
        isLeaving,
        goToLobby,
        leaveGame,
    } = useGameNavigation(gameId, userId);
    const shortGameId = gameId.toString().slice(-6);

    // Rejoin game state
    const [isRejoiningGame, setIsRejoiningGame] = useState(false);
    const [rejoinError, setRejoinError] = useState<string>("");

    // Handle game session verification - server auto-rejoins on socket connection
    useEffect(() => {
        if (!userId || !isSocketConnected) return;

        const checkIfUserInGame = async (userId: string, gameId: string) => {
            try {
                setIsRejoiningGame(true);
                setRejoinError("");
                const playerGame = await isUserInGame(userId, gameId);
                if (playerGame) {
                    updateCurrentSession(playerGame);
                } else {
                    await verifySession({ userId, gameId });
                    updateCurrentSession(null);
                }
                setIsRejoiningGame(false);
            } catch (err) {
                console.error("Failed to verify game session:", err);
                setRejoinError(
                    err instanceof Error ? err.message : "Failed to verify game session"
                );
                setIsRejoiningGame(false);
            }
        };

        if (!currentGameSession && !isLoadingGameSession && gameId) {
            checkIfUserInGame(userId, gameId);
        }
    }, [userId, currentGameSession, isSocketConnected, gameId]);

    // Handle loading states
    if (isLoadingGameSession) {
        return <LoadingScreen message={"Loading game..."} />;
    }

    if (isRejoiningGame) {
        return <LoadingScreen message="Rejoining game..." />;
    }

    if (isLeaving) {
        return <LoadingScreen message="Leaving game..." />;
    }

    // Handle error states
    if (rejoinError) {
        return <ErrorScreen message={rejoinError} />;
    }

    if (!(isLeaving || isRejoiningGame) && !currentGameSession) {
        return (
            <div className="flex flex-col min-h-screen">
                <ErrorScreen message="Game session not found" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <section className="h-24 flex flex-row items-center justify-around">
                <div>
                    <h1 className="text-4xl font-bold">
                        Game: {currentGameSession?.gameName}
                    </h1>
                    <p className="text-xl">Game ID: {shortGameId}</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={goToLobby}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Back to Lobby
                    </button>
                    <button
                        onClick={leaveGame}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Leave Game
                    </button>
                </div>
            </section>
            <CurrentPhaseProvider>
                {children}
            </CurrentPhaseProvider>
        </div>
    );
}
