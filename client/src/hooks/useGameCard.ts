import { useUserContext } from "@/contexts/UserContext";
import { socketService } from "@/services/socket.service";
import { useState } from "react";
import { GameListing } from "@command-of-nature/shared-types";

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
          await socketService.joinGame(userId, game.id, password);
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