import { z } from "zod";
import { AllSpaceOptionsSchema } from "./game-setup-types";
import { ElementalWarriorStarterCardSchema, SageSchema } from "./card-types";
import { CreateGameEvent, JoinGameEvent, SelectSageEvent, AllSagesSelectedEvent, ToggleReadyStatusEvent, JoinTeamEvent, ClearTeamsEvent, AllTeamsJoinedEvent, StartGameEvent, ChoseWarriorsEvent, SwapWarriorsEvent, PlayerFinishedSetupEvent, CancelSetupEvent, AllPlayersSetupEvent, ExitGameEvent, RejoinGameEvent, LeaveGameEvent, GetDayBreakCardsEvent, ActivateDayBreakEvent, DebugEvent } from "./game-events";

const createGameSchema = z.object({
  userId: z.string(),
  gameName: z.string(),
  numPlayers: z.union([z.literal(2), z.literal(4)]),
  isPrivate: z.boolean().default(false),
  password: z.string().optional(),
})

const joinGameSchema = z.object({
  userId: z.string(),
  gameId: z.string(),
  password: z.string().optional(),
});

const selectSageSchema = z.object({
  gameId: z.string(),
  sage: SageSchema,
});

const allSagesSelectedSchema = z.object({
  gameId: z.string(),
});

const toggleReadyStatusSchema = z.object({
  gameId: z.string(),
});

const joinTeamSchema = z.object({
  gameId: z.string(),
  team: z.union([z.literal(1), z.literal(2)]),
});

const clearTeamsSchema = z.object({
  gameId: z.string(),
});

const allTeamsJoinedSchema = z.object({
  gameId: z.string(),
});

const startGameSchema = z.object({
  gameId: z.string(),
});

const choseWarriorsSchema = z.object({
  gameId: z.string(),
  choices: z.tuple([ElementalWarriorStarterCardSchema, ElementalWarriorStarterCardSchema]),
});

const swapWarriorsSchema = z.object({
  gameId: z.string(),
})

const playerFinishedSetupSchema = z.object({
  gameId: z.string(),
});

const cancelSetupSchema = z.object({
  gameId: z.string(),
})

const allPlayersSetupSchema = z.object({
  gameId: z.string(),
})

const exitGameSchema = z.object({
  gameId: z.string(),
})

const rejoinGameSchema = z.object({
  gameId: z.string(),
  userId: z.string(),
})

const leaveGameSchema = z.object({
  gameId: z.string(),
});

const getDayBreakCardsSchema = z.object({
  gameId: z.string(),
});

const activateDayBreakSchema = z.object({
  gameId: z.string(),
  spaceOption: AllSpaceOptionsSchema,
});

const debugSchema = z.object({
  
});

// Define EventSchemas record
export const EventSchemas = {
  [CreateGameEvent]: createGameSchema,
  [JoinGameEvent]: joinGameSchema,
  [SelectSageEvent]: selectSageSchema,
  [AllSagesSelectedEvent]: allSagesSelectedSchema,
  [ToggleReadyStatusEvent]: toggleReadyStatusSchema,
  [JoinTeamEvent]: joinTeamSchema,
  [ClearTeamsEvent]: clearTeamsSchema,
  [AllTeamsJoinedEvent]: allTeamsJoinedSchema,
  [StartGameEvent]: startGameSchema,
  [ChoseWarriorsEvent]: choseWarriorsSchema,
  [SwapWarriorsEvent]: swapWarriorsSchema,
  [PlayerFinishedSetupEvent]: playerFinishedSetupSchema,
  [CancelSetupEvent]: cancelSetupSchema,
  [AllPlayersSetupEvent]: allPlayersSetupSchema,
  [ExitGameEvent]: exitGameSchema,
  [RejoinGameEvent]: rejoinGameSchema,
  [LeaveGameEvent]: leaveGameSchema,
  [GetDayBreakCardsEvent]: getDayBreakCardsSchema,
  [ActivateDayBreakEvent]: activateDayBreakSchema,
  [DebugEvent]: debugSchema,
} as const;

// Infer the types from the schemas directly
export type CreateGameData = z.infer<typeof createGameSchema>;
export type JoinGameData = z.infer<typeof joinGameSchema>;
export type SelectSageData = z.infer<typeof selectSageSchema>;
export type AllSagesSelectedData = z.infer<typeof allSagesSelectedSchema>;
export type ToggleReadyStatusData = z.infer<typeof toggleReadyStatusSchema>;
export type JoinTeamData = z.infer<typeof joinTeamSchema>;
export type ClearTeamsData = z.infer<typeof clearTeamsSchema>;
export type AllTeamsJoinedData = z.infer<typeof allTeamsJoinedSchema>;
export type StartGameData = z.infer<typeof startGameSchema>;
export type ChoseWarriorsData = z.infer<typeof choseWarriorsSchema>;
export type SwapWarriorsData = z.infer<typeof swapWarriorsSchema>;
export type PlayerFinishedSetupData = z.infer<typeof playerFinishedSetupSchema>;
export type CancelSetupData = z.infer<typeof cancelSetupSchema>;
export type AllPlayersSetupData = z.infer<typeof allPlayersSetupSchema>;
export type ExitGameData = z.infer<typeof exitGameSchema>;
export type RejoinGameData = z.infer<typeof rejoinGameSchema>;
export type LeaveGameData = z.infer<typeof leaveGameSchema>;
export type GetDayBreakCardsData = z.infer<typeof getDayBreakCardsSchema>;
export type ActivateDayBreakData = z.infer<typeof activateDayBreakSchema>;
export type DebugData = z.infer<typeof debugSchema>;

// Create a mapped type for socket events
export type SocketEventMap = {
  [CreateGameEvent]: CreateGameData;
  [JoinGameEvent]: JoinGameData;
  [SelectSageEvent]: SelectSageData;
  [AllSagesSelectedEvent]: AllSagesSelectedData;
  [ToggleReadyStatusEvent]: ToggleReadyStatusData;
  [JoinTeamEvent]: JoinTeamData;
  [ClearTeamsEvent]: ClearTeamsData;
  [AllTeamsJoinedEvent]: AllTeamsJoinedData;
  [StartGameEvent]: StartGameData;
  [ChoseWarriorsEvent]: ChoseWarriorsData;
  [SwapWarriorsEvent]: SwapWarriorsData;
  [PlayerFinishedSetupEvent]: PlayerFinishedSetupData;
  [CancelSetupEvent]: CancelSetupData;
  [AllPlayersSetupEvent]: AllPlayersSetupData;
  [ExitGameEvent]: ExitGameData;
  [RejoinGameEvent]: RejoinGameData;
  [LeaveGameEvent]: LeaveGameData;
  [GetDayBreakCardsEvent]: GetDayBreakCardsData;
  [ActivateDayBreakEvent]: ActivateDayBreakData;
  [DebugEvent]: DebugData;
}