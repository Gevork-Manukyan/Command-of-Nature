import { useGameStateContext } from "@/contexts/GameStateContext";
import { useSetupActions } from "@/hooks/useSetupActions";
import { useIsHost } from "@/hooks/useIsHost";
import H3 from "../components/h3";
import NextPhaseButton from "../components/NextPhaseButton";

export default function JoiningGame() {
    const { gameState, isSetupState } = useGameStateContext();
    const { handleAllPlayersJoined } = useSetupActions();
    const isHost = useIsHost();
    
    // Derived state
    const setupState = isSetupState(gameState) ? gameState : null;
    const userPlayers = setupState?.userSetupData || [];
    const numPlayersTotal = setupState?.userSetupData.length || 0;
    
    return (
        <div>
            <H3>Waiting For Players...</H3>
            <div className="grid grid-cols-2 gap-8">
                {userPlayers.map((player) => (
                    <div key={player.username}>{player.username}</div>
                ))}
            </div>

            {isHost && handleAllPlayersJoined && (
                <NextPhaseButton 
                    onClick={handleAllPlayersJoined} 
                    disabled={userPlayers.length !== numPlayersTotal}
                >
                    All Players Joined
                </NextPhaseButton>
            )}
        </div>
    );
}