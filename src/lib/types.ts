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
    roomCode: string;
    numPlayers: number;  // Maximum number of players
    players: User[];    // Current players in the game
    status: 'waiting' | 'playing' | 'finished';
    createdAt: string;  // ISO string format
}

export type GameSession = {
    gameId: string;
    isHost: boolean;    // Indicates if the user is the host
    numPlayers: number; // Maximum number of players
    status: 'waiting' | 'playing' | 'finished';
    createdAt: Date;
}

export type GuestSession = {
    userId: string;
    guestName: string;
} 