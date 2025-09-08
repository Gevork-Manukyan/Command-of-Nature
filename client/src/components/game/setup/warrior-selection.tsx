"use client";

import { useIsHost } from "@/hooks/useIsHost";
import { useWarriorSelection } from "@/hooks/useWarriorSelection";
import { useSession } from "next-auth/react";

export default function WarriorSelection() {
    const { data: session } = useSession();
    const userId = session?.user.id!;
    const { isHost } = useIsHost(userId);
    const { userWarriorSelection } = useWarriorSelection();
    
    return (
        <></>
    )
}