"use client";

import { useIsHost } from "@/hooks/useIsHost";
import { useWarriorSelection } from "@/hooks/useWarriorSelection";
import { useSession } from "next-auth/react";
import H3 from "../components/h3";
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
        toggleWarriorSelection,
        isWarriorSelected,
        handleConfirmWarriors,
        handleSwapWarriors,
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
            />
        )}
        </>
    );
}
