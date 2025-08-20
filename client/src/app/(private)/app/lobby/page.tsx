import { redirect } from "next/navigation";
import { CreateGameModal } from "../../../../components/lobby/create-game/create-game-modal";
import { LogoutBtn } from "@/components/logout-btn";
import { CreateGameBtn } from "@/components/lobby/create-game/create-game-btn";
import { ActiveGames } from "@/components/lobby/active-games";
import { requireUserSession } from "@/lib/server/utils";
import { prisma } from "@/lib/server/prisma";

export default async function LobbyPage() {
    const session = await requireUserSession();

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { activeGameIds: true },
    })

    const currentGameId = user?.activeGameIds?.[0];

    if (currentGameId) {
        redirect(`/app/game/${currentGameId}`);
    }

    return (
        <>
            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Available Games
                    </h1>
                    <div className="flex gap-4">
                        <LogoutBtn />
                        <CreateGameBtn />
                    </div>
                </div>
            </div>

            <CreateGameModal />
            <ActiveGames />
        </>
    );
}
