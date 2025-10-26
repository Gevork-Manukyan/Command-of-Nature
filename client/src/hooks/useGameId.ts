"use client";

import { useParams } from 'next/navigation';

/**
 * Hook to get the current gameId from URL params
 * Used throughout the app instead of GameSessionContext
 */
export function useGameId(): string {
    const params = useParams();
    return params.gameId as string;
}
