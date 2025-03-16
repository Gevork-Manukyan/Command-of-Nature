export type Game = {
    gameId: string;
    numPlayers: number;
    currentPlayers: number;
}

export type GameSession = {
    gameId: string;
    isHost: boolean;
    numPlayers: number;
}

export type GuestSession = {
    userId: string;
    guestName: string;
} 