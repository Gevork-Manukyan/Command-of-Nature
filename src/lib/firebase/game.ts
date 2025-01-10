import { GAME_SESSIONS_COLLECTION, GUEST_SESSIONS_COLLECTION } from '../constants';
import { Game, User } from '../types';
import { db } from './firebase';
import { addDoc, arrayUnion, collection, doc, setDoc, updateDoc } from "firebase/firestore";


export const createGuestSession = async (userId: User['id'], guestName = "") => {
  try {
    const sessionRef = doc(db, GUEST_SESSIONS_COLLECTION, userId);

    const newUserSession: Omit<User, "id"> = {
      playerName: guestName.trim() !== "" ? guestName : `Guest_${Math.floor(Math.random() * 1000)}`,
      currentGame: "",
      createdAt: new Date().toISOString(),
    }

    await setDoc(sessionRef, newUserSession);
  } catch (error) {
    console.error('Error creating guest session:', error);
  }
}

export const createGameSession = async (userId: User["id"]) => {
  try {
    const gameSession = collection(db, GAME_SESSIONS_COLLECTION)

    // Add a new document with automatically generated ID
    const newGame: Omit<Game, "id"> = {
      players: [userId],
      roomCode: "",
      createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(gameSession, newGame);

    // Add game session to user
    const userSession = doc(db, GUEST_SESSIONS_COLLECTION, userId)
    const updatedUser: Partial<User> = {
      currentGame: docRef.id
    }
    await updateDoc(userSession, updatedUser)

    console.log('Game session created with ID:', docRef.id);
  } catch (error) {
    console.error('Error creating game session:', error);
  }
}

export const joinGameSession = async (gameId: Game['id'], userId: User["id"]) => {
  try {
    // Update game session to include the new player
    const gameSession = doc(db, GAME_SESSIONS_COLLECTION, gameId)
    await updateDoc(gameSession, {
      players: arrayUnion(userId)
    })

    // Associate the game to the player
    const userSession = doc(db, GUEST_SESSIONS_COLLECTION, userId)
    const updatedUser: Partial<User> = {
      currentGame: gameId
    }
    await updateDoc(userSession, updatedUser)

    console.log(`Player ${userId} added to game session ${gameId}`);
  } catch (error) {
    console.error('Error joining game session:', error);
  }
}