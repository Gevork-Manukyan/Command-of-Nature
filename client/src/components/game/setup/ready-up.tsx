"use client";
import H3 from "./components/h3";
import { useSession } from "next-auth/react";
import { Button } from "@/components/shadcn-ui/button";
import { useGameSetupContext } from "@/contexts/GameSetupContext";
import { ErrorScreen } from "@/components/error/error-screen";

export default function ReadyUp() {
    const { handleToggleReady } = useGameSetupContext();
    const userId = useSession().data?.user.id;
    const { userPlayers } = useGameSetupContext();
    const userSetupData = userPlayers.find((user) => user.userId === userId);

    if (!userSetupData) {
        return <ErrorScreen message="User setup data not found" />;
    }

    return (
        <div>
            <H3>Ready Up</H3>
            <p>Sage: {userSetupData?.sage}</p>
            <p>Team: {userSetupData?.team}</p>
            <p>Is Ready: {userSetupData?.isReady ? "Yes" : "No"}</p>
            <Button onClick={handleToggleReady}>Toggle Ready</Button>
        </div>
    );
}
