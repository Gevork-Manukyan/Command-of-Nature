import { Socket } from "socket.io";

export class UserSocketManager {
    private static instance: UserSocketManager;
    private userIdToSocket: Map<string, Socket> = new Map();

    private constructor() {}

    static getInstance(): UserSocketManager {
        if (!UserSocketManager.instance) {
            UserSocketManager.instance = new UserSocketManager();
        }
        return UserSocketManager.instance;
    }

    registerSocket(userId: string, socket: Socket): void {
        this.userIdToSocket.set(userId, socket);
    }

    getSocket(userId: string): Socket | undefined {
        return this.userIdToSocket.get(userId);
    }

    getSocketId(userId: string): string | undefined {
        const socket = this.getSocket(userId);
        return socket?.id;
    }

    joinGameRoom(userId: string, gameId: string): void {
        const socket = this.getSocket(userId);
        if (socket) {
            socket.join(gameId);
        }
    }

    leaveGameRoom(userId: string, gameId: string): void {
        const socket = this.getSocket(userId);
        if (socket) {
            socket.leave(gameId);
        }
    }

    unregisterSocket(socketId: string): void {
        for (const [userId, socket] of this.userIdToSocket.entries()) {
            if (socket.id === socketId) {
                this.userIdToSocket.delete(userId);
                break;
            }
        }
    }
}
