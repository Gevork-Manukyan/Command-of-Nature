"use client";
import { socketService } from "@/services/socket";
import { useEffect, useState } from "react";
import {
    SwapWarriorsEvent,
    PlayerFinishedSetupEvent,
    CancelSetupEvent,
    AllPlayersSetupEvent,
    PickWarriorsEvent,
    NextStateData,
    ElementalWarriorStarterCard,
    ElementalWarriorStarterCardSchema,
    OptionalAbilityCardSchema,
} from "@shared-types";
import { useRouter } from "next/navigation";
import { useGameSessionContext } from "@/contexts/GameSessionContext";
import { useCurrentPhaseContext } from "@/contexts/CurrentPhaseContext";
import { chooseWarriors, getUserDeckWarriors, swapWarriors } from "@/services/game-api";

type UseWarriorSelectionProps = {
    userId: string;
};

export function useWarriorSelection({ userId }: UseWarriorSelectionProps) {
    const router = useRouter();
    const { currentGameSession } = useGameSessionContext();
    const gameId = currentGameSession?.id!;
    const { updateCurrentPhase } = useCurrentPhaseContext();
    const [warriorSelectionState, setWarriorSelectionState] = useState<"selecting" | "swapping" | "finished">("selecting");
    const [userWarriorSelection, setUserWarriorSelection] = useState<ElementalWarriorStarterCard[]>([]);
    const [selectedWarriors, setSelectedWarriors] = useState<ElementalWarriorStarterCard[]>([]);

    // -------------- SOCKET EVENT HANDLERS --------------
    const handleSocketPickWarriors = () => {};

    const handleSocketSwapWarriors = () => {};

    const handleSocketPlayerFinishedSetup = () => {};

    const handleSocketCancelSetup = () => {};

    const handleSocketAllPlayersSetup = (data: NextStateData) => {
        updateCurrentPhase(data);
    };

    useEffect(() => {
        // -------------- REGISTER SOCKET EVENT LISTENERS --------------
        socketService.on(PickWarriorsEvent, handleSocketPickWarriors);
        socketService.on(SwapWarriorsEvent, handleSocketSwapWarriors);
        socketService.on(PlayerFinishedSetupEvent, handleSocketPlayerFinishedSetup);
        socketService.on(CancelSetupEvent, handleSocketCancelSetup);
        socketService.on(AllPlayersSetupEvent, handleSocketAllPlayersSetup);

        return () => {
            // -------------- UNREGISTER SOCKET EVENT LISTENERS --------------
            socketService.off(PickWarriorsEvent, handleSocketPickWarriors);
            socketService.off(SwapWarriorsEvent, handleSocketSwapWarriors);
            socketService.off(PlayerFinishedSetupEvent, handleSocketPlayerFinishedSetup);
            socketService.off(CancelSetupEvent, handleSocketCancelSetup);
            socketService.off(AllPlayersSetupEvent, handleSocketAllPlayersSetup);
        };
    }, [currentGameSession, router]);

    // Fetch user deck warriors
    useEffect(() => {
        const fetchUserDeckWarriors = async () => {
            const response = (await getUserDeckWarriors(gameId, userId)) as {
                deckWarriors: unknown[];
            };
            const { deckWarriors } = response;
            const validatedUserDeckWarriors = deckWarriors.map(
                (warrior: unknown) =>
                    ElementalWarriorStarterCardSchema.merge(
                        OptionalAbilityCardSchema
                    ).parse(warrior)
            ) as ElementalWarriorStarterCard[];
            setUserWarriorSelection(validatedUserDeckWarriors);
        };
        fetchUserDeckWarriors();
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

    const handlePlayerFinishedSetup = (data: NextStateData) => {
        updateCurrentPhase(data);
        setWarriorSelectionState("finished");
    };

    const handleCancelSetup = (data: NextStateData) => {
        updateCurrentPhase(data);
        setWarriorSelectionState("selecting");
    };

    const handleAllPlayersSetup = () => {};


    return {
        userWarriorSelection,
        selectedWarriors,
        canSelectMore,
        warriorSelectionState,
        toggleWarriorSelection,
        isWarriorSelected,
        handleConfirmWarriors,
        handleSwapWarriors,
        handlePlayerFinishedSetup,
        handleCancelSetup,
        handleAllPlayersSetup,
    };
}
