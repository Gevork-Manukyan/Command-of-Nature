"use client";
import { socketService } from "@/services/socket";
import { useEffect, useState } from "react";
import {
    SwapWarriorsEvent,
    PlayerFinishedSetupEvent,
    CancelSetupEvent,
    AllPlayersSetupEvent,
    PickWarriorsEvent,
} from "@shared-types";
import { useRouter } from "next/navigation";
import { useGameSessionContext } from "@/contexts/GameSessionContext";

export function useWarriorSelection() {
    const router = useRouter();
    const { currentGameSession } = useGameSessionContext();
    const [userWarriorSelection, setUserWarriorSelection] = useState([]);
    
    // -------------- SOCKET EVENT HANDLERS --------------
    const handleSocketPickWarriors = () => {};

    const handleSocketSwapWarriors = () => {};

    const handleSocketPlayerFinishedSetup = () => {};

    const handleSocketCancelSetup = () => {};

    const handleSocketAllPlayersSetup = () => {};

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
        }
    }, [currentGameSession, router])

    // -------------- HANDLERS --------------
    const handlePickWarriors = () => {};

    const handleSwapWarriors = () => {};

    const handlePlayerFinishedSetup = () => {};

    const handleCancelSetup = () => {};

    const handleAllPlayersSetup = () => {};

    return {
        userWarriorSelection,
        handlePickWarriors,
        handleSwapWarriors,
        handlePlayerFinishedSetup,
        handleCancelSetup,
        handleAllPlayersSetup
    }
}