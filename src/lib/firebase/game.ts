// lib/game.ts
import { GUEST_SESSIONS_COLLECTION } from '../constants';
import { db } from './firebase';
import { doc, setDoc } from "firebase/firestore";


export const createGuestSession = async (userId: string, guestName = "") => {
  try {
    const sessionRef = doc(db, GUEST_SESSIONS_COLLECTION, userId);
    await setDoc(sessionRef, {
      status: 'active',
      createdAt: new Date(),
      playerName: guestName.trim() !== "" ? guestName : `Guest_${Math.floor(Math.random() * 1000)}`
    });
  } catch (error) {
    console.error('Error creating guest session:', error);
  }
}