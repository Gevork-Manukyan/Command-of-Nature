import { z } from "zod";

export enum State {
    JOINING_GAME = "joining-game",
    JOINING_TEAMS = "joining-teams",
    READY_UP = "ready-up",
    STARTING_SETUP = "starting-setup",
    PHASE1 = "phase1",
    RESOLVE_DAY_BREAK_CARDS = "resolve-day-break-cards",
    PHASE2 = "phase2",
    PHASE3 = "phase3",
    DISCARDING_CARDS = "discarding-cards",
    DRAWING_NEW_HAND = "drawing-new-hand",
    END_GAME = "end-game",
    GAME_FINISHED = "game-finished",
}
  
export enum TransitionEvent {
    PLAYER_JOINED = "player-joined",
    PLAYER_SELECTED_SAGE = "player-selected-sage",
    ALL_SAGES_SELECTED = "all-sages-selected",
    PLAYER_JOINED_TEAM = "player-joined-team",
    CLEAR_TEAMS = "clear-teams",
    ALL_TEAMS_JOINED = "all-teams-joined",
    TOGGLE_READY_STATUS = "toggle-ready-status",
    ALL_PLAYERS_READY = "all-players-ready",
    CHOOSE_WARRIORS = "choose-warriors",
    SWAP_WARRIORS = "swap-warriors",
    PLAYER_FINISHED_SETUP = "player-finished-setup",
    CANCEL_SETUP = "cancel-setup",
    ALL_PLAYERS_SETUP_COMPLETE = "all-players-setup-complete",
    NEXT_PHASE = "next-phase",
    GET_DAY_BREAK_CARDS = "get-day-break-cards",
    DAY_BREAK_CARD = "day-break-card",
    DRAW_CARD = "draw-card",
    SWAP_CARDS = "swap-cards",
    SUMMON_CARD = "summon-card",
    ATTACK = "attack",
    UTILITY = "utility",
    SAGE_SKILL = "sage-skill",
    BUY_CARD = "buy-card",
    SELL_CARD = "sell-card",
    REFRESH_SHOP = "refresh-shop",
    DONE_DISCARDING_CARDS = "done-discarding-cards",
    DONE_DRAWING_NEW_HAND = "done-drawing-new-hand",
    WIN_GAME = "win-game",
}

const InputSchema = z.object({
    acceptableEvents: z.array(z.nativeEnum(TransitionEvent)),
    nextState: z.nativeEnum(State),
})
export type Input = z.infer<typeof InputSchema>;

const TransitionSchema = z.object({
    currentStateValue: z.nativeEnum(State),
    possibleInputs: z.array(InputSchema),
})
export type Transition = z.infer<typeof TransitionSchema>;

export const GameStateSchema = z.object({
    gameId: z.string(),
    currentTransition: TransitionSchema,
})