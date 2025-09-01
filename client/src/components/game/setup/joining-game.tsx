import { useGameSetupContext } from "@/contexts/GameSetupContext";
import H3 from "./components/h3";

export default function JoiningGame() {
    const { userPlayers } = useGameSetupContext();
    
    return (
        <div>
            <H3>Waiting For Players...</H3>
            <div className="grid grid-cols-2 gap-8">
                {userPlayers.map((player) => (
                    <div key={player.username}>{player.username}</div>
                ))}
            </div>
        </div>
    );
}