export type GameListing = {
    id: string;
    gameName: string;
    isPrivate: boolean;
    numPlayersTotal: number;
    numCurrentPlayers: number;
}

/* ----------- GAMEPLAY EVENTS ----------- */
export const CreateGameEvent = "create-game";
export const JoinGameEvent = "join-game";
export const SelectSageEvent = "select-sage";
export const AllSagesSelectedEvent = "all-sages-selected";
export const ToggleReadyStatusEvent = "toggle-ready-status";
export const JoinTeamEvent = "join-team";
export const ClearTeamsEvent = "clear-teams";
export const AllTeamsJoinedEvent = "all-teams-joined";
export const StartGameEvent = "start-game";
export const ChoseWarriorsEvent = "chose-warriors";
export const SwapWarriorsEvent = "swap-warriors";
export const PlayerFinishedSetupEvent = "player-finished-setup";
export const CancelSetupEvent = "cancel-setup";
export const AllPlayersSetupEvent = "all-players-setup";
export const ExitGameEvent = "exit-game";
export const RejoinGameEvent = "rejoin-game";
export const LeaveGameEvent = "leave-game";
export const GetDayBreakCardsEvent = "get-day-break-cards";
export const ActivateDayBreakEvent = "activate-day-break";
export const DebugEvent = "debug";