import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { socketService } from '@/services/socket';
import { useGameSessionContext } from '@/contexts/GameSessionContext';
import { Sage, PlayerJoinedEvent, SageSelectedEvent, AllSagesSelectedEvent, ClearTeamsEvent, AllTeamsJoinedEvent, ToggleReadyStatusEvent, StartGameEvent, ChooseWarriorsEvent, SwapWarriorsEvent, PlayerFinishedSetupEvent, CancelSetupEvent, AllPlayersSetupEvent, ReadyStatusToggledEvent, TeamJoinedEvent, PickWarriorsEvent } from '@shared-types';
import { gameApiClient } from "@/services/game-api";
import { useUserContext } from "@/contexts/UserContext";

// TODO: add to shared types
type SetupPhase = 'sage-selection' | 'team-formation' | 'warrior-selection' | 'ready' | 'setup-complete';

type Player = {
    userId: string;
    isReady: boolean;
    sage: Sage | null;
    team?: number;
}

type Teams = {
    team1: Player[];
    team2: Player[];
}

export function useGameSetup() {
    const router = useRouter();
    const { currentGameSession } = useGameSessionContext();
    const gameId = currentGameSession?.id || '';
    const { userId } = useUserContext();
    const [error, setError] = useState<string>('');

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

    // Setup socket event listeners for game setup - these are the handlers for the events that are emitted by the server
    useEffect(() => {
        if (!currentGameSession) return;

        const handleSageSelected = (data: { userId: string, sage: Sage, availableSages: { [key in Sage]: boolean } }) => {
            setAvailableSages(data.availableSages);
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
            router.push(`/game/${gameId}`);
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
            await gameApiClient.selectSage(gameId, { userId: userId, sage });
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

    const handleTeamJoin = async (team: 1 | 2) => {
        if (!currentGameSession || !userId) return;
        try {
            await gameApiClient.joinTeam(gameId, { userId: userId, team });
        } catch (err) {
            console.error('Failed to join team:', err);
            setError(err instanceof Error ? err.message : 'Failed to join team');
        }
    };

    return {
        error,
        currentPhase,
        selectedSage,
        availableSages,
        handleSageConfirm,
        handleTeamJoin,
    };
} 