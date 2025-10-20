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
    BeginBattleData,
    ExitGameData,
    VerifySessionData,
    LeaveGameData,
    GetDayBreakCardsData,
    ActivateDayBreakData,
    GetSelectedSagesData,
    AllPlayersJoinedData,
} from "@shared-types/server-types";
import {
    getSetupUrl,
    getSetupUrlWithGameId,
    getGameplayUrlWithGameId,
} from "./game-api-util";
import { GameListingSchema } from "@shared-types";

/* ------------ General Endpoints ------------ */
export async function getCurrentPhase(gameId: string) {
    return getGameplayUrlWithGameId("/current-phase", gameId, {}, "GET");
}

export async function getUserSetupData(gameId: string, userId: string) {
    return getSetupUrlWithGameId("/user-setup-data", gameId, { userId }, "GET");
}

export async function getUserWarriorSelectionData(gameId: string, userId: string) {
    return getSetupUrlWithGameId("/user-warrior-selection-data", gameId, { userId }, "GET");
}

/* ------------ Setup Endpoints ------------ */
export async function createGame(data: CreateGameData) {
    const response = await getSetupUrl("/create", data, "POST");
    const validatedResponse = GameListingSchema.parse(response);
    return validatedResponse;
}

export async function joinGame(data: JoinGameData) {
    const response = await getSetupUrl("/join", data, "POST");
    const validatedResponse = GameListingSchema.parse(response);
    return validatedResponse;
}

export async function verifySession(data: VerifySessionData) {
    const response = await getSetupUrl("/verify-session", data, "POST");
    const validatedResponse = GameListingSchema.parse(response);
    return validatedResponse;
}

export async function allPlayersJoined(gameId: string, data: AllPlayersJoinedData) {
    return getSetupUrlWithGameId("/all-players-joined", gameId, data, "POST");
}

export async function selectSage(gameId: string, data: SelectSageData) {
    return getSetupUrlWithGameId("/sage", gameId, data, "POST");
}

export async function getSelectedSages(gameId: string, data: GetSelectedSagesData) {
    return getSetupUrlWithGameId("/selected-sages", gameId, data, "GET");
}

export async function allSagesSelected( gameId: string, data: AllSagesSelectedData) {
    return getSetupUrlWithGameId("/all-sages-selected", gameId, data, "POST");
}

export async function joinTeam(gameId: string, data: JoinTeamData) {
    return getSetupUrlWithGameId("/join-team", gameId, data, "POST");
}

export async function clearTeams(gameId: string, data: ClearTeamsData) {
    return getSetupUrlWithGameId("/clear-teams", gameId, data, "POST");
}

export async function allTeamsJoined(gameId: string, data: AllTeamsJoinedData) {
    return getSetupUrlWithGameId("/all-teams-joined", gameId, data, "POST");
}

export async function toggleReady(gameId: string, data: ToggleReadyStatusData) {
    return getSetupUrlWithGameId("/toggle-ready", gameId, data, "POST");
}

export async function startGame(gameId: string, data: StartGameData) {
    return getSetupUrlWithGameId("/start", gameId, data, "POST");
}

export async function isGameStarted(gameId: string) {
    return getSetupUrlWithGameId("/is-started", gameId, {}, "GET");
}

export async function chooseWarriors(gameId: string, data: ChooseWarriorsData) {
    return getSetupUrlWithGameId("/choose-warriors", gameId, data, "POST");
}

export async function swapWarriors(gameId: string, data: SwapWarriorsData) {
    return getSetupUrlWithGameId("/swap-warriors", gameId, data, "POST");
}

export async function finishSetup(gameId: string, data: PlayerFinishedSetupData) {
    return getSetupUrlWithGameId("/finish-setup", gameId, data, "POST");
}

export async function cancelSetup(gameId: string, data: CancelSetupData) {
    return getSetupUrlWithGameId("/cancel-setup", gameId, data, "POST");
}

export async function beginBattle(gameId: string, data: BeginBattleData) {
    return getSetupUrlWithGameId("/begin-battle", gameId, data, "POST");
}

/* ------------ Gameplay Endpoints ------------ */
// just go back to the lobby
export async function exitGame(gameId: string, data: ExitGameData) {
    return getGameplayUrlWithGameId("/exit", gameId, data, "POST");
}

// leave the game and the session
export async function leaveGame(gameId: string, data: LeaveGameData) {
    return getGameplayUrlWithGameId(
        "/leave",
        gameId,
        data,
        "POST"
    );
}

export async function getDayBreakCards(
    gameId: string,
    data: GetDayBreakCardsData
) {
    return getGameplayUrlWithGameId("/day-break-cards", gameId, data, "GET");
}

export async function activateDayBreak(
    gameId: string,
    data: ActivateDayBreakData
) {
    return getGameplayUrlWithGameId(
        "/activate-day-break",
        gameId,
        data,
        "POST"
    );
}

/* ------------ Gameplay Data Endpoints ------------ */
export async function getGameState(gameId: string, userId: string) {
    return getGameplayUrlWithGameId("/game-state", gameId, { userId }, "GET");
}

export async function getTeamHands(gameId: string, userId: string) {
    return getGameplayUrlWithGameId("/team-hands", gameId, { userId }, "GET");
}