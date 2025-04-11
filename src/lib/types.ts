export type User = {
    id: string;
    username: string;  // Changed from playerName for consistency with auth
    currentGame?: string;  // Optional since user might not be in a game
    isOnline: boolean;
    gamesPlayed: number;
    gamesWon: number;
    createdAt: string;  // ISO string format
}

export type Game = {
    id: string;
    gameName: string;
    isPrivate: boolean;
    numPlayersTotal: number;
    numCurrentPlayers: number;
}

export interface GameSession {
    gameId: string;
    gameName: string;          // New field for game name
    numPlayers: number;
    isHost: boolean;
    status: 'waiting' | 'in-progress' | 'completed';
    createdAt: Date;
    isPrivate: boolean;        // New field for privacy setting
    password?: string;         // Optional field for private games
  }

export type GuestSession = {
    userId: string;
    guestName: string;
} 