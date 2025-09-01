import { useGameSetupContext } from "@/contexts/GameSetupContext";
import H3 from "./components/h3";
import NextPhaseButton from "./components/NextPhaseButton";

export default function JoiningGame() {
    const { userPlayers, isHost, handleAllPlayersJoined } = useGameSetupContext();
    
    return (
        <div>
            <H3>Waiting For Players...</H3>
            <div className="grid grid-cols-2 gap-8">
                {userPlayers.map((player) => (
                    <div key={player.username}>{player.username}</div>
                ))}
            </div>

            {isHost && handleAllPlayersJoined && (
                <NextPhaseButton onClick={handleAllPlayersJoined} disabled={false}>
                    All Players Joined
                </NextPhaseButton>
            )}
        </div>
    );
}