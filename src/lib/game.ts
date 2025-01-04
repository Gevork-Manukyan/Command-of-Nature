// lib/game.ts
import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";


export const createGuestSession = async (userId: string) => {
    try {
      const sessionRef = doc(db, 'sessions', userId);
      await setDoc(sessionRef, {
        status: 'active',
        createdAt: new Date(),
        playerName: `Guest_${Math.floor(Math.random() * 1000)}`
      });
      localStorage.setItem('guestSession', userId)
    } catch (error) {
      console.error('Error creating guest session:', error);
    }
}

// Create a new game room
export const createGameRoom = async (gameId: string, player: string) => {
  try {
    const gameRef = doc(db, 'games', gameId);
    await setDoc(gameRef, {
      players: {
        [player]: { status: 'waiting', cards: [] }
      },
      gameState: 'waiting',
      currentTurn: player,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error creating game room: ', error);
  }
};

// Join an existing game room
export const joinGameRoom = async (gameId: string, player: string) => {
  try {
    const gameRef = doc(db, 'games', gameId);
    const gameDoc = await getDoc(gameRef);
    if (gameDoc.exists()) {
      await updateDoc(gameRef, {
        [`players.${player}`]: { status: 'playing', cards: [] }
      });
    }
  } catch (error) {
    console.error('Error joining game room: ', error);
  }
};

// Fetch game state
export const getGameState = async (gameId: string) => {
  try {
    const gameRef = doc(db, 'games', gameId);
    const gameDoc = await getDoc(gameRef);
    if (gameDoc.exists()) {
      return gameDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching game state: ', error);
    return null;
  }
};
