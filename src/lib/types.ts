export type User = {
    id: string;
    playerName: string;
    createdAt: string; // new Date().toISOString()
}

export type Game = {
    id: string;
    players: string[];
    roomCode: string;
    createdAt: string; // new Date().toISOString()
}