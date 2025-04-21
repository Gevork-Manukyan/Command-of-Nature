import { z } from 'zod';
import { Card, Decklist, Sage } from './card-types';

/* ----------- GAME STATE ----------- */
export type GameListing = {
    id: string;
    gameName: string;
    isPrivate: boolean;
    numPlayersTotal: number;
    numCurrentPlayers: number;
}

export type Player = {
    socketId: string;
    isReady: boolean;
    isSetup: boolean;
    hasChosenWarriors: boolean;
    isGameHost: boolean;
    sage: Sage;
    decklist: Decklist;
    level: number;
    hand: Card[];
    deck: Card[];
    discardPile: Card[];
}

/* ----------- GAME SETUP ----------- */
export const OnePlayerSpaceOptionsSchema = z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
]);

export const AllSpaceOptionsSchema = z.union([
z.literal(1),
z.literal(2),
z.literal(3),
z.literal(4),
z.literal(5),
z.literal(6),
z.literal(7),
z.literal(8),
z.literal(9),
z.literal(10),
z.literal(11),
z.literal(12),
]);
  
export const SpaceOptionsSchema = z.union([OnePlayerSpaceOptionsSchema, AllSpaceOptionsSchema]);

export type OnePlayerSpaceOptions = z.infer<typeof OnePlayerSpaceOptionsSchema>;
export type TwoPlayerSpaceOptions = z.infer<typeof AllSpaceOptionsSchema>;
export type SpaceOption = z.infer<typeof SpaceOptionsSchema>;

/* ----------- GAMEPLAY EVENTS ----------- */
export const CreateGameEvent = "create-game";
export const JoinGameEvent = "join-game";
export const PlayerJoinedEvent = "player-joined";
export const PlayerLeftEvent = "player-left";
export const SelectSageEvent = "select-sage";
export const SageSelectedEvent = "sage-selected";
export const AllSagesSelectedEvent = "all-sages-selected";
export const ToggleReadyStatusEvent = "toggle-ready-status";
export const ReadyStatusReadyEvent = "ready-status--ready";
export const ReadyStatusNotReadyEvent = "ready-status--not-ready";
export const JoinTeamEvent = "join-team";
export const TeamJoinedEvent = "team-joined";
export const ClearTeamsEvent = "clear-teams";
export const AllTeamsJoinedEvent = "all-teams-joined";
export const StartGameEvent = "start-game";
export const ChoseWarriorsEvent = "chose-warriors";
export const PickWarriorsEvent = "pick-warriors";
export const SwapWarriorsEvent = "swap-warriors";
export const PlayerFinishedSetupEvent = "player-finished-setup";
export const CancelSetupEvent = "cancel-setup";
export const AllPlayersSetupEvent = "all-players-setup";
export const ExitGameEvent = "exit-game";
export const RejoinGameEvent = "rejoin-game";
export const PlayerRejoinedEvent = "player-rejoined";
export const LeaveGameEvent = "leave-game";
export const GetDayBreakCardsEvent = "get-day-break-cards";
export const ActivateDayBreakEvent = "activate-day-break";
export const StartTurnEvent = "start-turn";
export const WaitingTurnEvent = "waiting-turn";

export const DebugEvent = "debug";