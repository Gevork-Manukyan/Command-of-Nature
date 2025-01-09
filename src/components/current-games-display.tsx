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
        <section>
            <ul>
                {currentGames.map(gameItem => (
                    <li key={gameItem.id}>{gameItem.id}</li>
                ))}
            </ul>
        </section>
    )
}