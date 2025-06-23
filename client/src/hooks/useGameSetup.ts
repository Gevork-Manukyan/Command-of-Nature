import { useEffect, useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { socketService } from '@/services/socket.service';
import { useUserContext } from '@/contexts/UserContext';
import { useGameSessionContext } from '@/contexts/GameSessionContext';
import { Sage, ElementalWarriorStarterCard, PlayerJoinedEvent, SageSelectedEvent, AllSagesSelectedEvent, TeamJoinedEvent, JoinTeamEvent, ClearTeamsEvent, AllTeamsJoinedEvent, ToggleReadyStatusEvent, StartGameEvent, ChoseWarriorsEvent, SwapWarriorsEvent, PlayerFinishedSetupEvent, CancelSetupEvent, AllPlayersSetupEvent } from 'shared-types';

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
    const pathname = usePathname();
    const gameId = pathname.split('/').pop();
    const { userId } = useUserContext();
    const { currentSession, setCurrentSession } = useGameSessionContext();
    const [error, setError] = useState<string>('');
    const [isLeaving, setIsLeaving] = useState(false);
    const [isLoadingGame, setIsLoadingGame] = useState(false);
    const [currentPhase, setCurrentPhase] = useState<SetupPhase>('sage-selection');
    const [selectedSage, setSelectedSage] = useState<Sage | null>(null);

    // Handle socket connection and game rejoining
    useEffect(() => {
        if (!userId || !currentSession) return;

        const connectAndRejoin = async () => {
            try {
                setIsLoadingGame(true);
                setError('');

                if (!socketService.getConnected()) {
                    await socketService.connect();
                }

                await socketService.rejoinGame(userId, currentSession.id);
                setIsLoadingGame(false);
            } catch (err) {
                console.error('Failed to rejoin game:', err);
                setError(err instanceof Error ? err.message : 'Failed to rejoin game');
                setIsLoadingGame(false);
            }
        };

        connectAndRejoin();
    }, [userId, currentSession]);

    // Setup socket event listeners for game setup
    useEffect(() => {
        if (!currentSession) return;

        const handlePlayerJoined = (data: { userId: string }) => {
            
        };

        const handleSageSelected = (data: { userId: string, sage: Sage }) => {
            
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

    const goToLobby = async () => {
        setIsLeaving(true);
        router.push('/lobby');
        if (!currentSession) return;
        await socketService.exitGame(currentSession.id);
    };

    const leaveGame = async () => {
        setIsLeaving(true);
        router.push('/lobby');
        if (!currentSession) return;

        try {
            await socketService.leaveGame(currentSession.id);
            setCurrentSession(null);
        } catch (err) {
            console.error('Failed to leave game:', err);
            setError(err instanceof Error ? err.message : 'Failed to leave game');
            setIsLeaving(false);
        }
    };

    const handleSageSelect = (sage: Sage) => {
        setSelectedSage(sage);
    };

    const handleSageSelection = async (sage: Sage) => {
        if (!currentSession) return;
        try {
            await socketService.selectSage(currentSession.id, sage);
            setCurrentPhase('team-formation');
            setSelectedSage(null);
        } catch (err) {
            console.error('Failed to select sage:', err);
            setError(err instanceof Error ? err.message : 'Failed to select sage');
        }
    };

    const handleTeamJoin = async (team: 1 | 2) => {
        if (!currentSession) return;
        try {
            await socketService.joinTeam(currentSession.id, team);
        } catch (err) {
            console.error('Failed to join team:', err);
            setError(err instanceof Error ? err.message : 'Failed to join team');
        }
    };

    return {
        error,
        isLoadingGame,
        isLeaving,
        goToLobby,
        leaveGame,
        currentPhase,
        selectedSage,
        handleSageSelect,
        handleSageSelection,
        handleTeamJoin,
    };
} 