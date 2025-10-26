"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGameNavigation } from "@/hooks/useGameNavigation";
import { LoadingScreen } from "@/components/loading/loading-screen";
import { ErrorScreen } from "@/components/error/error-screen";
import { useSocketContext } from "@/contexts/SocketContext";
import { useSession } from "next-auth/react";
import { isUserInGame } from "@/actions/user-actions";
import { GameStateProvider } from "@/contexts/GameStateContext";
import { exitGame } from "@/services/game-api";

export default function GameLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const userId = session?.user.id!;
    const { isSocketConnected } = useSocketContext();
    const gameId = params.gameId as string;
    const {
        isLeaving,
        goToLobby,
        leaveGame,
    } = useGameNavigation({ userId });
    const shortGameId = gameId.toString().slice(-6);

    // Game membership verification
    const [isVerifyingMembership, setIsVerifyingMembership] = useState(true);
    const [membershipError, setMembershipError] = useState<string>("");
    const [gameSession, setGameSession] = useState<any>(null);

    // Verify user membership in game
    useEffect(() => {
        if (!userId || !gameId) return;

        const verifyMembership = async () => {
            try {
                setIsVerifyingMembership(true);
                setMembershipError("");
                
                const userGame = await isUserInGame(userId, gameId);
                if (userGame) {
                    setGameSession(userGame);
                } else {
                    router.push('/app/lobby');
                    return;
                }
            } catch (err) {
                console.error("Failed to verify game membership:", err);
                setMembershipError(
                    err instanceof Error ? err.message : "Failed to verify game membership"
                );
            } finally {
                setIsVerifyingMembership(false);
            }
        };

        verifyMembership();

        // Cleanup: Exit game when component unmounts (user leaves game pages)
        return () => {
            if (userId && gameId) {
                exitGame(gameId, { userId }).catch(err => {
                    console.error("Failed to exit game on unmount:", err);
                });
            }
        };
    }, [userId, gameId, router]);

    // Handle loading states
    if (isVerifyingMembership) {
        return <LoadingScreen message={"Verifying game access..."} />;
    }

    if (isLeaving) {
        return <LoadingScreen message="Leaving game..." />;
    }

    // Handle error states
    if (membershipError) {
        return <ErrorScreen message={membershipError} />;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <section className="h-24 flex flex-row items-center justify-around">
                <div>
                    <h1 className="text-4xl font-bold">
                        Game: {gameSession?.gameName}
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
            <GameStateProvider gameId={gameId} userId={userId}>
                {children}
            </GameStateProvider>
        </div>
    );
}
