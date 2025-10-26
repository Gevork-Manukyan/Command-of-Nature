"use client";
import H3 from "../components/h3";
import { Button } from "@/components/shadcn-ui/button";
import { useGameStateContext } from "@/contexts/GameStateContext";
import { useSetupActions } from "@/hooks/useSetupActions";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ErrorScreen } from "@/components/error/error-screen";
import NextPhaseButton from "../components/NextPhaseButton";

export default function ReadyUp() {
    const { gameState, isSetupState, isHost } = useGameStateContext();
    const { handleToggleReady, handleAllPlayersReady } = useSetupActions();
    const userId = useCurrentUser();
    
    // Derived state
    const setupState = isSetupState(gameState) ? gameState : null;
    const userPlayers = setupState?.userSetupData || [];
    const userSetupData = userPlayers.find((user) => user.userId === userId);
    const otherPlayers = userPlayers.filter((user) => user.userId !== userId);

    if (!userSetupData) {
        return <ErrorScreen message="User setup data not found" />;
    }

    return (
        <>
        <div className="mb-4">
            <H3>Players</H3>
            {otherPlayers.map((user) => (
                <div key={user.userId}>{user.username} - {user.isReady ? "Ready" : "Not Ready"}</div>
            ))}
        </div>
        <div>
            <H3>Ready Up</H3>
            <p>Sage: {userSetupData?.sage}</p>
            <p>Team: {userSetupData?.team}</p>
            <p>Is Ready: {userSetupData?.isReady ? "Yes" : "No"}</p>
            <Button onClick={handleToggleReady}>Toggle Ready</Button>
        </div>
        {isHost && handleAllPlayersReady && (
            <NextPhaseButton 
                onClick={handleAllPlayersReady} 
                disabled={!(userPlayers.every((user) => user.isReady))}
            >
                Start Game
            </NextPhaseButton>
        )}
        </>
    );
}
