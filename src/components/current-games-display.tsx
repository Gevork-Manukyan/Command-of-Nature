'use client'

import { GAME_SESSIONS_COLLECTION } from "@/lib/constants"
import { db } from "@/lib/firebase/firebase"
import { Game } from "@/lib/types"
import { onSnapshot, collection } from "firebase/firestore"
import { useEffect, useState } from "react"

export default function CurrentGamesDisplay() {
    const [currentGames, setCurrentGames] = useState<Game[]>([])
    
    useEffect(() => {

        const unsubscribe = onSnapshot(collection(db, GAME_SESSIONS_COLLECTION), (snapshot) => {
            const docs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }))

            console.log(docs)
            setCurrentGames(docs as Game[])
        })

        return () => unsubscribe()
    }, [])
    
    return (
        <section className="w-4/5 mx-[40px] mt-5 py-6 px-9 border-solid border-black border-2 rounded-md">
            <h2 className="mb-3">Game Lobbies</h2>
            <ul>
                {currentGames.map(gameItem => (
                    <li key={gameItem.id}>{gameItem.id}</li>
                ))}
            </ul>
        </section>
    )
}