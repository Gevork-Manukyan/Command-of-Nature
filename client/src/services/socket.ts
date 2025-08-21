import { io, Socket } from "socket.io-client";

class SocketService {
    private static instance: SocketService;
    private socket: Socket | null = null;
    private listeners: Map<string, ((...args: any[]) => void)[]> = new Map();
    private isConnected: boolean = false;
    private connectionPromise: Promise<void> | null = null;

    private constructor() {}

    private constructUrl(baseUrl: string, path: string): string {
        if (!baseUrl) {
            throw new Error("Base URL cannot be empty");
        }

        const cleanBase = baseUrl.replace(/\/$/, ""); // Remove trailing slash
        const cleanPath = path.replace(/^\//, ""); // Remove leading slash
        return `${cleanBase}/${cleanPath}`;
    }

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public connect(userId: string): Promise<void> {
        if (this.connectionPromise) {
            return this.connectionPromise;
        }

        const url = this.constructUrl(
            process.env.NEXT_PUBLIC_SOCKET_URL!,
            "/gameplay"
        );

        if (this.socket) {
            this.disconnect();
        }

        this.connectionPromise = new Promise(async (resolve, reject) => {
            try {
                this.socket = io(url, {
                    reconnectionAttempts: 3,
                    reconnectionDelay: 1000,
                    timeout: 20000,
                    transports: ["websocket", "polling"],
                    query: {
                        userId: userId,
                    },
                });

                this.socket.on("connect_error", (error) => {
                    console.error("Socket connection error:", error);
                    this.setConnected(false);
                    reject(error);
                });

                this.socket.on("connect", () => {
                    this.setConnected(true);
                    resolve();
                });

                this.socket.on("disconnect", (reason) => {
                    this.setConnected(false);
                });

                // Re-register all existing listeners
                this.listeners.forEach((callbacks, event) => {
                    callbacks.forEach((callback) => {
                        this.socket?.on(event, callback);
                    });
                });
            } catch (error) {
                console.error("Failed to initialize socket connection:", error);
                reject(error);
            }
        });

        return this.connectionPromise;
    }

    private setConnected(connected: boolean) {
        this.isConnected = connected;
    }

    public getConnected(): boolean {
        return this.isConnected;
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.setConnected(false);
            this.connectionPromise = null;
        }
    }

    public on(event: string, callback: (...args: any[]) => void): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(callback);
        this.socket?.on(event, callback);
    }

    public off(event: string, callback?: (...args: any[]) => void): void {
        if (callback) {
            this.socket?.off(event, callback);
            const callbacks = this.listeners.get(event);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
            }
        } else {
            this.socket?.off(event);
            this.listeners.delete(event);
        }
    }

    public async emit(
        event: string,
        userId: string,
        ...args: any[]
    ): Promise<void> {
        if (!this.isConnected) {
            throw new Error("Socket is not connected");
        }

        this.socket?.emit(event, { userId: userId, ...args });
    }
}

export const socketService = SocketService.getInstance();
