"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { GameStateData, SetupGameState, GameplayGameState, BattlefieldUpdatedData, HandUpdatedData, ShopUpdatedData, PhaseChangedData, TurnChangedData, ActionPointsChangedData } from "@shared-types";
import { getGameState, getCurrentPhase } from '@/services/game-api';
import { socketService } from '@/services/socket';
import { 
    BattlefieldUpdatedEvent, 
    HandUpdatedEvent, 
    ShopUpdatedEvent, 
    PhaseChangedEvent, 
    TurnChangedEvent, 
    ActionPointsChangedEvent
} from "@shared-types/game-events";
import { State } from "@shared-types/gamestate-types";

type GameStateContextType = {
    gameState: GameStateData | null;
    currentPhase: State | null;
    isLoading: boolean;
    error: string | null;
    refreshGameState: () => Promise<void>;
    isGameplayPhase: boolean;
    isSetupPhase: boolean;
    isGameplayState: (state: GameStateData | null) => state is GameplayGameState;
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

    // Derived state
    const isGameplayPhase = currentPhase ? GAMEPLAY_PHASES.has(currentPhase) : false;
    const isSetupPhase = currentPhase ? SETUP_PHASES.has(currentPhase) : false;
    
    // Type guard to check if gameState is a gameplay state
    const isGameplayState = (state: GameStateData | null): state is GameplayGameState => {
        return state !== null && 'teams' in state;
    };

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
                setGameState(data);
            } else {
                // For setup phases, create a minimal game state with just the phase
                setGameState({
                    gameId,
                    currentPhase: serverPhase as State,
                } as SetupGameState);
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

    // Unified event handlers
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

        socketService.on(BattlefieldUpdatedEvent, handleBattlefieldUpdate);
        socketService.on(HandUpdatedEvent, handleHandUpdate);
        socketService.on(ShopUpdatedEvent, handleShopUpdate);
        socketService.on(PhaseChangedEvent, handlePhaseChange);
        socketService.on(TurnChangedEvent, handleTurnChange);
        socketService.on(ActionPointsChangedEvent, handleActionPointsChange);
        
        return () => {
            socketService.off(BattlefieldUpdatedEvent, handleBattlefieldUpdate);
            socketService.off(HandUpdatedEvent, handleHandUpdate);
            socketService.off(ShopUpdatedEvent, handleShopUpdate);
            socketService.off(PhaseChangedEvent, handlePhaseChange);
            socketService.off(TurnChangedEvent, handleTurnChange);
            socketService.off(ActionPointsChangedEvent, handleActionPointsChange);
        };
    }, [gameId, handleBattlefieldUpdate, handleHandUpdate, handleShopUpdate, handlePhaseChange, handleTurnChange, handleActionPointsChange]);

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
                isGameplayState
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
