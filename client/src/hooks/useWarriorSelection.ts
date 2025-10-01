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
    PickWarriorsEvent,
    NextStateData,
    ElementalWarriorStarterCard,
    ElementalWarriorStarterCardSchema,
    OptionalAbilityCardSchema,
    WarriorSelectionState,
    WarriorSelectionStateSchema,
} from "@shared-types";
import { useRouter } from "next/navigation";
import { useGameSessionContext } from "@/contexts/GameSessionContext";
import { useCurrentPhaseContext } from "@/contexts/CurrentPhaseContext";
import { beginBattle, cancelSetup, chooseWarriors, finishSetup, getUserWarriorSelectionData, swapWarriors } from "@/services/game-api";

type UseWarriorSelectionProps = {
    userId: string;
};

export function useWarriorSelection({ userId }: UseWarriorSelectionProps) {
    const router = useRouter();
    const { currentGameSession } = useGameSessionContext();
    const gameId = currentGameSession?.id!;
    const { updateCurrentPhase } = useCurrentPhaseContext();
    const [warriorSelectionState, setWarriorSelectionState] = useState<WarriorSelectionState>("selecting");
    const [userDeckWarriors, setUserDeckWarriors] = useState<ElementalWarriorStarterCard[]>([]);
    const [selectedWarriors, setSelectedWarriors] = useState<ElementalWarriorStarterCard[]>([]);
    const [allPlayersSetup, setAllPlayersSetup] = useState<boolean>(false);

    // -------------- SOCKET EVENT HANDLERS --------------
    const handleSocketPickWarriors = () => {};

    const handleSocketSwapWarriors = () => {};

    const handleSocketPlayerFinishedSetup = () => {};

    const handleSocketCancelSetup = () => {};

    const handleSocketAllPlayersSetupStatus = (data: AllPlayersSetupStatusData) => {
        setAllPlayersSetup(data.allPlayersSetup);
    };
    
    const handleSocketBeginBattle = (data: NextStateData) => {
        updateCurrentPhase(data);
    };

    useEffect(() => {
        // -------------- REGISTER SOCKET EVENT LISTENERS --------------
        socketService.on(PickWarriorsEvent, handleSocketPickWarriors);
        socketService.on(SwapWarriorsEvent, handleSocketSwapWarriors);
        socketService.on(PlayerFinishedSetupEvent, handleSocketPlayerFinishedSetup);
        socketService.on(CancelSetupEvent, handleSocketCancelSetup);
        socketService.on(AllPlayersSetupStatusEvent, handleSocketAllPlayersSetupStatus);
        socketService.on(BeginBattleEvent, handleSocketBeginBattle);

        return () => {
            // -------------- UNREGISTER SOCKET EVENT LISTENERS --------------
            socketService.off(PickWarriorsEvent, handleSocketPickWarriors);
            socketService.off(SwapWarriorsEvent, handleSocketSwapWarriors);
            socketService.off(PlayerFinishedSetupEvent, handleSocketPlayerFinishedSetup);
            socketService.off(CancelSetupEvent, handleSocketCancelSetup);
            socketService.off(AllPlayersSetupStatusEvent, handleSocketAllPlayersSetupStatus);
            socketService.off(BeginBattleEvent, handleSocketBeginBattle);
        };
    }, [currentGameSession, router]);

    // Fetch user deck warriors
    useEffect(() => {
        const fetchWarriorSelectionState = async () => {
            const response = (await getUserWarriorSelectionData(gameId, userId)) as {
                deckWarriors: unknown[];
                warriorSelectionState: unknown;
                selectedWarriors: unknown[];
            };

            // Validate Deck Warriors
            const { deckWarriors } = response;
            const validatedUserDeckWarriors = deckWarriors.map(
                (warrior: unknown) =>
                    ElementalWarriorStarterCardSchema.merge(
                        OptionalAbilityCardSchema
                    ).parse(warrior)
            ) as ElementalWarriorStarterCard[];
            setUserDeckWarriors(validatedUserDeckWarriors);

            // Validate Warrior Selection State
            const { warriorSelectionState } = response;
            const validatedWarriorSelectionState = WarriorSelectionStateSchema.parse(warriorSelectionState);
            setWarriorSelectionState(validatedWarriorSelectionState);

            // Validate Selected Warriors and Warrior Positions
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
            setWarriorSelectionState("swapping");
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
            setSelectedWarriors((prev) => {
                return [prev[1], prev[0]];
            });
        }
    };

    const handlePlayerFinishedSetup = async () => {
        await finishSetup(gameId, { userId });
        setWarriorSelectionState("finished");
    };

    const handleCancelSetup = async () => {
        await cancelSetup(gameId, { userId });
        setWarriorSelectionState("selecting");
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
