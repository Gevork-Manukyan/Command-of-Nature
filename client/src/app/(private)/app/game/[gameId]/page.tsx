"use client";

import { useParams } from 'next/navigation';

export default function GamePage() {
    const params = useParams();
    const gameId = params.gameId as string;

    return (
        <div className="flex flex-col min-h-screen">

        </div>
    );
} 