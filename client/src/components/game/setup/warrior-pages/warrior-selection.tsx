"use client";

import { useIsHost } from "@/hooks/useIsHost";
import { useWarriorSelection } from "@/hooks/useWarriorSelection";
import { useSession } from "next-auth/react";
import { Button } from "@/components/shadcn-ui/button";
import WarriorSwapping from "./warrior-swapping";
import ChooseWarriors from "./choose-warriors";

export default function WarriorSelection() {
    const { data: session } = useSession();
    const userId = session?.user.id!;
    const { isHost } = useIsHost(userId);
    const {
        userWarriorSelection,
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
    } = useWarriorSelection({ userId });

    return (
        <>
        {warriorSelectionState === "selecting" && (
            <ChooseWarriors 
                selectedWarriors={selectedWarriors}
                userWarriorSelection={userWarriorSelection}
                isWarriorSelected={isWarriorSelected}
                canSelectMore={canSelectMore}
                toggleWarriorSelection={toggleWarriorSelection}
                handleConfirmWarriors={handleConfirmWarriors}
            />
        )}
        {warriorSelectionState === "swapping" && (
            <WarriorSwapping 
                selectedWarriors={selectedWarriors}
                onSwapWarriors={handleSwapWarriors}
                onPlayerFinishedSetup={handlePlayerFinishedSetup}
                onCancelSetup={handleCancelSetup}
            />
        )}
        {warriorSelectionState === "finished" && (
            <div className="flex flex-col gap-4">
                <h1>Setup Finished</h1>
                <Button onClick={handleCancelSetup}>
                    Cancel Setup
                </Button>
                {isHost && (
                    <Button onClick={handleBeginBattle} disabled={!allPlayersSetup}>
                        Begin Battle
                    </Button>
                )}
            </div>
        )}
        </>
    );
}
