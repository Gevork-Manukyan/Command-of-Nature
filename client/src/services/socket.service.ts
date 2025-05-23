import { io, Socket } from 'socket.io-client';
import { GameListing, JoinGameEvent, RejoinGameEvent, ExitGameEvent, LeaveGameEvent, StartGameEvent, CreateGameEvent } from '@command-of-nature/shared-types';
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

  private async validateToken(): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/validate-token');
      return response.ok && !response.redirected;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  private async ensureValidToken(): Promise<boolean> {
    const isValid = await this.validateToken();
    if (!isValid) {
      window.location.href = '/login';
      return false;
    }
    return true;
  }

  public connect(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    const url = config.socket.url + "/gameplay";

    if (this.socket) {
      this.disconnect();
    }

    this.connectionPromise = new Promise(async (resolve, reject) => {
      try {
        // Validate token before connecting
        const isValid = await this.ensureValidToken();
        if (!isValid) {
          return reject(new Error('Account Session Expired'));
        }

        this.socket = io(url, {
          reconnectionAttempts: 3,
          reconnectionDelay: 1000,
          timeout: 20000,
          transports: ['websocket', 'polling'] // Explicitly specify transport methods
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          this.setConnected(false);
          this.emit('connection-error', { message: 'Failed to connect to game server' });
          reject(error);
        });

        this.socket.on('connect', () => {
          this.setConnected(true);
          resolve();
        });

        this.socket.on('disconnect', (reason) => {
          this.setConnected(false);
        });

        // Re-register all existing listeners
        this.listeners.forEach((callbacks, event) => {
          callbacks.forEach(callback => {
            this.socket?.on(event, callback);
          });
        });
      } catch (error) {
        console.error('Failed to initialize socket connection:', error);
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

  public async emit(event: string, ...args: any[]): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Socket is not connected');
    }

    // Validate token before emitting
    const isValid = await this.ensureValidToken();
    if (!isValid) {
      throw new Error('Account Session Expired');
    }
    this.socket?.emit(event, ...args);
  }

  // Game-specific methods
  public async createGame(userId: string, settings: {
    numPlayers: number;
    gameName: string;
    isPrivate: boolean;
    password?: string;
  }): Promise<void> {
    await this.emit(CreateGameEvent, {
      userId,
      numPlayers: settings.numPlayers,
      gameName: settings.gameName,
      isPrivate: settings.isPrivate,
      password: settings.password
    });
  }

  public async joinGame(userId: string, gameId: string, password?: string): Promise<void> {
    await this.emit(JoinGameEvent, { userId, gameId, password });
  }

  public async rejoinGame(userId: string, gameId: string): Promise<void> {
    await this.emit(RejoinGameEvent, { userId, gameId });
  }

  public async exitGame(gameId: string): Promise<void> {
    await this.emit(ExitGameEvent, { gameId });
  }

  public async leaveGame(gameId: string): Promise<void> {
    await this.emit(LeaveGameEvent, { gameId });
  }

  public async startGame(gameId: string): Promise<void> {
    await this.emit(StartGameEvent, { gameId });
  }

  // Event handlers
  public onGameCreated(callback: (gameData: GameListing) => void): void {
    this.on(`${CreateGameEvent}--success`, callback);
    this.on(`${CreateGameEvent}--error`, callback);
  }

  public onGameJoined(callback: (gameData: GameListing) => void): void {
    this.on(`${JoinGameEvent}--success`, callback);
    this.on(`${JoinGameEvent}--error`, callback);
  }

  public onGameStarted(callback: (gameData: GameListing) => void): void {
    this.on(`${StartGameEvent}--success`, callback);
    this.on(`${StartGameEvent}--error`, callback);
  }

  public onPlayerJoined(callback: (gameData: GameListing) => void): void {
    this.on(`player-joined`, callback);
  }

  public onPlayerLeft(callback: (gameData: GameListing) => void): void {
    this.on(`player-left`, callback);
  }
}

export const socketService = SocketService.getInstance(); 