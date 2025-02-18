import { GameStateError } from "../services/CustomError/GameError";
import { gameId } from "../types";

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


type Transition = {
    currentStateValue: State;
    possibleInputs: Input[];
}

type Input = {
    acceptableEvents: TransitionEvent[];
    nextState: State;
}

export class GameState {
    gameId: gameId;
    private stateTransitionTable: Transition[] = []
    private currentTransition: Transition;
    
    constructor(gameId: gameId) {
        this.gameId = gameId;
        this.initTransitionTable();
        this.currentTransition = this.stateTransitionTable[0];
    }

    private initTransitionTable() {
        this.addTransition(State.JOINING_GAME, [
            { acceptableEvents: [TransitionEvent.PLAYER_JOINED, TransitionEvent.PLAYER_SELECTED_SAGE], nextState: State.JOINING_GAME },
            { acceptableEvents: [TransitionEvent.ALL_SAGES_SELECTED], nextState: State.JOINING_TEAMS }
        ]);
        this.addTransition(State.JOINING_TEAMS, [
            { acceptableEvents: [TransitionEvent.PLAYER_JOINED_TEAM, TransitionEvent.CLEAR_TEAMS], nextState: State.JOINING_TEAMS },
            { acceptableEvents: [TransitionEvent.ALL_TEAMS_JOINED], nextState: State.READY_UP }
        ]);
        this.addTransition(State.READY_UP, [
            { acceptableEvents: [TransitionEvent.TOGGLE_READY_STATUS], nextState: State.READY_UP },
            { acceptableEvents: [TransitionEvent.ALL_PLAYERS_READY], nextState: State.STARTING_SETUP }
        ]);
        this.addTransition(State.STARTING_SETUP, [
            { acceptableEvents: [TransitionEvent.CHOOSE_WARRIORS, TransitionEvent.SWAP_WARRIORS, TransitionEvent.PLAYER_FINISHED_SETUP, TransitionEvent.CANCEL_SETUP], nextState: State.STARTING_SETUP },
            { acceptableEvents: [TransitionEvent.ALL_PLAYERS_SETUP_COMPLETE], nextState: State.PHASE1 }
        ]);
        this.addTransition(State.PHASE1, [
            { acceptableEvents: [TransitionEvent.GET_DAY_BREAK_CARDS], nextState: State.RESOLVE_DAY_BREAK_CARDS }
        ]);
        this.addTransition(State.RESOLVE_DAY_BREAK_CARDS, [
            { acceptableEvents: [TransitionEvent.DAY_BREAK_CARD], nextState: State.RESOLVE_DAY_BREAK_CARDS },
            { acceptableEvents: [TransitionEvent.NEXT_PHASE], nextState: State.PHASE2 }
        ]);
        this.addTransition(State.PHASE2, [
            { acceptableEvents: [TransitionEvent.DRAW_CARD, TransitionEvent.SWAP_CARDS, TransitionEvent.SUMMON_CARD, TransitionEvent.ATTACK, TransitionEvent.UTILITY, TransitionEvent.SAGE_SKILL], nextState: State.PHASE2 },
            { acceptableEvents: [TransitionEvent.NEXT_PHASE], nextState: State.PHASE3 },
            { acceptableEvents: [TransitionEvent.WIN_GAME], nextState: State.END_GAME }
        ]);
        this.addTransition(State.PHASE3, [
            { acceptableEvents: [TransitionEvent.BUY_CARD, TransitionEvent.SUMMON_CARD, TransitionEvent.SELL_CARD, TransitionEvent.REFRESH_SHOP], nextState: State.PHASE3 },
            { acceptableEvents: [TransitionEvent.NEXT_PHASE], nextState: State.DISCARDING_CARDS }
        ]);
        this.addTransition(State.DISCARDING_CARDS, [
            { acceptableEvents: [TransitionEvent.DONE_DISCARDING_CARDS], nextState: State.DRAWING_NEW_HAND }
        ]);
        this.addTransition(State.DRAWING_NEW_HAND, [
            { acceptableEvents: [TransitionEvent.DONE_DRAWING_NEW_HAND], nextState: State.PHASE1 }
        ]);
        this.addTransition(State.END_GAME, [
            { acceptableEvents: [TransitionEvent.WIN_GAME], nextState: State.GAME_FINISHED }
        ]);
    }
    

    private addTransition(currentStateValue: State, possibleInputs: Input[]) {
        this.stateTransitionTable.push({ currentStateValue, possibleInputs });
    }

    getCurrentTransition() {
        return {
            currentState: this.currentTransition.currentStateValue,
            possibleInputs: this.currentTransition.possibleInputs.map(input => input.acceptableEvents).flat()
        };
    }

    private checkTransitionForEvent(event: TransitionEvent, transition: Transition) {
        return transition.possibleInputs.find(input => input.acceptableEvents.includes(event));
    }

    private findNextTransition(nextState: State) {
        return this.stateTransitionTable.find(transition => transition.currentStateValue === nextState);
    }

    verifyEvent(event: TransitionEvent) {
        const input = this.checkTransitionForEvent(event, this.currentTransition);
        if (!input) throw new GameStateError(`Invalid event: ${event} for current state: ${this.currentTransition.currentStateValue}`);
    }

    processEvent(event: TransitionEvent) {
        const input = this.checkTransitionForEvent(event, this.currentTransition);

        if (!input) throw new GameStateError(`Invalid event: ${event} for current state: ${this.currentTransition.currentStateValue}`);
        const nextTransition = this.findNextTransition(input.nextState);
        
        if (!nextTransition) throw new GameStateError(`Invalid next state: ${input.nextState}`);
        this.currentTransition = nextTransition;
    }
}