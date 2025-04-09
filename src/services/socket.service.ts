import { io, Socket } from 'socket.io-client';
import { GameSession } from '@/lib/types';

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private listeners: Map<string, ((...args: any[]) => void)[]> = new Map();

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(url: string): void {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(url);

    // Re-register all existing listeners
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this.socket?.on(event, callback);
      });
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
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

  public emit(event: string, ...args: any[]): void {
    this.socket?.emit(event, ...args);
  }

  // Game-specific methods
  public createGame(settings: {
    numPlayers: number;
    gameName: string;
    isPrivate: boolean;
    password?: string;
  }): void {
    this.emit('create-game', settings);
  }

  public joinGame(gameId: string, password?: string): void {
    this.emit('join-game', { gameId, password });
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
  public onGameCreated(callback: (gameData: GameSession) => void): void {
    this.on('create-game--success', callback);
  }

  public onGameJoined(callback: (gameData: GameSession) => void): void {
    this.on('join-game--success', callback);
  }

  public onGameError(callback: (error: { message: string }) => void): void {
    this.on('create-game--error', callback);
    this.on('join-game--error', callback);
  }

  public onCurrentGames(callback: (games: GameSession[]) => void): void {
    this.on('current-games', callback);
  }

  public onGameStarted(callback: (gameData: GameSession) => void): void {
    this.on('game-started', callback);
  }

  public onPlayerJoined(callback: (gameData: GameSession) => void): void {
    this.on('player-joined', callback);
  }

  public onPlayerLeft(callback: (gameData: GameSession) => void): void {
    this.on('player-left', callback);
  }
}

export const socketService = SocketService.getInstance(); 