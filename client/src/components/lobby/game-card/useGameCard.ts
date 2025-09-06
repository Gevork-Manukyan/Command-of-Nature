"use client";

import { useState } from "react";
import { GameListing } from "@shared-types";
import { joinGame } from "@/services/game-api";
import { useGameSessionContext } from "@/contexts/GameSessionContext";
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
    const { updateCurrentSession } = useGameSessionContext();
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
            updateCurrentSession(response);
        } catch (err: any) {
            console.log("Error in handleJoinClick:", err);
            if (err.status == 422 && err.field === "password") {
                toast.error(
                    err.message || "Incorrect password. Please try again."
                );
                setPassword("");
                setShowPasswordInput(true);
            } else if (err.errorCode === "NOT_FOUND") {
                toast.error("This game no longer exists or has been deleted.");
                refreshGames();
            } else if (
                err.errorCode === "CONFLICT_ERROR" &&
                err.message?.includes("full")
            ) {
                toast.error(
                    "This game is already full and cannot accept more players."
                );
                refreshGames();
            } else if (
                err.errorCode === "CONFLICT_ERROR" &&
                err.message?.includes("started")
            ) {
                toast.error(
                    "This game has already started and cannot accept new players."
                );
                refreshGames();
            } else if (
                err.errorCode === "VALIDATION_ERROR" &&
                err.field === "userId"
            ) {
                toast.error("You are already in this game.");
            } else {
                toast.error(
                    err.message || "Failed to join game. Please try again."
                );
                refreshGames();
            }
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
