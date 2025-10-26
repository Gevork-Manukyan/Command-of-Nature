"use client";

import { useState } from "react";
import { GameListing } from "@shared-types";
import { joinGame } from "@/services/game-api";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useLobbyContext } from "@/contexts/LobbyContext";

export function useGameCard(
    game: GameListing,
    setIsJoining: (isJoining: boolean) => void
) {
    const { data: session } = useSession();
    const userId = session?.user.id!;
    const [password, setPassword] = useState("");
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const { refreshGames } = useLobbyContext();
    const router = useRouter();

    const handleJoinClick = async () => {
        if (game.isPrivate && !showPasswordInput) {
            setShowPasswordInput(true);
            return;
        }

        if (!userId) throw new Error("User ID not found");

        try {
            setIsJoining(true);
            const response = await joinGame({
                userId,
                gameId: game.id,
                password: password || undefined,
            });
            router.push(`/app/game/${response.id}`);
        }  catch (err) {
            toast.error('This game no longer exists or is no longer available.');
            refreshGames();
        } finally {
            setIsJoining(false);
        }
    };

    return {
        handleJoinClick,
        showPasswordInput,
        setShowPasswordInput,
        password,
        setPassword,
    };
}
