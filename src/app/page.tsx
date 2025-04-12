"use client";

import { useGameState } from '@/hooks/useGameState';

export default function Home() {
  const { error, handleJoinGame } = useGameState();

  return (
    <main className="min-h-screen bg-gray-100">

    </main>
  );
}
