import { GAME_SESSIONS_COLLECTION, GUEST_SESSIONS_COLLECTION } from '../constants';
import { db } from './firebase';
import { addDoc, arrayUnion, collection, doc, setDoc, updateDoc } from "firebase/firestore";


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

export const createGameSession = async (userId: string) => {
  try {
    const sessionRef = collection(db, GAME_SESSIONS_COLLECTION)

     // Add a new document with automatically generated ID
     const newSession = {
      // roomCode: 
      players: [userId],
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(sessionRef, newSession);

    console.log('Game session created with ID:', docRef.id);
  } catch (error) {
    console.error('Error creating game session:', error);
  }
}

export const joinGameSession = async (gameId: string, userId: string) => {
  try {
    const gameSessionRef = doc(db, GAME_SESSIONS_COLLECTION, gameId)

    await updateDoc(gameSessionRef, {
      players: arrayUnion(userId)
    })

    console.log(`Player ${userId} added to game session ${gameId}`);
  } catch (error) {
    console.error('Error joining game session:', error);
  }
}