import { GameStateError } from "../../custom-errors";
import { gameId } from "../../types";
import {
    GameStateSchema,
    Input,
    State,
    Transition,
    TransitionEvent,
} from "../../../../shared-types/src/gamestate-types";
import { GameState as GameStatePrisma } from "@prisma/client";

export class GameState {
    gameId: gameId;
    private stateTransitionTable: Transition[] = [];
    private currentTransition: Transition;

    constructor(gameId: gameId) {
        this.gameId = gameId;
        this.initTransitionTable();
        this.currentTransition = this.stateTransitionTable[0];
    }

    private initTransitionTable() {
        this.addTransition(State.JOINING_GAME, [
            {
                acceptableEvents: [TransitionEvent.PLAYER_JOINED],
                nextState: State.JOINING_GAME,
            },
            {
                acceptableEvents: [TransitionEvent.ALL_PLAYERS_JOINED],
                nextState: State.SAGE_SELECTION,
            },
        ]);
        this.addTransition(State.SAGE_SELECTION, [
            {
                acceptableEvents: [TransitionEvent.PLAYER_SELECTED_SAGE],
                nextState: State.SAGE_SELECTION,
            },
            {
                acceptableEvents: [TransitionEvent.ALL_SAGES_SELECTED],
                nextState: State.JOINING_TEAMS,
            },
        ]);
        this.addTransition(State.JOINING_TEAMS, [
            {
                acceptableEvents: [
                    TransitionEvent.PLAYER_JOINED_TEAM,
                    TransitionEvent.CLEAR_TEAMS,
                ],
                nextState: State.JOINING_TEAMS,
            },
            {
                acceptableEvents: [TransitionEvent.ALL_TEAMS_JOINED],
                nextState: State.READY_UP,
            },
        ]);
        this.addTransition(State.READY_UP, [
            {
                acceptableEvents: [TransitionEvent.TOGGLE_READY_STATUS],
                nextState: State.READY_UP,
            },
            {
                acceptableEvents: [TransitionEvent.ALL_PLAYERS_READY],
                nextState: State.WARRIOR_SELECTION,
            },
        ]);
        this.addTransition(State.WARRIOR_SELECTION, [
            {
                acceptableEvents: [
                    TransitionEvent.CHOOSE_WARRIORS,
                    TransitionEvent.SWAP_WARRIORS,
                    TransitionEvent.CANCEL_SETUP,
                    TransitionEvent.PLAYER_FINISHED_SETUP
                ],
                nextState: State.WARRIOR_SELECTION,
            },
            {
                acceptableEvents: [TransitionEvent.ALL_PLAYERS_SETUP_COMPLETE],
                nextState: State.PHASE1,
            }
        ]);
        this.addTransition(State.PHASE1, [
            {
                acceptableEvents: [TransitionEvent.ACTIVATE_DAY_BREAK_CARD],
                nextState: State.PHASE1,
            },
            {
                acceptableEvents: [TransitionEvent.NEXT_PHASE],
                nextState: State.PHASE2,
            },
        ]);
        this.addTransition(State.PHASE2, [
            {
                acceptableEvents: [
                    TransitionEvent.DRAW_CARD,
                    TransitionEvent.SWAP_CARDS,
                    TransitionEvent.SUMMON_CARD,
                    TransitionEvent.ATTACK,
                    TransitionEvent.UTILITY,
                    TransitionEvent.SAGE_SKILL,
                ],
                nextState: State.PHASE2,
            },
            {
                acceptableEvents: [TransitionEvent.NEXT_PHASE],
                nextState: State.PHASE3,
            },
            {
                acceptableEvents: [TransitionEvent.WIN_GAME],
                nextState: State.END_GAME,
            },
        ]);
        this.addTransition(State.PHASE3, [
            {
                acceptableEvents: [
                    TransitionEvent.BUY_CARD,
                    TransitionEvent.SUMMON_CARD,
                    TransitionEvent.SELL_CARD,
                    TransitionEvent.REFRESH_SHOP,
                ],
                nextState: State.PHASE3,
            },
            {
                acceptableEvents: [TransitionEvent.NEXT_PHASE],
                nextState: State.PHASE4,
            },
        ]);
        this.addTransition(State.PHASE4, [
            {
                acceptableEvents: [TransitionEvent.DONE_DISCARDING_CARDS],
                nextState: State.DRAWING_NEW_HAND,
            },
        ]);
        this.addTransition(State.DRAWING_NEW_HAND, [
            {
                acceptableEvents: [TransitionEvent.DONE_DRAWING_NEW_HAND],
                nextState: State.PHASE1,
            },
        ]);
        this.addTransition(State.END_GAME, [
            {
                acceptableEvents: [TransitionEvent.WIN_GAME],
                nextState: State.GAME_FINISHED,
            },
        ]);
    }

    private addTransition(currentState: State, possibleInputs: Input[]) {
        this.stateTransitionTable.push({ currentState, possibleInputs });
    }

    getCurrentTransition() {
        return {
            currentState: this.currentTransition.currentState,
            possibleInputs: this.currentTransition.possibleInputs,
        };
    }

    /**
     * Check if the transition is valid for the event
     * @param event
     * @param transition
     * @returns The input that matches the event or undefined if no match
     */
    private checkTransitionForEvent(
        event: TransitionEvent,
        transition: Transition
    ) {
        return transition.possibleInputs.find((input) =>
            input.acceptableEvents.includes(event)
        );
    }

    /**
     * Find the next transition based on the next state
     * @param nextState
     * @returns The transition object or undefined if no match
     */
    private findNextTransition(nextState: State) {
        return this.stateTransitionTable.find(
            (transition) => transition.currentState === nextState
        );
    }

    /**
     * Verify if the event is valid for the current state
     * @param event
     * @throws GameStateError if the event is invalid for the current state
     */
    verifyEvent(event: TransitionEvent) {
        const input = this.checkTransitionForEvent(
            event,
            this.currentTransition
        );
        if (!input)
            throw new GameStateError(
                `Invalid event: ${event} for current state: ${this.currentTransition.currentState}`
            );
    }

    /**
     * Process the event and move to the next state
     * @param event The event to process
     * @throws GameStateError if the event is invalid for the current state
     */
    async processEvent(event: TransitionEvent) {
        const input = this.checkTransitionForEvent(
            event,
            this.currentTransition
        );
        if (!input)
            throw new GameStateError(
                `Invalid event: ${event} for current state: ${this.currentTransition.currentState}`
            );

        const nextTransition = this.findNextTransition(input.nextState);
        if (!nextTransition)
            throw new GameStateError(`Invalid next state: ${input.nextState}`);

        this.currentTransition = nextTransition;
        return this;
    }

    /**
     * Convert from Prisma document to runtime instance
     * @param doc - The Prisma document to convert
     * @returns The runtime instance
     */
    static fromPrisma(doc: GameStatePrisma): GameState {
        const validatedGameState = GameStateSchema.safeParse(doc);
        if (!validatedGameState.success) {
            throw new GameStateError(
                `Invalid game state: ${validatedGameState.error}`
            );
        }

        const { gameId, currentTransition } = validatedGameState.data;
        const gameState = new GameState(gameId);
        gameState.currentTransition = currentTransition;

        return gameState;
    }

    /**
     * Convert from runtime instance to Prisma object
     * @returns The Prisma object
     */
    toPrismaObject() {
        return {
            gameId: this.gameId,
            currentTransition: this.currentTransition,
        };
    }
}
