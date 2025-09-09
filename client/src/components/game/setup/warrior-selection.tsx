"use client";

import { useIsHost } from "@/hooks/useIsHost";
import { useWarriorSelection } from "@/hooks/useWarriorSelection";
import { useSession } from "next-auth/react";
import H3 from "./components/h3";
import { Button } from "@/components/shadcn-ui/button";

export default function WarriorSelection() {
    const { data: session } = useSession();
    const userId = session?.user.id!;
    const { isHost } = useIsHost(userId);
    const { userWarriorSelection } = useWarriorSelection({ userId });
    
    return (
        <>
        <H3>Warrior Selection</H3>
        <div className="flex flex-row gap-4">
            {userWarriorSelection.map((warrior) => (
                <Button key={warrior.name}>{warrior.name}</Button>
            ))}
        </div>
        </>
    )
}