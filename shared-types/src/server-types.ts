import { z } from "zod";
import { AvailableSagesSchema } from "./game-types";
import { AllSpaceOptionsSchema } from "./space-options";
import {
    CreateGameEvent,
    JoinGameEvent,
    SelectSageEvent,
    AllSagesSelectedEvent,
    ToggleReadyStatusEvent,
    JoinTeamEvent,
    ClearTeamsEvent,
    AllTeamsJoinedEvent,
    StartGameEvent,
    ChooseWarriorsEvent,
    SwapWarriorsEvent,
    PlayerFinishedSetupEvent,
    CancelSetupEvent,
    BeginBattleEvent,
    AllPlayersSetupStatusEvent,
    ExitGameEvent,
    VerifySessionEvent,
    LeaveGameEvent,
    ActivateDayBreakEvent,
    RegisterUserSocketEvent,
    ReadyStatusToggledEvent,
    TeamJoinedEvent,
    SageSelectedEvent,
    PlayerRejoinedEvent,
    PlayerJoinedEvent,
    PlayerLeftEvent,
    GetSelectedSagesEvent,
    AllPlayersJoinedEvent,
    TeamsClearedEvent,
} from "./game-events";
import { ElementalWarriorStarterCardSchema } from "./card-classes";
import { OptionalAbilityCardSchema } from "./card-types";
import { WarriorSelectionStateSchema } from "./types";
import { SageSchema } from "./card-types";
import { UserSetupSchema } from "./types";

export const registerUserSocketSchema = z.object({
    userId: z.string(),
});

export const createGameSchema = z.object({
    userId: z.string(),
    gameName: z.string(),
    numPlayers: z.union([z.literal(2), z.literal(4)]),
    isPrivate: z.boolean().default(false),
    password: z.string().optional(),
});

export const joinGameSchema = z.object({
    userId: z.string(),
    gameId: z.string(),
    password: z.string().optional(),
});

export const verifySessionSchema = z.object({
    userId: z.string(),
    gameId: z.string(),
});

export const playerJoinedSchema = z.object({
    userSetupData: z.array(UserSetupSchema),
});

export const playerRejoinedSchema = z.object({
    userSetupData: z.array(UserSetupSchema),
});

export const allPlayersJoinedSchema = z.object({
    userId: z.string(),
});

export const selectSageSchema = z.object({
    userId: z.string(),
    sage: SageSchema,
});

export const getSelectedSagesSchema = z.object({
    userId: z.string(),
});

export const sageSelectedSchema = z.object({
    userId: z.string(),
    sage: SageSchema,
    availableSages: AvailableSagesSchema,
});

export const allSagesSelectedSchema = z.object({
    userId: z.string(),
});

export const userSetupDataResponseSchema = z.object({
    userSetupData: z.array(UserSetupSchema),
});

export const toggleReadyStatusSchema = z.object({
    userId: z.string(),
});

export const readyStatusToggledSchema = z.object({
    userId: z.string(),
    isReady: z.boolean(),
});

export const joinTeamSchema = z.object({
    userId: z.string(),
    team: z.union([z.literal(1), z.literal(2)]),
});

export const teamJoinedSchema = z.object({
    updatedTeams: z.object({
        1: z.array(z.string()),
        2: z.array(z.string()),
    }),
});

export const clearTeamsSchema = z.object({
    userId: z.string(),
});

export const teamsClearedSchema = z.object({
    updatedTeams: z.object({
        1: z.array(z.string()),
        2: z.array(z.string()),
    }),
});

export const allTeamsJoinedSchema = z.object({
    userId: z.string(),
});

export const startGameSchema = z.object({
    userId: z.string(),
});

export const getUserWarriorSelectionDataSchema = z.object({
    userId: z.string(),
});

export const chooseWarriorsRequestSchema = z.object({
    userId: z.string(),
    choices: z.tuple([z.string(), z.string()]),
});

export const chooseWarriorsSchema = z.object({
    userId: z.string(),
    selectedWarriors: z.array(ElementalWarriorStarterCardSchema.merge(OptionalAbilityCardSchema)),
    warriorSelectionState: WarriorSelectionStateSchema,
});

export const swapWarriorsRequestSchema = z.object({
    userId: z.string(),
});

export const swapWarriorsSchema = z.object({
    userId: z.string(),
    selectedWarriors: z.array(ElementalWarriorStarterCardSchema.merge(OptionalAbilityCardSchema)),
});

export const playerFinishedSetupRequestSchema = z.object({
    userId: z.string(),
});

export const playerFinishedSetupSchema = z.object({
    userId: z.string(),
    warriorSelectionState: WarriorSelectionStateSchema,
});

export const cancelSetupRequestSchema = z.object({
    userId: z.string(),
});

export const cancelSetupSchema = z.object({
    userId: z.string(),
    warriorSelectionState: WarriorSelectionStateSchema,
});

export const beginBattleSchema = z.object({
    userId: z.string(),
});

export const allPlayersSetupStatusSchema = z.object({
    allPlayersSetup: z.boolean(),
});

export const exitGameSchema = z.object({
    userId: z.string(),
});

export const leaveGameSchema = z.object({
    userId: z.string(),
});

export const playerLeftSchema = z.object({
    userSetupData: z.array(UserSetupSchema),
    hostUserId: z.string(),
});

export const getDayBreakCardsSchema = z.object({
    userId: z.string(),
});

export const activateDayBreakSchema = z.object({
    userId: z.string(),
    spaceOption: AllSpaceOptionsSchema,
});

// Gameplay data schemas
export const PlayerGameDataSchema = z.object({
    userId: z.string(),
    socketId: z.string(),
    sage: SageSchema.nullable(),
    level: z.number(),
    hand: z.array(z.any()), // TODO: Card array - only visible to team
    deckCount: z.number(),
    discardCount: z.number(),
});

export const TeamGameDataSchema = z.object({
    teamNumber: z.union([z.literal(1), z.literal(2)]),
    gold: z.number(),
    battlefield: z.any(), // TODO: Battlefield object
    playerIds: z.array(z.string()),
});

const BaseGameStateSchema = z.object({
    gameId: z.string(),
    currentPhase: z.string(),
    hostUserId: z.string(),
    numPlayersTotal: z.number(),
});

export const SetupGameStateSchema = BaseGameStateSchema.extend({
    userSetupData: z.array(UserSetupSchema),
    availableSages: z.object({
        Cedar: z.boolean(),
        Gravel: z.boolean(),
        Porella: z.boolean(),
        Torrent: z.boolean(),
    }),
    teams: z.object({
        1: z.array(z.string()),
        2: z.array(z.string()),
    }),
});

export const GameplayGameStateSchema = BaseGameStateSchema.extend({
    activeTeamNumber: z.union([z.literal(1), z.literal(2)]),
    actionPoints: z.number(),
    maxActionPoints: z.number(),
    teams: z.tuple([TeamGameDataSchema, TeamGameDataSchema]),
    creatureShop: z.array(z.any()), // TODO: ElementalCard array
    itemShop: z.array(z.any()), // TODO: ItemCard array
    myTeam: TeamGameDataSchema,
    myTeamPlayers: z.array(PlayerGameDataSchema),
    opponentTeamPlayers: z.array(PlayerGameDataSchema.omit({ hand: true })),
});

export const GameStateDataSchema = z.union([
    SetupGameStateSchema,
    GameplayGameStateSchema,
]);

export const TeamHandsDataSchema = z.object({
    myTeamPlayers: z.array(PlayerGameDataSchema),
});

export const getUserGameStateSchema = z.object({
    userId: z.string(),
});

export const getUserTeamHandsSchema = z.object({
    userId: z.string(),
});

// Gameplay event data schemas
export const BattlefieldUpdatedDataSchema = z.object({
    teamNumber: z.union([z.literal(1), z.literal(2)]),
    battlefield: z.any(), // TODO: Battlefield object
});

export const HandUpdatedDataSchema = z.object({
    userId: z.string(),
    hand: z.array(z.any()), // TODO: Card array
});

export const ShopUpdatedDataSchema = z.object({
    creatureShop: z.array(z.any()), // TODO: ElementalCard array
    itemShop: z.array(z.any()), // TODO: ItemCard array
});

export const PhaseChangedDataSchema = z.object({
    currentPhase: z.string(), // TODO: State type
    activeTeamNumber: z.union([z.literal(1), z.literal(2)]).optional(),
});

export const TurnChangedDataSchema = z.object({
    activeTeamNumber: z.union([z.literal(1), z.literal(2)]),
    actionPoints: z.number(),
    maxActionPoints: z.number(),
});

export const ActionPointsChangedDataSchema = z.object({
    actionPoints: z.number(),
    maxActionPoints: z.number(),
});

// Define EventSchemas record
export const EventSchemas = {
    [RegisterUserSocketEvent]: registerUserSocketSchema,
    [CreateGameEvent]: createGameSchema,
    [JoinGameEvent]: joinGameSchema,
    [PlayerJoinedEvent]: playerJoinedSchema,
    [PlayerRejoinedEvent]: playerRejoinedSchema,
    [AllPlayersJoinedEvent]: allPlayersJoinedSchema,
    [SelectSageEvent]: selectSageSchema,
    [GetSelectedSagesEvent]: getSelectedSagesSchema,
    [SageSelectedEvent]: sageSelectedSchema,
    [AllSagesSelectedEvent]: allSagesSelectedSchema,
    [ToggleReadyStatusEvent]: toggleReadyStatusSchema,
    [ReadyStatusToggledEvent]: readyStatusToggledSchema,
    [JoinTeamEvent]: joinTeamSchema,
    [TeamJoinedEvent]: teamJoinedSchema,
    [ClearTeamsEvent]: clearTeamsSchema,
    [TeamsClearedEvent]: teamsClearedSchema,
    [AllTeamsJoinedEvent]: allTeamsJoinedSchema,
    [StartGameEvent]: startGameSchema,
    [ChooseWarriorsEvent]: chooseWarriorsSchema,
    [SwapWarriorsEvent]: swapWarriorsSchema,
    [PlayerFinishedSetupEvent]: playerFinishedSetupSchema,
    [CancelSetupEvent]: cancelSetupSchema,
    [BeginBattleEvent]: beginBattleSchema,
    [AllPlayersSetupStatusEvent]: allPlayersSetupStatusSchema,
    [ExitGameEvent]: exitGameSchema,
    [VerifySessionEvent]: verifySessionSchema,
    [LeaveGameEvent]: leaveGameSchema,
    [PlayerLeftEvent]: playerLeftSchema,
    [ActivateDayBreakEvent]: activateDayBreakSchema,
} as const;

// Infer the types from the schemas directly
export type RegisterUserData = z.infer<typeof registerUserSocketSchema>;
export type CreateGameData = z.infer<typeof createGameSchema>;
export type JoinGameData = z.infer<typeof joinGameSchema>;
export type PlayerJoinedData = z.infer<typeof playerJoinedSchema>;
export type PlayerRejoinedData = z.infer<typeof playerRejoinedSchema>;
export type AllPlayersJoinedData = z.infer<typeof allPlayersJoinedSchema>;
export type SelectSageData = z.infer<typeof selectSageSchema>;
export type GetSelectedSagesData = z.infer<typeof getSelectedSagesSchema>;
export type SageSelectedData = z.infer<typeof sageSelectedSchema>;
export type AllSagesSelectedData = z.infer<typeof allSagesSelectedSchema>;
export type UserSetupDataResponse = z.infer<typeof userSetupDataResponseSchema>;
export type ToggleReadyStatusData = z.infer<typeof toggleReadyStatusSchema>;
export type ReadyStatusToggledData = z.infer<typeof readyStatusToggledSchema>;
export type JoinTeamData = z.infer<typeof joinTeamSchema>;
export type TeamJoinedData = z.infer<typeof teamJoinedSchema>;
export type ClearTeamsData = z.infer<typeof clearTeamsSchema>;
export type TeamsClearedData = z.infer<typeof teamsClearedSchema>;
export type AllTeamsJoinedData = z.infer<typeof allTeamsJoinedSchema>;
export type StartGameData = z.infer<typeof startGameSchema>;
export type GetUserWarriorSelectionDataData = z.infer<typeof getUserWarriorSelectionDataSchema>;
export type ChooseWarriorsRequestData = z.infer<typeof chooseWarriorsRequestSchema>;
export type ChooseWarriorsData = z.infer<typeof chooseWarriorsSchema>;
export type SwapWarriorsRequestData = z.infer<typeof swapWarriorsRequestSchema>;
export type SwapWarriorsData = z.infer<typeof swapWarriorsSchema>;
export type PlayerFinishedSetupRequestData = z.infer<typeof playerFinishedSetupRequestSchema>;
export type PlayerFinishedSetupData = z.infer<typeof playerFinishedSetupSchema>;
export type CancelSetupRequestData = z.infer<typeof cancelSetupRequestSchema>;
export type CancelSetupData = z.infer<typeof cancelSetupSchema>;
export type BeginBattleData = z.infer<typeof beginBattleSchema>;
export type AllPlayersSetupStatusData = z.infer<typeof allPlayersSetupStatusSchema>;
export type ExitGameData = z.infer<typeof exitGameSchema>;
export type VerifySessionData = z.infer<typeof verifySessionSchema>;
export type LeaveGameData = z.infer<typeof leaveGameSchema>;
export type PlayerLeftData = z.infer<typeof playerLeftSchema>;
export type GetDayBreakCardsData = z.infer<typeof getDayBreakCardsSchema>;
export type ActivateDayBreakData = z.infer<typeof activateDayBreakSchema>;
export type PlayerGameData = z.infer<typeof PlayerGameDataSchema>;
export type TeamGameData = z.infer<typeof TeamGameDataSchema>;
export type SetupGameState = z.infer<typeof SetupGameStateSchema>;
export type GameplayGameState = z.infer<typeof GameplayGameStateSchema>;
export type GameStateData = z.infer<typeof GameStateDataSchema>;
export type TeamHandsData = z.infer<typeof TeamHandsDataSchema>;
export type BattlefieldUpdatedData = z.infer<typeof BattlefieldUpdatedDataSchema>;
export type HandUpdatedData = z.infer<typeof HandUpdatedDataSchema>;
export type ShopUpdatedData = z.infer<typeof ShopUpdatedDataSchema>;
export type PhaseChangedData = z.infer<typeof PhaseChangedDataSchema>;
export type TurnChangedData = z.infer<typeof TurnChangedDataSchema>;
export type ActionPointsChangedData = z.infer<typeof ActionPointsChangedDataSchema>;

// Create a mapped type for socket events
export type SocketEventMap = {
    [RegisterUserSocketEvent]: RegisterUserData;
    [CreateGameEvent]: CreateGameData;
    [JoinGameEvent]: JoinGameData;
    [PlayerJoinedEvent]: PlayerJoinedData;
    [PlayerRejoinedEvent]: PlayerRejoinedData;
    [SelectSageEvent]: SelectSageData;
    [SageSelectedEvent]: SageSelectedData;
    [AllSagesSelectedEvent]: AllSagesSelectedData;
    [ToggleReadyStatusEvent]: ToggleReadyStatusData;
    [ReadyStatusToggledEvent]: ReadyStatusToggledData;
    [JoinTeamEvent]: JoinTeamData;
    [TeamJoinedEvent]: TeamJoinedData;
    [ClearTeamsEvent]: ClearTeamsData;
    [TeamsClearedEvent]: TeamsClearedData;
    [AllTeamsJoinedEvent]: AllTeamsJoinedData;
    [StartGameEvent]: StartGameData;
    [ChooseWarriorsEvent]: ChooseWarriorsData;
    [SwapWarriorsEvent]: SwapWarriorsData;
    [PlayerFinishedSetupEvent]: PlayerFinishedSetupData;
    [CancelSetupEvent]: CancelSetupData;
    [BeginBattleEvent]: BeginBattleData;
    [AllPlayersSetupStatusEvent]: AllPlayersSetupStatusData;
    [ExitGameEvent]: ExitGameData;
    [VerifySessionEvent]: VerifySessionData;
    [LeaveGameEvent]: LeaveGameData;
    [PlayerLeftEvent]: PlayerLeftData;
    [ActivateDayBreakEvent]: ActivateDayBreakData;
};
