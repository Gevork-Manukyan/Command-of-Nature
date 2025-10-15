"use client";

import { Button } from "../shadcn-ui/button";
import { useGameSessionContext } from "@/contexts/GameSessionContext";
import { useRouter } from "next/navigation";

interface ErrorScreenProps {
    message: string;
}

export function ErrorScreen({ message }: ErrorScreenProps) {
    const { clearCurrentSession } = useGameSessionContext();
    const router = useRouter();

    const handleGoBack = () => {
        clearCurrentSession();
        router.push('/app/lobby');
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <p className="text-red-600 font-medium">{message}</p>
                <Button className="mt-4" onClick={handleGoBack}>
                    Go Back to Lobby
                </Button>
            </div>
        </div>
    );
} 