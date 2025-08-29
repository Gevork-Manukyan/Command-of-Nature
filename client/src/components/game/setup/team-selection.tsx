import { useGameSetupContext } from "@/contexts/GameSetupContext";

export default function TeamSelection() {
    const { handleTeamJoin } = useGameSetupContext();
    
    return (
        <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Teams</h3>
            <div className="grid grid-cols-2 gap-8">
                <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Team 1</h4>
                    
                    <button
                        onClick={() => handleTeamJoin(1)}
                        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Join Team 1
                    </button>
                </div>
                <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Team 2</h4>
                    <button
                        onClick={() => handleTeamJoin(2)}
                        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Join Team 2
                    </button>
                </div>
            </div>
        </div>
    );
}