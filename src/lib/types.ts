export type User = {
    id: string;
    username: string;  // Changed from playerName for consistency with auth
    currentGame?: string;  // Optional since user might not be in a game
    isOnline: boolean;
    gamesPlayed: number;
    gamesWon: number;
    createdAt: string;  // ISO string format
}