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

  private baseUrl = 'http://localhost:3000/api/games';

  private async fetch(endpoint: string, data: any, method: string) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Game Listings
  async getAllGames(isStarted?: boolean) {
    const query = isStarted !== undefined ? `?isStarted=${isStarted}` : '';
    return this.fetch(`/listings${query}`, {}, 'GET');
  }

  // Setup Endpoints
  async createGame(data: CreateGameData) {
    return this.fetch('/setup/create', data, 'POST');
  }

  async joinGame(data: JoinGameData) {
    return this.fetch('/setup/join', data, 'POST');
  }

  async rejoinGame(data: RejoinGameData) {
    return this.fetch('/setup/rejoin', data, 'POST');
  }

  async selectSage(data: SelectSageData) {
    return this.fetch(`/setup/${data.gameId}/sage`, data, 'POST');
  }

  async allSagesSelected(data: AllSagesSelectedData) {
    return this.fetch(`/setup/${data.gameId}/all-sages-selected`, data, 'POST');
  }

  async joinTeam(data: JoinTeamData) {
    return this.fetch(`/setup/${data.gameId}/join-team`, data, 'POST');
  }

  async clearTeams(data: ClearTeamsData) {
    return this.fetch(`/setup/${data.gameId}/clear-teams`, data, 'POST');
  }

  async allTeamsJoined(data: AllTeamsJoinedData) {
    return this.fetch(`/setup/${data.gameId}/all-teams-joined`, data, 'POST');
  }

  async toggleReady(data: ToggleReadyStatusData) {
    return this.fetch(`/setup/${data.gameId}/toggle-ready`, data, 'POST');
  }

  async startGame(data: StartGameData) {
    return this.fetch(`/setup/${data.gameId}/start`, data, 'POST');
  }

  async chooseWarriors(data: ChoseWarriorsData) {
    return this.fetch(`/setup/${data.gameId}/choose-warriors`, data, 'POST');
  }

  async swapWarriors(data: SwapWarriorsData) {
    return this.fetch(`/setup/${data.gameId}/swap-warriors`, data, 'POST');
  }

  async finishSetup(data: PlayerFinishedSetupData) {
    return this.fetch(`/setup/${data.gameId}/finish-setup`, data, 'POST');
  }

  async cancelSetup(data: CancelSetupData) {
    return this.fetch(`/setup/${data.gameId}/cancel-setup`, data, 'POST');
  }

  async allPlayersSetup(data: AllPlayersSetupData) {
    return this.fetch(`/setup/${data.gameId}/all-players-setup`, data, 'POST');
  }

  async exitGame(data: ExitGameData) {
    return this.fetch(`/setup/${data.gameId}/exit`, data, 'POST');
  }

  async leaveGame(data: LeaveGameData) {
    return this.fetch(`/setup/${data.gameId}/leave`, data, 'POST');
  }

  // Gameplay Endpoints
  async getDayBreakCards(data: GetDayBreakCardsData) {
    return this.fetch(`/gameplay/${data.gameId}/day-break-cards`, data, 'POST');
  }

  async activateDayBreak(data: ActivateDayBreakData) {
    return this.fetch(`/gameplay/${data.gameId}/activate-day-break`, data, 'POST');
  }
}

export default GameApiClient;