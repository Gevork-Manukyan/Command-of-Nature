export type User = {
    id: string;
    playerName: string;
    currentGame: string; 
    createdAt: string; // new Date().toISOString()
}

export type Game = {
    id: string;
    players: string[];
    roomCode: string;
    createdAt: string; // new Date().toISOString()
}