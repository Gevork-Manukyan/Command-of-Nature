import { useEffect, useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { socketService } from '@/services/socket';
import { useGameSessionContext } from '@/contexts/GameSessionContext';
import { Sage, PlayerJoinedEvent, SageSelectedEvent, AllSagesSelectedEvent, TeamJoinedEvent, JoinTeamEvent, ClearTeamsEvent, AllTeamsJoinedEvent, ToggleReadyStatusEvent, StartGameEvent, ChoseWarriorsEvent, SwapWarriorsEvent, PlayerFinishedSetupEvent, CancelSetupEvent, AllPlayersSetupEvent } from '@shared-types';
import { gameApiClient } from "@/services/game-api";
import { useUserContext } from "@/contexts/UserContext";

type SetupPhase = 'sage-selection' | 'team-formation' | 'warrior-selection' | 'ready' | 'setup-complete';

interface Player {
    userId: string;
    isReady: boolean;
    sage: Sage | null;
    team?: number;
}

interface Teams {
    team1: Player[];
    team2: Player[];
}

export function useGameSetup() {
    const router = useRouter();
    const { currentSession } = useGameSessionContext();
    const gameId = currentSession?.id || '';
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
        if (!currentSession) return;

        const handlePlayerJoined = (data: { userId: string }) => {
            
        };

        const handleSageSelected = (data: { userId: string, sage: Sage, availableSages: { [key in Sage]: boolean } }) => {
            setAvailableSages(data.availableSages);
        };
        
        const handleAllSagesSelected = () => {
            setCurrentPhase('team-formation');
        };

        const handleJoinTeam = (data: { id: string, team: number }) => {
            
        };

        const handleClearTeams = () => {
            
        };

        const handleAllTeamsJoined = () => {
            setCurrentPhase('warrior-selection');
        };

        const handleToggleReadyStatus = (data: { id: string, isReady: boolean }) => {
            
        };

        const handleStartGame = () => {
            setCurrentPhase('setup-complete');
        };

        const handleChoseWarriors = () => {
            setCurrentPhase('ready');
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
        socketService.on(PlayerJoinedEvent, handlePlayerJoined);
        socketService.on(SageSelectedEvent, handleSageSelected);
        socketService.on(AllSagesSelectedEvent, handleAllSagesSelected);
        socketService.on(JoinTeamEvent, handleJoinTeam);
        socketService.on(ClearTeamsEvent, handleClearTeams);
        socketService.on(AllTeamsJoinedEvent, handleAllTeamsJoined);
        socketService.on(ToggleReadyStatusEvent, handleToggleReadyStatus);
        socketService.on(StartGameEvent, handleStartGame);
        socketService.on(ChoseWarriorsEvent, handleChoseWarriors);
        socketService.on(SwapWarriorsEvent, handleSwapWarriors);
        socketService.on(PlayerFinishedSetupEvent, handlePlayerFinishedSetup);
        socketService.on(CancelSetupEvent, handleCancelSetup);
        socketService.on(AllPlayersSetupEvent, handleAllPlayersSetup);

        return () => {
            socketService.off(PlayerJoinedEvent, handlePlayerJoined);
            socketService.off(SageSelectedEvent, handleSageSelected);
            socketService.off(AllSagesSelectedEvent, handleAllSagesSelected);
            socketService.off(JoinTeamEvent, handleJoinTeam);
            socketService.off(ClearTeamsEvent, handleClearTeams);
            socketService.off(AllTeamsJoinedEvent, handleAllTeamsJoined);
            socketService.off(ToggleReadyStatusEvent, handleToggleReadyStatus);
            socketService.off(StartGameEvent, handleStartGame);
            socketService.off(ChoseWarriorsEvent, handleChoseWarriors);
            socketService.off(SwapWarriorsEvent, handleSwapWarriors);
            socketService.off(PlayerFinishedSetupEvent, handlePlayerFinishedSetup);
            socketService.off(CancelSetupEvent, handleCancelSetup);
            socketService.off(AllPlayersSetupEvent, handleAllPlayersSetup);
        };
    }, [currentSession, router]);

    const handleSageConfirm = async (sage: Sage) => {
        if (!currentSession || !userId) return;
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
        if (!currentSession || !userId) return;
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