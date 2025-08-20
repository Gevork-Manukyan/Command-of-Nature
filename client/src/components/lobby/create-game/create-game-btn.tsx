"use client";

import { useLobbyContext } from "@/contexts/LobbyContext";

export function CreateGameBtn() {
    const { setShowModal } = useLobbyContext();
    
    return (
        <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-md"
        >
            Create New Game
        </button>
    )
}