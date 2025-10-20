// UNIVERSAL EVENTS
export const RegisterUserSocketEvent = "register-user-socket";
export const CreateGameEvent = "create-game";
export const JoinGameEvent = "join-game";
export const PlayerJoinedEvent = "player-joined";
export const PlayerLeftEvent = "player-left";
export const PlayerRejoinedEvent = "player-rejoined";
export const AllPlayersJoinedEvent = "all-players-joined";
export const ExitGameEvent = "exit-game";
export const VerifySessionEvent = "verify-session";
export const LeaveGameEvent = "leave-game";

// SET UP EVENTS
export const SelectSageEvent = "select-sage";
export const GetSelectedSagesEvent = "get-selected-sages";
export const SageSelectedEvent = "sage-selected";
export const AllSagesSelectedEvent = "all-sages-selected";
export const UserSetupDataEvent = "user-setup-data";
export const ToggleReadyStatusEvent = "toggle-ready-status";
export const ReadyStatusToggledEvent = "ready-status-toggled";
export const JoinTeamEvent = "join-team";
export const TeamJoinedEvent = "team-joined";
export const ClearTeamsEvent = "clear-teams";
export const TeamsClearedEvent = "teams-cleared";
export const AllTeamsJoinedEvent = "all-teams-joined";
export const StartGameEvent = "start-game";
export const PickWarriorsEvent = "pick-warriors";       // Server sends to client; time to pick warriors
export const ChooseWarriorsEvent = "choose-warriors";   // Client sends to server; warriors chosen by user
export const SwapWarriorsEvent = "swap-warriors";
export const PlayerFinishedSetupEvent = "player-finished-setup";
export const CancelSetupEvent = "cancel-setup";
export const AllPlayersSetupStatusEvent = "all-players-setup-status";
export const BeginBattleEvent = "begin-battle";

// GAMEPLAY EVENTS
export const StartTurnEvent = "start-turn";
export const WaitingTurnEvent = "waiting-turn";
export const EndTurnEvent = "end-turn";
export const ActivateDayBreakEvent = "activate-day-break";
export const SummonElementalEvent = "summon-elemental";
export const PlayItemCardEvent = "play-item-card";
export const SwapTwoElementalsEvent = "swap-two-elementals";
export const DrawCardEvent = "draw-card";
export const SageLevelUpEvent = "sage-level-up";
export const BuyItemCardEvent = "buy-item-card";
export const BuyElementalCardEvent = "buy-elemental-card";
export const SellCardEvent = "sell-card";
export const RefreshMarketEvent = "refresh-market";

// Game state update events
export const GameStateUpdatedEvent = "game-state-updated";
export const HandUpdatedEvent = "hand-updated";
export const BattlefieldUpdatedEvent = "battlefield-updated";
export const ShopUpdatedEvent = "shop-updated";
export const PhaseChangedEvent = "phase-changed";
export const TurnChangedEvent = "turn-changed";
export const ActionPointsChangedEvent = "action-points-changed";