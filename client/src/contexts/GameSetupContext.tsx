"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { socketService } from "@/services/socket";
import { useGameSessionContext } from "@/contexts/GameSessionContext";
import {
    Sage,
    SageSelectedEvent,
    AllSagesSelectedEvent,
    ClearTeamsEvent,
    AllTeamsJoinedEvent,
    StartGameEvent,
    SwapWarriorsEvent,
    PlayerFinishedSetupEvent,
    CancelSetupEvent,
    AllPlayersSetupEvent,
    ReadyStatusToggledEvent,
    TeamJoinedEvent,
    PickWarriorsEvent,
    SageSelectedData,
    sageSelectedSchema,
    State,
    PlayerJoinedEvent,
    PlayerJoinedData,
    playerJoinedSchema,
    PlayerLeftData,
    playerLeftSchema,
    PlayerLeftEvent,
    AllPlayersJoinedEvent,
    NextStateData,
    NextStateDataSchema,
    TeamJoinedData,
    teamJoinedSchema,
    TeamsClearedData,
    teamsClearedSchema,
} from "@shared-types";
import {
    allPlayersJoined,
    allSagesSelected,
    allTeamsJoined,
    clearTeams,
    getCurrentPhase,
    getCurrentUsers,
    getSelectedSages,
    getTeams,
    joinTeam,
    selectSage,
} from "@/services/game-api";
import { useSession } from "next-auth/react";
import { isPlayerHostOfGame } from "@/actions/game-actions";
import { UserProfile } from "@shared-types";

type Teams = {
    [key in 1 | 2]: UserProfile[];
};

type GameSetupContextType = {
    error: string;
    numPlayersTotal: number;
    currentPhase: State | null;
    isHost: boolean;
    selectedSage: Sage | null;
    availableSages: { [key in Sage]: boolean };
    userPlayers: UserProfile[];
    teams: Teams;
    handleAllPlayersJoined: () => Promise<void>;
    fetchSelectedSages: () => Promise<void>;
    handleSageConfirm: (sage: Sage) => Promise<void>;
    handleAllSagesSelected: () => Promise<void>;
    handleTeamJoin: (team: 1 | 2) => Promise<void>;
    handleClearTeams: () => Promise<void>;
    handleAllTeamsJoined: () => Promise<void>;
};

const GameSetupContext = createContext<GameSetupContextType | undefined>(
    undefined
);

type GameSetupProviderProps = {
    children: React.ReactNode;
};

function getUpdatedTeamProfiles(
    userPlayers: UserProfile[],
    updatedTeams: { [key in 1 | 2]: string[] }
) {
    return {
        1: updatedTeams[1].map(
            (userId) => userPlayers.find((user) => user.userId === userId)!
        ),
        2: updatedTeams[2].map(
            (userId) => userPlayers.find((user) => user.userId === userId)!
        ),
    };
}

export function GameSetupProvider({ children }: GameSetupProviderProps) {
    const router = useRouter();
    const { currentGameSession } = useGameSessionContext();
    const [isHost, setIsHost] = useState(false);
    const [error, setError] = useState<string>("");
    const { data: session } = useSession();
    const gameId = currentGameSession?.id || "";
    const numPlayersTotal = currentGameSession?.numPlayersTotal || 0;
    const userId = session?.user.id!;

    // Game Related State
    const [userPlayers, setUserPlayers] = useState<UserProfile[]>([]);
    const [currentPhase, setCurrentPhase] = useState<State | null>(null);
    const [selectedSage, setSelectedSage] = useState<Sage | null>(null);
    const [availableSages, setAvailableSages] = useState<{
        [key in Sage]: boolean;
    }>({
        Cedar: true,
        Gravel: true,
        Porella: true,
        Torrent: true,
    });
    const [teams, setTeams] = useState<Teams>({
        1: [],
        2: [],
    });

    // Fetch the current phase and states
    useEffect(() => {
        const fetchSetupData = async () => {
            const currentUsers = await getCurrentUsers(gameId);
            setUserPlayers(currentUsers);

            const updatedTeams = await getTeams(gameId);
            const updatedTeamProfiles = getUpdatedTeamProfiles(
                currentUsers,
                updatedTeams
            );
            setTeams(updatedTeamProfiles);
        };
        fetchSetupData();

        const fetchCurrentPhase = async () => {
            const currentPhase = await getCurrentPhase(gameId);
            setCurrentPhase(currentPhase);
        };
        fetchCurrentPhase();
    }, [gameId]);

    // Check if user is the host
    useEffect(() => {
        const checkIsHost = async () => {
            if (!userId || !currentGameSession) return;
            const isHost = await isPlayerHostOfGame(
                userId,
                currentGameSession.id
            );
            setIsHost(isHost);
        };
        checkIsHost();
    }, [currentGameSession, userId]);

    // Setup socket event listeners for game setup - these are the handlers for the events that are emitted by the server
    useEffect(() => {
        if (!currentGameSession) return;

        // -------------- SOCKET EVENT HANDLERS --------------
        const handleSocketPlayerJoined = (data: PlayerJoinedData) => {
            const validatedData = playerJoinedSchema.parse(data);
            setUserPlayers(validatedData.updatedUsers);
        };

        const handleSocketPlayerLeft = (data: PlayerLeftData) => {
            const validatedData = playerLeftSchema.parse(data);
            setUserPlayers(validatedData.updatedUsers);
        };

        const handleSocketAllPlayersJoined = (data: NextStateData) => {
            const validatedData = NextStateDataSchema.parse(data);
            setCurrentPhase(validatedData.nextState);
        };

        const handleSocketSageSelected = (data: SageSelectedData) => {
            const parsedData = sageSelectedSchema.parse(data);
            setAvailableSages(parsedData.availableSages);
        };

        const handleSocketAllSagesSelected = (data: NextStateData) => {
            const validatedData = NextStateDataSchema.parse(data);
            setCurrentPhase(validatedData.nextState);
        };

        const handleSocketTeamJoined = (data: TeamJoinedData) => {
            const validatedData = teamJoinedSchema.parse(data);
            const updatedTeamProfiles = getUpdatedTeamProfiles(
                userPlayers,
                validatedData.updatedTeams
            );
            setTeams(updatedTeamProfiles);
        };

        const handleSocketClearTeams = (data: TeamsClearedData) => {
            const validatedData = teamsClearedSchema.parse(data);
            const updatedTeamProfiles = getUpdatedTeamProfiles(
                userPlayers,
                validatedData.updatedTeams
            );
            setTeams(updatedTeamProfiles);
        };

        const handleSocketAllTeamsJoined = (data: NextStateData) => {
            const validatedData = NextStateDataSchema.parse(data);
            setCurrentPhase(validatedData.nextState);
        };

        const handleSocketReadyStatusToggled = () => {};

        const handleSocketStartGame = () => {};

        const handleSocketPickWarriors = () => {};

        const handleSocketSwapWarriors = () => {};

        const handleSocketPlayerFinishedSetup = () => {};

        const handleSocketCancelSetup = () => {};

        const handleSocketAllPlayersSetup = () => {
            router.push(`/app/game/${gameId}`);
        };

        // Register event listeners
        socketService.on(PlayerJoinedEvent, handleSocketPlayerJoined);
        socketService.on(PlayerLeftEvent, handleSocketPlayerLeft);
        socketService.on(AllPlayersJoinedEvent, handleSocketAllPlayersJoined);
        socketService.on(SageSelectedEvent, handleSocketSageSelected);
        socketService.on(AllSagesSelectedEvent, handleSocketAllSagesSelected);
        socketService.on(ReadyStatusToggledEvent, handleSocketReadyStatusToggled);
        socketService.on(TeamJoinedEvent, handleSocketTeamJoined);
        socketService.on(ClearTeamsEvent, handleSocketClearTeams);
        socketService.on(AllTeamsJoinedEvent, handleSocketAllTeamsJoined);
        socketService.on(StartGameEvent, handleSocketStartGame);
        socketService.on(PickWarriorsEvent, handleSocketPickWarriors);
        socketService.on(SwapWarriorsEvent, handleSocketSwapWarriors);
        socketService.on(PlayerFinishedSetupEvent, handleSocketPlayerFinishedSetup);
        socketService.on(CancelSetupEvent, handleSocketCancelSetup);
        socketService.on(AllPlayersSetupEvent, handleSocketAllPlayersSetup);

        return () => {
            socketService.off(PlayerJoinedEvent, handleSocketPlayerJoined);
            socketService.off(PlayerLeftEvent, handleSocketPlayerLeft);
            socketService.off(AllPlayersJoinedEvent, handleSocketAllPlayersJoined);
            socketService.off(SageSelectedEvent, handleSocketSageSelected);
            socketService.off(AllSagesSelectedEvent, handleSocketAllSagesSelected);
            socketService.off(ReadyStatusToggledEvent,handleSocketReadyStatusToggled);
            socketService.off(TeamJoinedEvent, handleSocketTeamJoined);
            socketService.off(ClearTeamsEvent, handleSocketClearTeams);
            socketService.off(AllTeamsJoinedEvent, handleSocketAllTeamsJoined);
            socketService.off(StartGameEvent, handleSocketStartGame);
            socketService.off(PickWarriorsEvent, handleSocketPickWarriors);
            socketService.off(SwapWarriorsEvent, handleSocketSwapWarriors);
            socketService.off( PlayerFinishedSetupEvent, handleSocketPlayerFinishedSetup);
            socketService.off(CancelSetupEvent, handleSocketCancelSetup);
            socketService.off(AllPlayersSetupEvent, handleSocketAllPlayersSetup);
        };
    }, [currentGameSession, router, userPlayers]);

    const handleAllPlayersJoined = async () => {
        await allPlayersJoined(gameId, { userId });
    };

    const handleSageConfirm = async (sage: Sage) => {
        if (!currentGameSession || !userId) return;
        try {
            await selectSage(gameId, { userId: userId, sage });
            setAvailableSages((prev) => {
                // make the previously confirmed sage available again
                const newAvailableSages = { ...prev };
                if (selectedSage) {
                    newAvailableSages[selectedSage] = true;
                }

                // make the new sage unavailable
                newAvailableSages[sage] = false;
                return newAvailableSages;
            });

            // set the selected sage to the new sage
            setSelectedSage(sage);
        } catch (err) {
            console.error("Failed to select sage:", err);
            setError(
                err instanceof Error ? err.message : "Failed to select sage"
            );
        }
    };

    const fetchSelectedSages = async () => {
        const { availableSages, selectedSage } = await getSelectedSages(
            gameId,
            { userId }
        );
        setAvailableSages(availableSages);
        setSelectedSage(selectedSage);
    };

    const handleAllSagesSelected = async () => {
        await allSagesSelected(gameId, { userId });
    };

    const handleTeamJoin = async (team: 1 | 2) => {
        await joinTeam(gameId, { userId: userId, team });
    };

    const handleClearTeams = async () => {
        await clearTeams(gameId, { userId });
    };

    const handleAllTeamsJoined = async () => {
        await allTeamsJoined(gameId, { userId });
    };

    return (
        <GameSetupContext.Provider
            value={{
                error,
                numPlayersTotal,
                currentPhase,
                isHost,
                selectedSage,
                availableSages,
                userPlayers,
                teams,
                handleAllPlayersJoined,
                fetchSelectedSages,
                handleSageConfirm,
                handleAllSagesSelected,
                handleTeamJoin,
                handleClearTeams,
                handleAllTeamsJoined,
            }}
        >
            {children}
        </GameSetupContext.Provider>
    );
}

export function useGameSetupContext() {
    const context = useContext(GameSetupContext);
    if (!context) {
        throw new Error(
            "useGameSetupContext must be used within a GameSetupProvider"
        );
    }
    return context;
}
