"use server";
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
  ChooseWarriorsData,
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
import { getSetupUrl, getSetupUrlWithGameId, getGameplayUrlWithGameId } from "./game-api-util";

/* ------------ Setup Endpoints ------------ */
export async function createGame(data: CreateGameData) {
  return getSetupUrl('/create', data, 'POST');
}

export async function joinGame(data: JoinGameData) {
  return getSetupUrl('/join', data, 'POST');
}

export async function rejoinGame(data: RejoinGameData) {
  return getSetupUrl('/rejoin', data, 'POST');
}

export async function selectSage(gameId: string, data: SelectSageData) {
  return getSetupUrlWithGameId('/sage', gameId, data, 'POST');
}

export async function allSagesSelected(gameId: string, data: AllSagesSelectedData) {
  return getSetupUrlWithGameId('/all-sages-selected', gameId, data, 'POST');
}

export async function joinTeam(gameId: string, data: JoinTeamData) {
  return getSetupUrlWithGameId('/join-team', gameId, data, 'POST');
}

export async function clearTeams(gameId: string, data: ClearTeamsData) {
  return getSetupUrlWithGameId('/clear-teams', gameId, data, 'POST');
}

export async function allTeamsJoined(gameId: string, data: AllTeamsJoinedData) {
  return getSetupUrlWithGameId('/all-teams-joined', gameId, data, 'POST');
}

export async function toggleReady(gameId: string, data: ToggleReadyStatusData) {
  return getSetupUrlWithGameId('/toggle-ready', gameId, data, 'POST');
}

export async function startGame(gameId: string, data: StartGameData) {
  return getSetupUrlWithGameId('/start', gameId, data, 'POST');
}

export async function chooseWarriors(gameId: string, data: ChooseWarriorsData) {
  return getSetupUrlWithGameId('/choose-warriors', gameId, data, 'POST');
}

export async function swapWarriors(gameId: string, data: SwapWarriorsData) {
  return getSetupUrlWithGameId('/swap-warriors', gameId, data, 'POST');
}

export async function finishSetup(gameId: string, data: PlayerFinishedSetupData) {
  return getSetupUrlWithGameId('/finish-setup', gameId, data, 'POST');
}

export async function cancelSetup(gameId: string, data: CancelSetupData) {
  return getSetupUrlWithGameId('/cancel-setup', gameId, data, 'POST');
}

export async function allPlayersSetup(gameId: string, data: AllPlayersSetupData) {
  return getSetupUrlWithGameId('/all-players-setup', gameId, data, 'POST');
}


/* ------------ Gameplay Endpoints ------------ */
// just go back to the lobby
export async function exitGame(gameId: string, data: ExitGameData) {
  return getGameplayUrlWithGameId('/exit', gameId, data, 'POST');
}

// leave the game and the session
export async function leaveGame(gameId: string, data: LeaveGameData) {
  return getGameplayUrlWithGameId('/leave', gameId, data, 'POST');
}

export async function getDayBreakCards(gameId: string, data: GetDayBreakCardsData) {
  return getGameplayUrlWithGameId('/day-break-cards', gameId, data, 'POST');
}

export async function activateDayBreak(gameId: string, data: ActivateDayBreakData) {
  return getGameplayUrlWithGameId('/activate-day-break', gameId, data, 'POST');
}