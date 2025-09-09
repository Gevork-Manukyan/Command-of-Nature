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
import { chooseWarriors, getUserDeckWarriors } from "@/services/game-api";

type UseWarriorSelectionProps = {
    userId: string;
};

export function useWarriorSelection({ userId }: UseWarriorSelectionProps) {
    const router = useRouter();
    const { currentGameSession } = useGameSessionContext();
    const gameId = currentGameSession?.id!;
    const { updateCurrentPhase } = useCurrentPhaseContext();
    const [userWarriorSelection, setUserWarriorSelection] = useState<
        ElementalWarriorStarterCard[]
    >([]);

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
        socketService.on(
            PlayerFinishedSetupEvent,
            handleSocketPlayerFinishedSetup
        );
        socketService.on(CancelSetupEvent, handleSocketCancelSetup);
        socketService.on(AllPlayersSetupEvent, handleSocketAllPlayersSetup);

        return () => {
            // -------------- UNREGISTER SOCKET EVENT LISTENERS --------------
            socketService.off(PickWarriorsEvent, handleSocketPickWarriors);
            socketService.off(SwapWarriorsEvent, handleSocketSwapWarriors);
            socketService.off(
                PlayerFinishedSetupEvent,
                handleSocketPlayerFinishedSetup
            );
            socketService.off(CancelSetupEvent, handleSocketCancelSetup);
            socketService.off(
                AllPlayersSetupEvent,
                handleSocketAllPlayersSetup
            );
        };
    }, [currentGameSession, router]);

    useEffect(() => {
        const fetchUserDeckWarriors = async () => {
            const response = (await getUserDeckWarriors(gameId, userId)) as {
                deckWarriors: unknown[];
            };
            const { deckWarriors } = response;
            const validatedUserDeckWarriors = deckWarriors.map((warrior: unknown) =>
                ElementalWarriorStarterCardSchema.merge(
                    OptionalAbilityCardSchema
                ).parse(warrior)
            ) as ElementalWarriorStarterCard[];
            setUserWarriorSelection(validatedUserDeckWarriors);
        };
        fetchUserDeckWarriors();
    }, [gameId, userId]);

    // -------------- HANDLERS --------------
    const handlePickWarriors = async () => {
        // await chooseWarriors(gameId, );
    };

    const handleSwapWarriors = () => {};

    const handlePlayerFinishedSetup = (data: NextStateData) => {
        updateCurrentPhase(data);
    };

    const handleCancelSetup = (data: NextStateData) => {
        updateCurrentPhase(data);
    };

    const handleAllPlayersSetup = () => {};

    return {
        userWarriorSelection,
        handlePickWarriors,
        handleSwapWarriors,
        handlePlayerFinishedSetup,
        handleCancelSetup,
        handleAllPlayersSetup,
    };
}
