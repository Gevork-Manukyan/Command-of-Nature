"use client";

import { GameSetupProvider } from "@/contexts/GameSetupContext";

export default function SetupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <GameSetupProvider>
            {children}
        </GameSetupProvider>
    );
}