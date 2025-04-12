import { apiClient } from "@/lib/client/api-client";
import { GameListing } from "@command-of-nature/shared-types";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { getFromLocalStorage, setToLocalStorage, USER, GAME_SESSION, removeFromLocalStorage } from '@/lib/client/localstorage';
import { socketService } from '@/services/socket.service';

interface GameSettings {
    numPlayers: number;
    gameName: string;
    isPrivate: boolean;
    password?: string;
  }

function useLobby() {
    const [currentGames, setCurrentGames] = useState<GameListing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [error, setError] = useState<string>('');
    const [currentSession, setCurrentSession] = useState<GameListing | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [connectionError, setConnectionError] = useState<string>('');
    const [isCreatingGame, setIsCreatingGame] = useState(false);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                setIsLoading(true);
                const response = await apiClient.getAllNewGames();
                
                if (response.error) {
                    throw new Error(response.error);
                }

                setCurrentGames(response.data || []);
            } catch (err) {
                console.error('Failed to fetch games:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGames();
    }, []);
  
    // Load existing session on mount
    useEffect(() => {
      const session = getFromLocalStorage<GameListing>(GAME_SESSION);
      if (session) {
        setCurrentSession(session);
      }
    }, []);
  
    const setupSocketListeners = () => {
      socketService.onGameCreated((gameData) => {
        setError('');
        setShowModal(false);
        setIsCreatingGame(false);
        
        const gameSession: GameListing = {
          id: gameData.id,
          gameName: gameData.gameName,
          isPrivate: gameData.isPrivate,
          numPlayersTotal: gameData.numPlayersTotal,
          numCurrentPlayers: gameData.numCurrentPlayers,
        };
  
        setToLocalStorage(GAME_SESSION, gameSession);
        setCurrentSession(gameSession);
        router.push(`/game/${gameSession.id}`);
      });
  
      socketService.onGameJoined((gameData) => {
        setError('');
        setIsCreatingGame(false);
        
        const gameSession: GameListing = {
          id: gameData.id,
          gameName: gameData.gameName,
          isPrivate: gameData.isPrivate,
          numPlayersTotal: gameData.numPlayersTotal,
          numCurrentPlayers: gameData.numCurrentPlayers,
        };
        
        setToLocalStorage(GAME_SESSION, gameSession);
        setCurrentSession(gameSession);
        router.push(`/game/${gameSession.id}`);
      });
  
      socketService.onGameError((error) => {
        const errorMessages: Record<string, string> = {
          'A player with this socket ID already exists in the game': 'You are already connected to this game',
          'You are already in this game': 'You are already in this game',
          'Cannot add more players': 'This game is full',
          'Game not found': 'This game no longer exists',
          'Invalid password': 'Incorrect password for this game'
        };
        setError(errorMessages[error.message] || error.message || 'An error occurred');
        setIsCreatingGame(false);
      });
  
      socketService.on('connection-error', (error) => {
        setConnectionError(error.message || 'Failed to connect to game server');
        setIsCreatingGame(false);
      });
    };
  
    const connectToSocket = async () => {
      await socketService.connect();
      setupSocketListeners();
    }
  
    const handleCreateGame = async (settings: GameSettings) => {
      try {
        setConnectionError('');
        setError('');
        setIsCreatingGame(true);
  
        await connectToSocket();
        
        const userId = getFromLocalStorage(USER) as string;
        if (!userId) {
          throw new Error('User ID not found');
        }
  
        await socketService.createGame(userId, settings);
      } catch (error) {
        console.error('Failed to create game:', error);
        setError('Failed to create game. Please try again.');
        setIsCreatingGame(false);
      }
    };
  
    const handleJoinGame = async (gameId: string, password?: string) => {
      try {
        setConnectionError('');
        setError('');
  
        await connectToSocket();
  
        const userId = getFromLocalStorage(USER) as string;
        if (!userId) {
          throw new Error('User ID not found');
        }
        await socketService.joinGame(userId, gameId, password);
      } catch (error) {
        console.error('Failed to join game:', error);
        setError('Failed to join game. Please try again.');
      }
    };
  
    const handleLogout = async () => {
      try {
        const { error } = await apiClient.logout();
        if (error) {
          throw new Error(error);
        }
        removeFromLocalStorage(USER);
        router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
        removeFromLocalStorage(USER);
        router.push('/login');
      }
    };

    return {
        currentGames,
        isLoading,
        error,
        currentSession,
        showModal,
        setShowModal,
        connectionError,
        isCreatingGame,
        handleCreateGame,
        handleLogout,
        handleJoinGame,
    };
}

export default useLobby;