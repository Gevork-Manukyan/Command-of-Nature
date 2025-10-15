import { useGameSetupContext } from "@/contexts/GameSetupContext";
import H3 from "../components/h3";
import NextPhaseButton from "../components/NextPhaseButton";
import { Button } from "@/components/shadcn-ui/button";

export default function TeamSelection() {
    const { handleTeamJoin, isHost, handleAllTeamsJoined, numPlayersTotal, handleClearTeams, userPlayers } = useGameSetupContext();
    const teams = {
        1: userPlayers.filter((user) => user.team === 1),
        2: userPlayers.filter((user) => user.team === 2),
    }

    return (
        <>
        <H3>Teams</H3>
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-8">
                <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Team 1</h4>
                    
                    <Button
                        onClick={() => handleTeamJoin(1)}
                        className="variant-default"
                        disabled={numPlayersTotal / 2 <= teams[1].length}
                    >
                        Join Team 1
                    </Button>
                    {teams[1].map((user) => (
                        <div key={user.userId}>{user.username}</div>
                    ))}
                </div>
                <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Team 2</h4>
                    <Button
                        onClick={() => handleTeamJoin(2)}
                        className="variant-default"
                        disabled={numPlayersTotal / 2 <= teams[2].length}
                    >
                        Join Team 2
                    </Button>
                    {teams[2].map((user) => (
                        <div key={user.userId}>{user.username}</div>
                    ))}
                </div>
            </div>

            {isHost && handleAllTeamsJoined && (
                <div className="flex flex-row justify-center gap-4">
                    <Button onClick={handleClearTeams} variant="destructive">
                        Clear Teams
                    </Button>
                    <NextPhaseButton 
                        onClick={handleAllTeamsJoined} 
                        disabled={numPlayersTotal !== (teams[1].length + teams[2].length)}
                        >
                        All Teams Joined
                    </NextPhaseButton>
                </div>
            )}
        </div>
        </>
    );
}