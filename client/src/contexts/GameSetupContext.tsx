"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { socketService } from '@/services/socket';
import { useGameSessionContext } from '@/contexts/GameSessionContext';
import { Sage, SageSelectedEvent, AllSagesSelectedEvent, ClearTeamsEvent, AllTeamsJoinedEvent, StartGameEvent, SwapWarriorsEvent, PlayerFinishedSetupEvent, CancelSetupEvent, AllPlayersSetupEvent, ReadyStatusToggledEvent, TeamJoinedEvent, PickWarriorsEvent, SageSelectedData, sageSelectedSchema, SetupPhase } from '@shared-types';
import { allSagesSelected, joinTeam, selectSage } from "@/services/game-api";
import { useSession } from "next-auth/react";
import { isPlayerHostOfGame } from "@/actions/game-actions";

type GameSetupContextType = {
    error: string;
    numberOfPlayers: number;
    currentPhase: SetupPhase;
    isHost: boolean;
    selectedSage: Sage | null;
    availableSages: { [key in Sage]: boolean };
    handleSageConfirm: (sage: Sage) => Promise<void>;
    handleAllSagesSelected: () => Promise<void>;
    handleTeamJoin: (team: 1 | 2) => Promise<void>;
}

const GameSetupContext = createContext<GameSetupContextType | undefined>(undefined);

type GameSetupProviderProps = {
    children: React.ReactNode;
}

export function GameSetupProvider({ children }: GameSetupProviderProps) {
    const router = useRouter();
    const { currentGameSession } = useGameSessionContext();
    const [isHost, setIsHost] = useState(false);
    const [error, setError] = useState<string>('');
    const { data: session } = useSession();
    const gameId = currentGameSession?.id || '';
    const numberOfPlayers = currentGameSession?.numPlayersTotal || 0;
    const userId = session?.user.id!;

    // Game Related State
    const [currentPhase, setCurrentPhase] = useState<SetupPhase>('sage-selection');
    const [selectedSage, setSelectedSage] = useState<Sage | null>(null);
    const [availableSages, setAvailableSages] = useState<{
        [key in Sage]: boolean;
    }>({
        "Cedar": true,
        "Gravel": true,
        "Porella": true,
        "Torrent": true,
    });

    // Check if user is the host
    useEffect(() => {
        const checkIsHost = async () => {
            if (!userId || !currentGameSession) return;
            const isHost = await isPlayerHostOfGame(userId, currentGameSession.id);
            setIsHost(isHost);
        };
        checkIsHost();
    }, [currentGameSession, userId]);

    // Setup socket event listeners for game setup - these are the handlers for the events that are emitted by the server
    useEffect(() => {
        if (!currentGameSession) return;

        const handleSageSelected = (data: SageSelectedData) => {
            const parsedData = sageSelectedSchema.parse(data);
            setAvailableSages(parsedData.availableSages);
        };
        
        const handleAllSagesSelected = () => {
            setCurrentPhase('team-formation');
        };

        const handleReadyStatusToggled = () => {
            
        };

        const handleTeamJoined = () => {
            
        };

        const handleClearTeams = () => {
            
        };

        const handleAllTeamsJoined = () => {
            setCurrentPhase('warrior-selection');
        };

        const handleStartGame = () => {
            setCurrentPhase('setup-complete');
        };

        const handlePickWarriors = () => {
            
        };

        const handleSwapWarriors = () => {
            // Temporary no-op function
        };

        const handlePlayerFinishedSetup = () => {
            // Temporary no-op function
        };

        const handleCancelSetup = () => {
            // Temporary no-op function
        };

        const handleAllPlayersSetup = () => {
            router.push(`/app/game/${gameId}`);
        };

        // Register event listeners
        socketService.on(SageSelectedEvent, handleSageSelected);
        socketService.on(AllSagesSelectedEvent, handleAllSagesSelected);
        socketService.on(ReadyStatusToggledEvent, handleReadyStatusToggled);
        socketService.on(TeamJoinedEvent, handleTeamJoined);
        socketService.on(ClearTeamsEvent, handleClearTeams);
        socketService.on(AllTeamsJoinedEvent, handleAllTeamsJoined);
        socketService.on(StartGameEvent, handleStartGame);
        socketService.on(PickWarriorsEvent, handlePickWarriors);
        socketService.on(SwapWarriorsEvent, handleSwapWarriors);
        socketService.on(PlayerFinishedSetupEvent, handlePlayerFinishedSetup);
        socketService.on(CancelSetupEvent, handleCancelSetup);
        socketService.on(AllPlayersSetupEvent, handleAllPlayersSetup);

        return () => {
            socketService.off(SageSelectedEvent, handleSageSelected);
            socketService.off(AllSagesSelectedEvent, handleAllSagesSelected);
            socketService.off(ReadyStatusToggledEvent, handleReadyStatusToggled);
            socketService.off(TeamJoinedEvent, handleTeamJoined);
            socketService.off(ClearTeamsEvent, handleClearTeams);
            socketService.off(AllTeamsJoinedEvent, handleAllTeamsJoined);
            socketService.off(StartGameEvent, handleStartGame);
            socketService.off(PickWarriorsEvent, handlePickWarriors);
            socketService.off(SwapWarriorsEvent, handleSwapWarriors);
            socketService.off(PlayerFinishedSetupEvent, handlePlayerFinishedSetup);
            socketService.off(CancelSetupEvent, handleCancelSetup);
            socketService.off(AllPlayersSetupEvent, handleAllPlayersSetup);
        };
    }, [currentGameSession, router]);

    const handleSageConfirm = async (sage: Sage) => {
        if (!currentGameSession || !userId) return;
        try {
            await selectSage(gameId, { userId: userId, sage });
            setAvailableSages(prev => {
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
            console.error('Failed to select sage:', err);
            setError(err instanceof Error ? err.message : 'Failed to select sage');
        }
    };

    const handleAllSagesSelected = async () => {
        await allSagesSelected(gameId, { userId });
    }

    const handleTeamJoin = async (team: 1 | 2) => {
        if (!currentGameSession || !userId) return;
        try {
            await joinTeam(gameId, { userId: userId, team });
        } catch (err) {
            console.error('Failed to join team:', err);
            setError(err instanceof Error ? err.message : 'Failed to join team');
        }
    };

    return (
        <GameSetupContext.Provider value={{
            error,
            numberOfPlayers,
            currentPhase,
            isHost,
            selectedSage,
            availableSages,
            handleSageConfirm,
            handleAllSagesSelected,
            handleTeamJoin,
        }}>
            {children}
        </GameSetupContext.Provider>
    );
}

export function useGameSetupContext() {
    const context = useContext(GameSetupContext);
    if (!context) {
        throw new Error('useGameSetupContext must be used within a GameSetupProvider');
    }
    return context;
}