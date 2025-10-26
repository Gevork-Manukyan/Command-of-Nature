"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { GameStateData, SetupGameState, GameplayGameState, BattlefieldUpdatedData, HandUpdatedData, ShopUpdatedData, PhaseChangedData, TurnChangedData, ActionPointsChangedData, PlayerJoinedData, PlayerLeftData, SageSelectedData, TeamJoinedData, TeamsClearedData, ReadyStatusToggledData, SetupGameStateSchema, GameplayGameStateSchema, playerJoinedSchema, playerLeftSchema, sageSelectedSchema, teamJoinedSchema, teamsClearedSchema, readyStatusToggledSchema } from "@shared-types";
import { getGameState, getCurrentPhase, getSetupGameState } from '@/services/game-api';
import { socketService } from '@/services/socket';
import { useSession } from "next-auth/react";
import { 
    BattlefieldUpdatedEvent, 
    HandUpdatedEvent, 
    ShopUpdatedEvent, 
    PhaseChangedEvent, 
    TurnChangedEvent, 
    ActionPointsChangedEvent,
    PlayerJoinedEvent,
    PlayerLeftEvent,
    SageSelectedEvent,
    TeamJoinedEvent,
    ClearTeamsEvent,
    ReadyStatusToggledEvent
} from "@shared-types/game-events";
import { State } from "@shared-types/gamestate-types";
import { useCurrentUser } from '@/hooks/useCurrentUser';

type GameStateContextType = {
    gameState: GameStateData | null;
    currentPhase: State | null;
    isLoading: boolean;
    error: string | null;
    refreshGameState: () => Promise<void>;
    isGameplayPhase: boolean;
    isSetupPhase: boolean;
    isGameplayState: (state: GameStateData | null) => state is GameplayGameState;
    isSetupState: (state: GameStateData | null) => state is SetupGameState;
    isHost: boolean;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

type GameStateProviderProps = {
    children: ReactNode;
    gameId: string;
    userId: string;
}

const SETUP_PHASES = new Set([
    State.JOINING_GAME,
    State.SAGE_SELECTION,
    State.JOINING_TEAMS,
    State.READY_UP,
]);

const GAMEPLAY_PHASES = new Set([
    State.WARRIOR_SELECTION,
    State.SETUP_COMPLETE,
    State.PHASE1,
    State.PHASE2,
    State.PHASE3,
    State.PHASE4,
    State.DRAWING_NEW_HAND,
    State.END_GAME,
    State.GAME_FINISHED,
]);

export function GameStateProvider({ children, gameId, userId }: GameStateProviderProps) {
    const [gameState, setGameState] = useState<GameStateData | null>(null);
    const [currentPhase, setCurrentPhase] = useState<State | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const currentUserId = useCurrentUser();

    // Derived state
    const isGameplayPhase = currentPhase ? GAMEPLAY_PHASES.has(currentPhase) : false;
    const isSetupPhase = currentPhase ? SETUP_PHASES.has(currentPhase) : false;
    
    // Type guard to check if gameState is a gameplay state
    const isGameplayState = (state: GameStateData | null): state is GameplayGameState => {
        return state !== null && 'activeTeamNumber' in state;
    };

    // Type guard to check if gameState is a setup state
    const isSetupState = (state: GameStateData | null): state is SetupGameState => {
        return isGameplayState(state) === false;
    };
    
    // Check if current user is the host
    const isHost = gameState && isSetupState(gameState) ? gameState.hostUserId === currentUserId : false;

    const fetchGameState = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            // First, get the current phase to determine which endpoint to use
            const serverPhase = await getCurrentPhase(gameId);
            setCurrentPhase(serverPhase as State);
            
            if (GAMEPLAY_PHASES.has(serverPhase as State)) {
                // For gameplay phases, fetch full game state
                const data = await getGameState(gameId, userId);
                const validatedData = GameplayGameStateSchema.parse(data);
                setGameState(validatedData);
            } else {
                // For setup phases, fetch complete setup state
                const data = await getSetupGameState(gameId);
                const validatedData = SetupGameStateSchema.parse(data);
                setGameState(validatedData);
            }
        } catch (err) {
            console.error('Failed to fetch game state:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch game state');
        } finally {
            setIsLoading(false);
        }
    }, [gameId, userId]);

    useEffect(() => {
        fetchGameState();
    }, [fetchGameState]);

    // -------------- SETUP EVENT HANDLERS --------------
    const handlePlayerJoined = useCallback((data: PlayerJoinedData) => {
        setGameState(prev => {
            if (!prev || !isSetupState(prev)) return prev;
            const validatedData = playerJoinedSchema.parse(data);
            return {
                ...prev,
                userSetupData: validatedData.userSetupData,
            };
        });
    }, []);

    const handlePlayerLeft = useCallback((data: PlayerLeftData) => {
        setGameState(prev => {
            if (!prev || !isSetupState(prev)) return prev;
            const validatedData = playerLeftSchema.parse(data);
            return {
                ...prev,
                userSetupData: validatedData.userSetupData,
                hostUserId: validatedData.hostUserId,
            };
        });
    }, []);

    const handleSageSelected = useCallback((data: SageSelectedData) => {
        setGameState(prev => {
            if (!prev || !isSetupState(prev)) return prev;
            const validatedData = sageSelectedSchema.parse(data);
            return {
                ...prev,
                availableSages: validatedData.availableSages,
                userSetupData: prev.userSetupData.map(user => 
                    user.userId === validatedData.userId ? { ...user, sage: validatedData.sage } : user
                ),
            };
        });
    }, []);

    const handleTeamJoined = useCallback((data: TeamJoinedData) => {
        setGameState(prev => {
            if (!prev || !isSetupState(prev)) return prev;
            const validatedData = teamJoinedSchema.parse(data);
            const updatedTeams = validatedData.updatedTeams;
            return {
                ...prev,
                teams: updatedTeams,
                userSetupData: prev.userSetupData.map(user => {
                    const userId = user.userId;
                    if (updatedTeams[1].includes(userId)) {
                        return { ...user, team: 1 };
                    }
                    if (updatedTeams[2].includes(userId)) {
                        return { ...user, team: 2 };
                    }
                    return { ...user, team: null };
                }),
            };
        });
    }, []);

    const handleTeamsCleared = useCallback((data: TeamsClearedData) => {
        setGameState(prev => {
            if (!prev || !isSetupState(prev)) return prev;
            const validatedData = teamsClearedSchema.parse(data);
            return {
                ...prev,
                teams: validatedData.updatedTeams,
                userSetupData: prev.userSetupData.map(user => ({ ...user, team: null })),
            };
        });
    }, []);

    const handleReadyStatusToggled = useCallback((data: ReadyStatusToggledData) => {
        setGameState(prev => {
            if (!prev || !isSetupState(prev)) return prev;
            const validatedData = readyStatusToggledSchema.parse(data);
            return {
                ...prev,
                userSetupData: prev.userSetupData.map(user =>
                    user.userId === validatedData.userId ? { ...user, isReady: validatedData.isReady } : user
                ),
            };
        });
    }, []);

    // -------------- GAMEPLAY EVENT HANDLERS --------------
    const handleBattlefieldUpdate = useCallback((data: BattlefieldUpdatedData) => {
        setGameState(prev => {
            if (!prev || !isGameplayState(prev)) return prev;
            return {
                ...prev,
                teams: [
                    prev.teams[0].teamNumber === data.teamNumber 
                        ? { ...prev.teams[0], battlefield: data.battlefield }
                        : prev.teams[0],
                    prev.teams[1].teamNumber === data.teamNumber 
                        ? { ...prev.teams[1], battlefield: data.battlefield }
                        : prev.teams[1]
                ] as [typeof prev.teams[0], typeof prev.teams[1]]
            };
        });
    }, []);

    const handleHandUpdate = useCallback((data: HandUpdatedData) => {
        setGameState(prev => {
            if (!prev || !isGameplayState(prev)) return prev;
            const isMyTeamMember = prev.myTeamPlayers.some(p => p.userId === data.userId);
            if (!isMyTeamMember) return prev;
            
            return {
                ...prev,
                myTeamPlayers: prev.myTeamPlayers.map(p =>
                    p.userId === data.userId ? { ...p, hand: data.hand } : p
                )
            };
        });
    }, []);

    const handleShopUpdate = useCallback((data: ShopUpdatedData) => {
        setGameState(prev => {
            if (!prev || !isGameplayState(prev)) return prev;
            return {
                ...prev,
                creatureShop: data.creatureShop,
                itemShop: data.itemShop,
            };
        });
    }, []);

    const handleTurnChange = useCallback((data: TurnChangedData) => {
        setGameState(prev => {
            if (!prev || !isGameplayState(prev)) return prev;
            return {
                ...prev,
                activeTeamNumber: data.activeTeamNumber,
                actionPoints: data.actionPoints,
                maxActionPoints: data.maxActionPoints,
            };
        });
    }, []);

    const handleActionPointsChange = useCallback((data: ActionPointsChangedData) => {
        setGameState(prev => {
            if (!prev || !isGameplayState(prev)) return prev;
            return {
                ...prev,
                actionPoints: data.actionPoints,
                maxActionPoints: data.maxActionPoints,
            };
        });
    }, []);

    // -------------- PHASE CHANGE EVENT HANDLER --------------
    const handlePhaseChange = useCallback(async (data: PhaseChangedData) => {
        const newPhase = data.currentPhase as State;
        setCurrentPhase(newPhase);
        
        // If transitioning to a gameplay phase, fetch full game state
        if (GAMEPLAY_PHASES.has(newPhase)) {
            try {
                const fullGameState = await getGameState(gameId, userId);
                setGameState(fullGameState);
            } catch (err) {
                console.error('Failed to fetch full game state after phase change:', err);
                // Fallback to just updating the phase
                setGameState(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        currentPhase: newPhase,
                        ...(data.activeTeamNumber && { activeTeamNumber: data.activeTeamNumber }),
                    };
                });
            }
        } else {
            // For setup phases, just update the phase
            setGameState(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    currentPhase: newPhase,
                    ...(data.activeTeamNumber && { activeTeamNumber: data.activeTeamNumber }),
                };
            });
        }
    }, [gameId, userId]);


    useEffect(() => {
        if (!gameId) return;

        // -------------- SETUP EVENT LISTENERS --------------
        socketService.on(PlayerJoinedEvent, handlePlayerJoined);
        socketService.on(PlayerLeftEvent, handlePlayerLeft);
        socketService.on(SageSelectedEvent, handleSageSelected);
        socketService.on(TeamJoinedEvent, handleTeamJoined);
        socketService.on(ClearTeamsEvent, handleTeamsCleared);
        socketService.on(ReadyStatusToggledEvent, handleReadyStatusToggled);

        // -------------- GAMEPLAY EVENT LISTENERS --------------
        socketService.on(BattlefieldUpdatedEvent, handleBattlefieldUpdate);
        socketService.on(HandUpdatedEvent, handleHandUpdate);
        socketService.on(ShopUpdatedEvent, handleShopUpdate);
        socketService.on(PhaseChangedEvent, handlePhaseChange);
        socketService.on(TurnChangedEvent, handleTurnChange);
        socketService.on(ActionPointsChangedEvent, handleActionPointsChange);
        
        return () => {
            // -------------- SETUP EVENT LISTENERS --------------
            socketService.off(PlayerJoinedEvent, handlePlayerJoined);
            socketService.off(PlayerLeftEvent, handlePlayerLeft);
            socketService.off(SageSelectedEvent, handleSageSelected);
            socketService.off(TeamJoinedEvent, handleTeamJoined);
            socketService.off(ClearTeamsEvent, handleTeamsCleared);
            socketService.off(ReadyStatusToggledEvent, handleReadyStatusToggled);

            // -------------- GAMEPLAY EVENT LISTENERS --------------
            socketService.off(BattlefieldUpdatedEvent, handleBattlefieldUpdate);
            socketService.off(HandUpdatedEvent, handleHandUpdate);
            socketService.off(ShopUpdatedEvent, handleShopUpdate);
            socketService.off(PhaseChangedEvent, handlePhaseChange);
            socketService.off(TurnChangedEvent, handleTurnChange);
            socketService.off(ActionPointsChangedEvent, handleActionPointsChange);
        };
    }, [gameId, handleBattlefieldUpdate, handleHandUpdate, handleShopUpdate, handlePhaseChange, handleTurnChange, handleActionPointsChange, handlePlayerJoined, handlePlayerLeft, handleSageSelected, handleTeamJoined, handleTeamsCleared, handleReadyStatusToggled]);

    return (
        <GameStateContext.Provider 
            value={{ 
                gameState, 
                currentPhase,
                isLoading, 
                error, 
                refreshGameState: fetchGameState,
                isGameplayPhase,
                isSetupPhase,
                isGameplayState,
                isSetupState,
                isHost
            }}
        >
            {children}
        </GameStateContext.Provider>
    );
}

export function useGameStateContext() {
    const context = useContext(GameStateContext);
    if (context === undefined) {
        throw new Error('useGameStateContext must be used within a GameStateProvider');
    }
    return context;
}
