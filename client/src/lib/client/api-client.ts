import { GameListing } from "@shared-types";
import { UserResponse } from "../zod-schemas";

type ApiResponse<T> = {
  data?: T;
  error?: string;
  status: number;
};

class ApiClient {
  private defaultHeaders: HeadersInit;

  constructor() {
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // For Next.js API routes, we don't need to prepend the base URL
      // as the browser will handle the relative path correctly
      const response = await fetch(endpoint, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        // Add credentials to ensure cookies are sent with the request
        credentials: 'include',
      });

      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      return {
        data: response.ok ? data : undefined,
        error: !response.ok ? (typeof data === 'object' ? data.error : 'An error occurred') : undefined,
        status: response.status,
      };
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        error: 'Network error occurred',
        status: 500,
      };
    }
  }

  // Auth methods
  async register(data: { username: string; password: string }) {
    return this.request<UserResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { username: string; password: string }) {
    return this.request<UserResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  // Game methods
  async joinGame(userId: string, gameId: string) {
    return this.request(`/api/users/${userId}/games`, {
      method: 'POST',
      body: JSON.stringify({ gameId, action: 'join' }),
    });
  }

  async leaveGame(userId: string, gameId: string) {
    return this.request(`/api/users/${userId}/games`, {
      method: 'POST',
      body: JSON.stringify({ gameId, action: 'leave' }),
    });
  }

  async getActiveGames(userId: string) {
    return this.request(`/api/users/${userId}/games`);
  }

  async getAllNewGames(): Promise<ApiResponse<GameListing[]>> {
    return this.request<GameListing[]>('/api/game/all-new-games');
  }
}

export const apiClient = new ApiClient(); 