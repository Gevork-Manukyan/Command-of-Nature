"use client";
import { socketService } from "@/services/socket";
import { useEffect, useState } from "react";
import {
    SwapWarriorsEvent,
    PlayerFinishedSetupEvent,
    CancelSetupEvent,
    BeginBattleEvent,
    AllPlayersSetupStatusEvent,
    AllPlayersSetupStatusData,
    ElementalWarriorStarterCard,
    ElementalWarriorStarterCardSchema,
    OptionalAbilityCardSchema,
    WarriorSelectionState,
    WarriorSelectionStateSchema,
    ChooseWarriorsData,
    SwapWarriorsData,
    PlayerFinishedSetupData,
    CancelSetupData,
    chooseWarriorsSchema,
    swapWarriorsSchema,
    playerFinishedSetupSchema,
    cancelSetupSchema,
    ChooseWarriorsEvent,
} from "@shared-types";
import { useRouter } from "next/navigation";
import { useGameId } from "@/hooks/useGameId";
import { beginBattle, cancelSetup, chooseWarriors, finishSetup, getUserWarriorSelectionData, swapWarriors } from "@/services/game-api";
import z from "zod";

type UseWarriorSelectionProps = {
    userId: string;
};

export function useWarriorSelection({ userId }: UseWarriorSelectionProps) {
    const router = useRouter();
    const [warriorSelectionState, setWarriorSelectionState] = useState<WarriorSelectionState | null>(null);
    const [userDeckWarriors, setUserDeckWarriors] = useState<ElementalWarriorStarterCard[]>([]);
    const [selectedWarriors, setSelectedWarriors] = useState<ElementalWarriorStarterCard[]>([]);
    const [allPlayersSetup, setAllPlayersSetup] = useState<boolean>(false);
    const gameId = useGameId();

    // -------------- SOCKET EVENT HANDLERS --------------
    const handleSocketChooseWarriors = (data: ChooseWarriorsData) => {
        const validatedData = chooseWarriorsSchema.parse(data);
        
        if (validatedData.userId === userId) {
            // My own action - update my state
            setSelectedWarriors(validatedData.selectedWarriors as ElementalWarriorStarterCard[]);
            setWarriorSelectionState(validatedData.warriorSelectionState);
        } else {
            // Teammate's action - update their visibility (if needed for UI)
            // This depends on if you show teammate's warriors in UI
        }
    };

    const handleSocketSwapWarriors = (data: SwapWarriorsData) => {
        const validatedData = swapWarriorsSchema.parse(data);
        
        if (validatedData.userId === userId) {
            setSelectedWarriors(validatedData.selectedWarriors as ElementalWarriorStarterCard[]);
        }
    };

    const handleSocketPlayerFinishedSetup = (data: PlayerFinishedSetupData) => {
        const validatedData = playerFinishedSetupSchema.parse(data);
        
        if (validatedData.userId === userId) {
            setWarriorSelectionState(validatedData.warriorSelectionState);
        }
        // Other players' status handled by AllPlayersSetupStatusEvent
    };

    const handleSocketCancelSetup = (data: CancelSetupData) => {
        const validatedData = cancelSetupSchema.parse(data);
        
        if (validatedData.userId === userId) {
            setWarriorSelectionState(validatedData.warriorSelectionState);
        }
    };

    const handleSocketAllPlayersSetupStatus = (data: AllPlayersSetupStatusData) => {
        setAllPlayersSetup(data.allPlayersSetup);
    };
    
    const handleSocketBeginBattle = () => {};

    useEffect(() => {
        // -------------- REGISTER SOCKET EVENT LISTENERS --------------
        socketService.on(ChooseWarriorsEvent, handleSocketChooseWarriors);
        socketService.on(SwapWarriorsEvent, handleSocketSwapWarriors);
        socketService.on(PlayerFinishedSetupEvent, handleSocketPlayerFinishedSetup);
        socketService.on(CancelSetupEvent, handleSocketCancelSetup);
        socketService.on(AllPlayersSetupStatusEvent, handleSocketAllPlayersSetupStatus);
        socketService.on(BeginBattleEvent, handleSocketBeginBattle);

        return () => {
            // -------------- UNREGISTER SOCKET EVENT LISTENERS --------------
            socketService.off(ChooseWarriorsEvent, handleSocketChooseWarriors);
            socketService.off(SwapWarriorsEvent, handleSocketSwapWarriors);
            socketService.off(PlayerFinishedSetupEvent, handleSocketPlayerFinishedSetup);
            socketService.off(CancelSetupEvent, handleSocketCancelSetup);
            socketService.off(AllPlayersSetupStatusEvent, handleSocketAllPlayersSetupStatus);
            socketService.off(BeginBattleEvent, handleSocketBeginBattle);
        };
    }, [gameId, router]);

    // ----- Fetch user deck warriors and warrior selection state -----
    useEffect(() => {
        const fetchWarriorSelectionState = async () => {
            const response = (await getUserWarriorSelectionData(gameId, userId)) as {
                deckWarriors: unknown[];
                warriorSelectionState: unknown;
                selectedWarriors: unknown[];
                isAllPlayersSetup: unknown;
            };

            // ----- Validate Deck Warriors -----
            const { deckWarriors } = response;
            const validatedUserDeckWarriors = deckWarriors.map(
                (warrior: unknown) =>
                    ElementalWarriorStarterCardSchema.merge(
                        OptionalAbilityCardSchema
                    ).parse(warrior)
            ) as ElementalWarriorStarterCard[];
            setUserDeckWarriors(validatedUserDeckWarriors);

            // ----- Validate Warrior Selection State -----
            const { warriorSelectionState } = response;
            const validatedWarriorSelectionState = WarriorSelectionStateSchema.parse(warriorSelectionState);
            setWarriorSelectionState(validatedWarriorSelectionState);

            // ----- Validate Selected Warriors and Warrior Positions -----
            const { selectedWarriors } = response;
            if (selectedWarriors === null) {
                setSelectedWarriors([]);
            } else {
                const validatedSelectedWarriors = selectedWarriors.map(
                    (warrior: unknown) =>
                        ElementalWarriorStarterCardSchema.merge(
                            OptionalAbilityCardSchema
                        ).parse(warrior)
                ) as ElementalWarriorStarterCard[];
                setSelectedWarriors(validatedSelectedWarriors);
            }

            // ----- Validate All Players Setup -----
            const { isAllPlayersSetup } = response
            const validatedIsAllPlayersSetup = z.boolean().parse(isAllPlayersSetup);
            setAllPlayersSetup(validatedIsAllPlayersSetup);
        };
        fetchWarriorSelectionState();
    }, [gameId, userId]);

    // -------------- WARRIOR SELECTION HANDLERS --------------
    const handleConfirmWarriors = async () => {
        if (selectedWarriors.length === 2) {
            const warriorNames: [string, string] = [
                selectedWarriors[0].name,
                selectedWarriors[1].name,
            ];
            await chooseWarriors(gameId, { userId, choices: warriorNames });
        }
    };

    const toggleWarriorSelection = (warrior: ElementalWarriorStarterCard) => {
        setSelectedWarriors((prev) => {
            const isSelected = prev.some(
                (selected) => selected.name === warrior.name
            );

            if (isSelected) {
                // Remove warrior from selection
                return prev.filter(
                    (selected) => selected.name !== warrior.name
                );
            } else {
                // Add warrior to selection if less than 2 are selected
                if (prev.length < 2) {
                    return [...prev, warrior];
                }
                // If 2 are already selected, don't add more
                return prev;
            }
        });
    };

    const isWarriorSelected = (warrior: ElementalWarriorStarterCard) => {
        return selectedWarriors.some(
            (selected) => selected.name === warrior.name
        );
    };

    const canSelectMore = selectedWarriors.length < 2;

    // -------------- OTHER HANDLERS --------------
    const handleSwapWarriors = async () => {
        if (selectedWarriors.length === 2) {
            await swapWarriors(gameId, { userId });
        }
    };

    const handlePlayerFinishedSetup = async () => {
        await finishSetup(gameId, { userId });
    };

    const handleCancelSetup = async () => {
        await cancelSetup(gameId, { userId });
    };

    const handleBeginBattle = async () => {
        await beginBattle(gameId, { userId });
    };


    return {
        userWarriorSelection: userDeckWarriors,
        selectedWarriors,
        canSelectMore,
        warriorSelectionState,
        allPlayersSetup,
        toggleWarriorSelection,
        isWarriorSelected,
        handleConfirmWarriors,
        handleSwapWarriors,
        handlePlayerFinishedSetup,
        handleCancelSetup,
        handleBeginBattle,
    };
}
