import { useUserContext } from "@/contexts/UserContext";
import { useState } from "react";
import { GameListing } from "@shared-types";
import { gameApiClient } from "@/services/game-api";

export function useGameCard(game: GameListing, setIsJoining: (isJoining: boolean) => void) {
    const { userId } = useUserContext();
    const [password, setPassword] = useState("");
    const [showPasswordInput, setShowPasswordInput] = useState(false);
  
    const handleJoinClick = async () => {
      if (game.isPrivate && !showPasswordInput) {
        setShowPasswordInput(true);
        return;
      }
  
      if (!userId) throw new Error('User ID not found');
  
      try {
          setIsJoining(true);
          await gameApiClient.joinGame({ userId, gameId: game.id, password: password || undefined });
      } catch (err) {
          console.error('Failed to join game:', err);
          setIsJoining(false);
      }
    };

    return {
        handleJoinClick,
        showPasswordInput,
        setShowPasswordInput,
        password,
        setPassword,
    }
}