import { GAME_SESSIONS_COLLECTION, GUEST_SESSIONS_COLLECTION } from '../constants';
import { Game, User } from '../types';
import { db } from './firebase';
import { addDoc, arrayUnion, collection, doc, setDoc, updateDoc } from "firebase/firestore";


export const createGuestSession = async (userId: User['id'], guestName = "") => {
  try {
    const sessionRef = doc(db, GUEST_SESSIONS_COLLECTION, userId);

    const newUserSession: Omit<User, "id"> = {
      playerName: guestName.trim() !== "" ? guestName : `Guest_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    }

    await setDoc(sessionRef, newUserSession);
  } catch (error) {
    console.error('Error creating guest session:', error);
  }
}

export const createGameSession = async (userId: User["id"]) => {
  try {
    const sessionRef = collection(db, GAME_SESSIONS_COLLECTION)

    // Add a new document with automatically generated ID
    const newGameSession: Omit<Game, "id"> = {
      players: [userId],
      roomCode: "",
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(sessionRef, newGameSession);

    console.log('Game session created with ID:', docRef.id);
  } catch (error) {
    console.error('Error creating game session:', error);
  }
}

export const joinGameSession = async (gameId: Game['id'], userId: User["id"]) => {
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