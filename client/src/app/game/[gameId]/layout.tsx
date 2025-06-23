'use client';

import { useParams, useRouter } from 'next/navigation';
import { socketService } from '@/services/socket.service';
import { useGameSessionContext } from '@/contexts/GameSessionContext';

export default function GameLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { currentSession } = useGameSessionContext();
    const params = useParams();
    const gameId = params.gameId as string;
    const shortGameId = gameId.toString().slice(-6);

    const goToLobby = () => {
        router.push('/lobby');
    };

    const leaveGame = async () => {
        if (gameId) {
            await socketService.leaveGame(gameId);
            router.push('/lobby');
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <section className="h-24 flex flex-row items-center justify-around">
                <div>
                    <h1 className="text-4xl font-bold">Game: {currentSession?.gameName}</h1>
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
            {children}
        </div>
    );
} 