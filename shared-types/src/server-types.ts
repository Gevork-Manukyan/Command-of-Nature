import { z } from "zod";
import { AllSpaceOptionsSchema } from "./game-setup-types";
import { ElementalWarriorStarterCardSchema, SageSchema } from "./card-types";
import { CreateGameEvent, JoinGameEvent, SelectSageEvent, AllSagesSelectedEvent, ToggleReadyStatusEvent, JoinTeamEvent, ClearTeamsEvent, AllTeamsJoinedEvent, StartGameEvent, ChooseWarriorsEvent, SwapWarriorsEvent, PlayerFinishedSetupEvent, CancelSetupEvent, AllPlayersSetupEvent, ExitGameEvent, RejoinGameEvent, LeaveGameEvent, GetDayBreakCardsEvent, ActivateDayBreakEvent, RegisterUserSocketEvent } from "./game-events";

const registerUserSocketSchema = z.object({
  userId: z.string(),
});

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

const rejoinGameSchema = z.object({
  userId: z.string(),
  gameId: z.string(),
})

const selectSageSchema = z.object({
  userId: z.string(),
  sage: SageSchema,
});

const allSagesSelectedSchema = z.object({
  userId: z.string(),
});

const toggleReadyStatusSchema = z.object({
  userId: z.string(),
});

const joinTeamSchema = z.object({
  userId: z.string(),
  team: z.union([z.literal(1), z.literal(2)]),
});

const clearTeamsSchema = z.object({
  userId: z.string(),
});

const allTeamsJoinedSchema = z.object({
  userId: z.string(),
});

const startGameSchema = z.object({
  userId: z.string(),
});

const chooseWarriorsSchema = z.object({
  userId: z.string(),
  choices: z.tuple([ElementalWarriorStarterCardSchema, ElementalWarriorStarterCardSchema]),
});

const swapWarriorsSchema = z.object({
  userId: z.string(),
})

const playerFinishedSetupSchema = z.object({
  userId: z.string(),
});

const cancelSetupSchema = z.object({
  userId: z.string(),
})

const allPlayersSetupSchema = z.object({
  userId: z.string(),
})

const exitGameSchema = z.object({
  userId: z.string(),
})

const leaveGameSchema = z.object({
  userId: z.string(),
});

const getDayBreakCardsSchema = z.object({
  userId: z.string(),
});

const activateDayBreakSchema = z.object({
  userId: z.string(),
  spaceOption: AllSpaceOptionsSchema,
});

// Define EventSchemas record
export const EventSchemas = {
  [RegisterUserSocketEvent]: registerUserSocketSchema,
  [CreateGameEvent]: createGameSchema,
  [JoinGameEvent]: joinGameSchema,
  [SelectSageEvent]: selectSageSchema,
  [AllSagesSelectedEvent]: allSagesSelectedSchema,
  [ToggleReadyStatusEvent]: toggleReadyStatusSchema,
  [JoinTeamEvent]: joinTeamSchema,
  [ClearTeamsEvent]: clearTeamsSchema,
  [AllTeamsJoinedEvent]: allTeamsJoinedSchema,
  [StartGameEvent]: startGameSchema,
  [ChooseWarriorsEvent]: chooseWarriorsSchema,
  [SwapWarriorsEvent]: swapWarriorsSchema,
  [PlayerFinishedSetupEvent]: playerFinishedSetupSchema,
  [CancelSetupEvent]: cancelSetupSchema,
  [AllPlayersSetupEvent]: allPlayersSetupSchema,
  [ExitGameEvent]: exitGameSchema,
  [RejoinGameEvent]: rejoinGameSchema,
  [LeaveGameEvent]: leaveGameSchema,
  [GetDayBreakCardsEvent]: getDayBreakCardsSchema,
  [ActivateDayBreakEvent]: activateDayBreakSchema,
} as const;

// Infer the types from the schemas directly
export type RegisterUserData = z.infer<typeof registerUserSocketSchema>;
export type CreateGameData = z.infer<typeof createGameSchema>;
export type JoinGameData = z.infer<typeof joinGameSchema>;
export type SelectSageData = z.infer<typeof selectSageSchema>;
export type AllSagesSelectedData = z.infer<typeof allSagesSelectedSchema>;
export type ToggleReadyStatusData = z.infer<typeof toggleReadyStatusSchema>;
export type JoinTeamData = z.infer<typeof joinTeamSchema>;
export type ClearTeamsData = z.infer<typeof clearTeamsSchema>;
export type AllTeamsJoinedData = z.infer<typeof allTeamsJoinedSchema>;
export type StartGameData = z.infer<typeof startGameSchema>;
export type ChooseWarriorsData = z.infer<typeof chooseWarriorsSchema>;
export type SwapWarriorsData = z.infer<typeof swapWarriorsSchema>;
export type PlayerFinishedSetupData = z.infer<typeof playerFinishedSetupSchema>;
export type CancelSetupData = z.infer<typeof cancelSetupSchema>;
export type AllPlayersSetupData = z.infer<typeof allPlayersSetupSchema>;
export type ExitGameData = z.infer<typeof exitGameSchema>;
export type RejoinGameData = z.infer<typeof rejoinGameSchema>;
export type LeaveGameData = z.infer<typeof leaveGameSchema>;
export type GetDayBreakCardsData = z.infer<typeof getDayBreakCardsSchema>;
export type ActivateDayBreakData = z.infer<typeof activateDayBreakSchema>;

// Create a mapped type for socket events
export type SocketEventMap = {
  [RegisterUserSocketEvent]: RegisterUserData;
  [CreateGameEvent]: CreateGameData;
  [JoinGameEvent]: JoinGameData;
  [SelectSageEvent]: SelectSageData;
  [AllSagesSelectedEvent]: AllSagesSelectedData;
  [ToggleReadyStatusEvent]: ToggleReadyStatusData;
  [JoinTeamEvent]: JoinTeamData;
  [ClearTeamsEvent]: ClearTeamsData;
  [AllTeamsJoinedEvent]: AllTeamsJoinedData;
  [StartGameEvent]: StartGameData;
  [ChooseWarriorsEvent]: ChooseWarriorsData;
  [SwapWarriorsEvent]: SwapWarriorsData;
  [PlayerFinishedSetupEvent]: PlayerFinishedSetupData;
  [CancelSetupEvent]: CancelSetupData;
  [AllPlayersSetupEvent]: AllPlayersSetupData;
  [ExitGameEvent]: ExitGameData;
  [RejoinGameEvent]: RejoinGameData;
  [LeaveGameEvent]: LeaveGameData;
  [GetDayBreakCardsEvent]: GetDayBreakCardsData;
  [ActivateDayBreakEvent]: ActivateDayBreakData;
}