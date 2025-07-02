import { useUserContext } from "@/contexts/UserContext";
import { useState } from "react";
import { GameListing } from "@shared-types";
import { gameApiClient } from "@/services/game-api";
import { useGameSessionContext } from "@/contexts/GameSessionContext";

export function useGameCard(game: GameListing, setIsJoining: (isJoining: boolean) => void) {
    const { userId } = useUserContext();
    const [password, setPassword] = useState("");
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const { updateCurrentSession } = useGameSessionContext();

    const handleJoinClick = async () => {
      if (game.isPrivate && !showPasswordInput) {
        setShowPasswordInput(true);
        return;
      }
  
      if (!userId) throw new Error('User ID not found');
  
      try {
          setIsJoining(true);
          const response = await gameApiClient.joinGame({ userId, gameId: game.id, password: password || undefined });
          if (response.error) {
            throw new Error(response.error);
          } else {
            updateCurrentSession(response);
          }
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