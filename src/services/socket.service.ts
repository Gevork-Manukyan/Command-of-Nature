import { io, Socket } from 'socket.io-client';
import { GameListing } from '@command-of-nature/shared-types';
import { config } from '@/lib/server/config';

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private listeners: Map<string, ((...args: any[]) => void)[]> = new Map();
  private isConnected: boolean = false;
  private connectionPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    const url = config.socket.url + "/gameplay";

    if (this.socket) {
      this.disconnect();
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        this.socket = io(url, {
          reconnectionAttempts: 3,
          reconnectionDelay: 1000,
          timeout: 20000
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          this.isConnected = false;
          this.emit('connection-error', { message: 'Failed to connect to game server' });
          reject(error);
        });

        this.socket.on('connect', () => {
          this.isConnected = true;
          resolve();
        });

        // Re-register all existing listeners
        this.listeners.forEach((callbacks, event) => {
          callbacks.forEach(callback => {
            this.socket?.on(event, callback);
          });
        });
      } catch (error) {
        console.error('Failed to initialize socket connection:', error);
        this.emit('connection-error', { message: 'Failed to initialize socket connection' });
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
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

  public async emit(event: string, ...args: any[]): Promise<void> {
    this.socket?.emit(event, ...args);
  }

  // Game-specific methods
  public async createGame(userId: string, settings: {
    numPlayers: number;
    gameName: string;
    isPrivate: boolean;
    password?: string;
  }): Promise<void> {
    await this.emit('create-game', {
      userId,
      numPlayers: settings.numPlayers,
      gameName: settings.gameName,
      isPrivate: settings.isPrivate,
      password: settings.password
    });
  }

  public joinGame(userId: string, gameId: string, password?: string): void {
    this.emit('join-game', { userId, gameId, password });
  }

  public leaveGame(gameId: string): void {
    this.emit('leave-game', { gameId });
  }

  public startGame(gameId: string): void {
    this.emit('start-game', { gameId });
  }

  public getCurrentGames(): void {
    this.emit('get-current-games');
  }

  // Event handlers
  public onGameCreated(callback: (gameData: GameListing) => void): void {
    this.on('create-game--success', callback);
  }

  public onGameJoined(callback: (gameData: GameListing) => void): void {
    this.on('join-game--success', callback);
  }

  public onGameError(callback: (error: { message: string }) => void): void {
    this.on('create-game--error', callback);
    this.on('join-game--error', callback);
  }

  public onCurrentGames(callback: (games: GameListing[]) => void): void {
    this.on('current-games', callback);
  }

  public onGameStarted(callback: (gameData: GameListing) => void): void {
    this.on('game-started', callback);
  }

  public onPlayerJoined(callback: (gameData: GameListing) => void): void {
    this.on('player-joined', callback);
  }

  public onPlayerLeft(callback: (gameData: GameListing) => void): void {
    this.on('player-left', callback);
  }
}

export const socketService = SocketService.getInstance(); 