// lib/game.ts
import { db } from './firebase';
import { doc, setDoc } from "firebase/firestore";


export const createGuestSession = async (userId: string) => {
    try {
      const sessionRef = doc(db, 'sessions', userId);
      await setDoc(sessionRef, {
        status: 'active',
        createdAt: new Date(),
        playerName: `Guest_${Math.floor(Math.random() * 1000)}`
      });
    } catch (error) {
      console.error('Error creating guest session:', error);
    }
}