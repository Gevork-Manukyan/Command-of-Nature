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
    ReadyStatusToggledEvent,
    TeamJoinedEvent,
    SageSelectedData,
    sageSelectedSchema,
    PlayerJoinedEvent,
    PlayerJoinedData,
    playerJoinedSchema,
    PlayerLeftData,
    playerLeftSchema,
    PlayerLeftEvent,
    AllPlayersJoinedEvent,
    NextStateData,
    TeamJoinedData,
    teamJoinedSchema,
    TeamsClearedData,
    teamsClearedSchema,
    ReadyStatusToggledData,
    readyStatusToggledSchema,
    userSetupDataResponseSchema,
} from "@shared-types";
import {
    allPlayersJoined,
    allSagesSelected,
    allTeamsJoined,
    clearTeams,
    getSelectedSages,
    getUserSetupData,
    joinTeam,
    selectSage,
    startGame,
    toggleReady,
} from "@/services/game-api";
import { useSession } from "next-auth/react";
import { UserSetup } from "@shared-types";
import { useCurrentPhaseContext } from "./CurrentPhaseContext";
import { useIsHost } from "@/hooks/useIsHost";

type GameSetupContextType = {
    error: string;
    numPlayersTotal: number;
    isHost: boolean;
    selectedSage: Sage | null;
    availableSages: { [key in Sage]: boolean };
    userPlayers: UserSetup[];
    handleAllPlayersJoined: () => Promise<void>;
    fetchSelectedSages: () => Promise<void>;
    handleSageConfirm: (sage: Sage) => Promise<void>;
    handleAllSagesSelected: () => Promise<void>;
    handleTeamJoin: (team: 1 | 2) => Promise<void>;
    handleClearTeams: () => Promise<void>;
    handleAllTeamsJoined: () => Promise<void>;
    handleToggleReady: () => Promise<void>;
    handleAllPlayersReady: () => Promise<void>;
};

const GameSetupContext = createContext<GameSetupContextType | undefined>(
    undefined
);

type GameSetupProviderProps = {
    children: React.ReactNode;
};

function updateSetupSageData(
    userPlayers: UserSetup[],
    userId: string,
    sage: Sage
): UserSetup[] {
    return userPlayers.map((user) => {
        if (user.userId === userId) {
            return { ...user, sage };
        }
        return user;
    });
}

function updateSetupTeamData(
    userPlayers: UserSetup[],
    updatedTeams: { [key in 1 | 2]: string[] }
): UserSetup[] {
    return userPlayers.map((user) => {
        const userId = user.userId;

        if (updatedTeams[1].includes(userId)) {
            return { ...user, team: 1 };
        }
        if (updatedTeams[2].includes(userId)) {
            return { ...user, team: 2 };
        }

        return { ...user, team: null };
    });
}

function updateSetupReadyStatusData(
    userPlayers: UserSetup[],
    userId: string,
    isReady: boolean
): UserSetup[] {
    return userPlayers.map((user) => {
        if (user.userId === userId) {
            return { ...user, isReady };
        }
        return user;
    });
}

export function GameSetupProvider({ children }: GameSetupProviderProps) {
    const router = useRouter();
    const { currentGameSession } = useGameSessionContext();
    const gameId = currentGameSession?.id || "";
    const numPlayersTotal = currentGameSession?.numPlayersTotal || 0;
    const { updateCurrentPhase } = useCurrentPhaseContext();
    const [error, setError] = useState<string>("");
    const { data: session } = useSession();
    const userId = session?.user.id!;
    const { isHost, checkIsHost } = useIsHost(userId);

    // Game Related State
    const [userPlayers, setUserPlayers] = useState<UserSetup[]>([]);
    const [selectedSage, setSelectedSage] = useState<Sage | null>(null);
    const [availableSages, setAvailableSages] = useState<{
        [key in Sage]: boolean;
    }>({
        Cedar: true,
        Gravel: true,
        Porella: true,
        Torrent: true,
    });

    // Fetch the current user setup data
    useEffect(() => {
        const fetchSetupData = async () => {
            const userSetupData = await getUserSetupData(gameId, userId);
            const validatedUserSetupData = userSetupDataResponseSchema.parse(userSetupData);
            setUserPlayers(validatedUserSetupData.userSetupData);
        };
        fetchSetupData();
    }, [gameId, userId]);

    // Setup socket event listeners for game setup - these are the handlers for the events that are emitted by the server
    useEffect(() => {
        if (!currentGameSession) return;

        // -------------- SOCKET EVENT HANDLERS --------------
        const handleSocketPlayerJoined = (data: PlayerJoinedData) => {
            const validatedData = playerJoinedSchema.parse(data);
            setUserPlayers(validatedData.userSetupData);
        };

        const handleSocketPlayerLeft = async (data: PlayerLeftData) => {
            const validatedData = playerLeftSchema.parse(data);
            setUserPlayers(validatedData.userSetupData);
            await checkIsHost();
        };

        const handleSocketAllPlayersJoined = (data: NextStateData) => {
            updateCurrentPhase(data);
        };

        const handleSocketSageSelected = (data: SageSelectedData) => {
            const parsedData = sageSelectedSchema.parse(data);
            setAvailableSages(parsedData.availableSages);
            setUserPlayers((prev) => updateSetupSageData(prev, parsedData.userId, parsedData.sage));
        };

        const handleSocketAllSagesSelected = (data: NextStateData) => {
            updateCurrentPhase(data);
        };

        const handleSocketTeamJoined = (data: TeamJoinedData) => {
            const validatedData = teamJoinedSchema.parse(data);
            setUserPlayers((prev) => updateSetupTeamData(prev, validatedData.updatedTeams));
        };

        const handleSocketClearTeams = (data: TeamsClearedData) => {
            const validatedData = teamsClearedSchema.parse(data);
            setUserPlayers((prev) => updateSetupTeamData(prev, validatedData.updatedTeams));
        };

        const handleSocketAllTeamsJoined = (data: NextStateData) => {
            updateCurrentPhase(data);
        };

        const handleSocketReadyStatusToggled = (data: ReadyStatusToggledData) => {
            const validatedData = readyStatusToggledSchema.parse(data);
            setUserPlayers((prev) => updateSetupReadyStatusData(prev, validatedData.userId, validatedData.isReady));
        };

        const handleSocketStartGame = (data: NextStateData) => {
            updateCurrentPhase(data);
        };

        // -------------- REGISTER SOCKET EVENT LISTENERS --------------
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

        return () => {
            // -------------- UNREGISTER SOCKET EVENT LISTENERS --------------
            socketService.off(PlayerJoinedEvent, handleSocketPlayerJoined);
            socketService.off(PlayerLeftEvent, handleSocketPlayerLeft);
            socketService.off(AllPlayersJoinedEvent, handleSocketAllPlayersJoined);
            socketService.off(SageSelectedEvent, handleSocketSageSelected);
            socketService.off(AllSagesSelectedEvent, handleSocketAllSagesSelected);
            socketService.off(ReadyStatusToggledEvent, handleSocketReadyStatusToggled);
            socketService.off(TeamJoinedEvent, handleSocketTeamJoined);
            socketService.off(ClearTeamsEvent, handleSocketClearTeams);
            socketService.off(AllTeamsJoinedEvent, handleSocketAllTeamsJoined);
            socketService.off(StartGameEvent, handleSocketStartGame);
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
            setUserPlayers((prev) => updateSetupSageData(prev, userId, sage));
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

    const handleToggleReady = async () => {
        await toggleReady(gameId, { userId });
    };

    const handleAllPlayersReady = async () => {
        await startGame(gameId, { userId });
    };

    return (
        <GameSetupContext.Provider
            value={{
                error,
                numPlayersTotal,
                isHost,
                selectedSage,
                availableSages,
                userPlayers,
                handleAllPlayersJoined,
                fetchSelectedSages,
                handleSageConfirm,
                handleAllSagesSelected,
                handleTeamJoin,
                handleClearTeams,
                handleAllTeamsJoined,
                handleToggleReady,
                handleAllPlayersReady,
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
