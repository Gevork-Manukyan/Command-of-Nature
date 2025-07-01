import { 
  CreateGameData, 
  JoinGameData, 
  SelectSageData,
  AllSagesSelectedData,
  JoinTeamData,
  ClearTeamsData,
  AllTeamsJoinedData,
  ToggleReadyStatusData,
  StartGameData,
  ChoseWarriorsData,
  SwapWarriorsData,
  PlayerFinishedSetupData,
  CancelSetupData,
  AllPlayersSetupData,
  ExitGameData,
  RejoinGameData,
  LeaveGameData,
  GetDayBreakCardsData,
  ActivateDayBreakData
} from "@shared-types/server-types";

class GameApiClient {
  private static instance: GameApiClient;
  private baseUrl = 'http://localhost:3000/api/games';
  private constructor() {}

  private async fetch(endpoint: string, data: any, method: string) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  public static getInstance(): GameApiClient {
    if (!GameApiClient.instance) {
      GameApiClient.instance = new GameApiClient();
    }
    return GameApiClient.instance;
  }

  // Game Listings
  async getAllGames(isStarted?: boolean) {
    const query = isStarted !== undefined ? `?isStarted=${isStarted}` : '';
    return this.fetch(`/listings${query}`, {}, 'GET');
  }

  // Setup Endpoints
  private getSetupUrl(url: string, data: any, method: string) {
    return this.fetch(`/setup${url}`, data, method);
  }

  private getSetupUrlWithGameId(url: string, gameId: string, data: any, method: string) {
    return this.getSetupUrl(`/${gameId}${url}`, data, method);
  }
  
  async createGame(data: CreateGameData) {
    return this.getSetupUrl('/create', data, 'POST');
  }

  async joinGame(data: JoinGameData) {
    return this.getSetupUrl('/join', data, 'POST');
  }

  async rejoinGame(data: RejoinGameData) {
    return this.getSetupUrl('/rejoin', data, 'POST');
  }

  async selectSage(gameId: string, data: SelectSageData) {
    return this.getSetupUrlWithGameId('/sage', gameId, data, 'POST');
  }

  async allSagesSelected(gameId: string, data: AllSagesSelectedData) {
    return this.getSetupUrlWithGameId('/all-sages-selected', gameId, data, 'POST');
  }

  async joinTeam(gameId: string, data: JoinTeamData) {
    return this.getSetupUrlWithGameId('/join-team', gameId, data, 'POST');
  }

  async clearTeams(gameId: string, data: ClearTeamsData) {
    return this.getSetupUrlWithGameId('/clear-teams', gameId, data, 'POST');
  }

  async allTeamsJoined(gameId: string, data: AllTeamsJoinedData) {
    return this.getSetupUrlWithGameId('/all-teams-joined', gameId, data, 'POST');
  }

  async toggleReady(gameId: string, data: ToggleReadyStatusData) {
    return this.getSetupUrlWithGameId('/toggle-ready', gameId, data, 'POST');
  }

  async startGame(gameId: string, data: StartGameData) {
    return this.getSetupUrlWithGameId('/start', gameId, data, 'POST');
  }

  async chooseWarriors(gameId: string, data: ChoseWarriorsData) {
    return this.getSetupUrlWithGameId('/choose-warriors', gameId, data, 'POST');
  }

  async swapWarriors(gameId: string, data: SwapWarriorsData) {
    return this.getSetupUrlWithGameId('/swap-warriors', gameId, data, 'POST');
  }

  async finishSetup(gameId: string, data: PlayerFinishedSetupData) {
    return this.getSetupUrlWithGameId('/finish-setup', gameId, data, 'POST');
  }

  async cancelSetup(gameId: string, data: CancelSetupData) {
    return this.getSetupUrlWithGameId('/cancel-setup', gameId, data, 'POST');
  }

  async allPlayersSetup(gameId: string, data: AllPlayersSetupData) {
    return this.getSetupUrlWithGameId('/all-players-setup', gameId, data, 'POST');
  }

  async exitGame(gameId: string, data: ExitGameData) {
    return this.getSetupUrlWithGameId('/exit', gameId, data, 'POST');
  }

  async leaveGame(gameId: string, data: LeaveGameData) {
    return this.getSetupUrlWithGameId('/leave', gameId, data, 'POST');
  }

  // Gameplay Endpoints
  private getGameplayUrlWithGameId(url: string, gameId: string, data: any, method: string) {
    return this.fetch(`/gameplay/${gameId}${url}`, data, method);
  }
  
  async getDayBreakCards(gameId: string, data: GetDayBreakCardsData) {
    return this.getGameplayUrlWithGameId('/day-break-cards', gameId, data, 'POST');
  }

  async activateDayBreak(gameId: string, data: ActivateDayBreakData) {
    return this.getGameplayUrlWithGameId('/activate-day-break', gameId, data, 'POST');
  }
}

export const gameApiClient = GameApiClient.getInstance();