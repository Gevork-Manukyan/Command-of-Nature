import { Sage } from "@shared-types";
import {
    ConflictError,
    CustomError,
    ValidationError,
    NotFoundError,
} from "./BaseError";
import { gameId } from "../types";

/**
 * When the game with the given ID does not exist
 */
export class GameConflictError extends ConflictError {
    constructor(gameId: gameId, message?: string) {
        super(
            message || `Game with id ${gameId} not found or has been deleted`
        );
    }
}

/**
 * When the selected sage is already selected by another player
 */
export class SageUnavailableError extends ConflictError {
    sage;

    constructor(sage: Sage) {
        super(`Sage ${sage} is unavailable`);
        this.sage = sage;
    }
}

/**
 * When the selected sage is invalid
 */
export class InvalidSageError extends CustomError {
    sage;

    constructor(sage: Sage) {
        super(`Unknown sage class: ${sage}`, "INVALID_SAGE", 400);
        this.sage = sage;
    }
}

/**
 * Only the host can {action}
 */
export class HostOnlyActionError extends CustomError {
    constructor(action = "perform this action") {
        super(`Only the host can ${action}`, "HOST_ONLY_ACTION", 403);
    }
}

/**
 * When the players are not ready to start the game
 */
export class PlayersNotReadyError extends ConflictError {
    readyCount;
    totalCount;

    constructor(readyCount: number, totalCount: number) {
        super("Not all players are ready to start the game");
        this.readyCount = readyCount;
        this.totalCount = totalCount;
    }
}

/**
 * When the space number is invalid
 */
export class InvalidSpaceError extends ValidationError {
    constructor(spaceOption: number) {
        super(`Invalid space number: ${spaceOption}`, "INVALID_SPACE");
    }
}

/**
 * When the space number is null
 */
export class NullSpaceError extends CustomError {
    spaceNumber;

    constructor(
        spaceOption: number,
        message = `Cannot interact with null space: ${spaceOption}`
    ) {
        super(message, "NULL_SPACE");
        this.spaceNumber = spaceOption;
    }
}

export class GameStateError extends CustomError {
    constructor(message = "Invalid game state") {
        super(message, "GAME_STATE_ERROR");
    }
}

/**
 * When the shop is full
 */
export class ShopFullError extends ConflictError {
    constructor(shop: "creature" | "item") {
        super(`Cannot add more cards to the ${shop} shop`);
    }
}

/**
 * When the player does not have enough gold to purchase a card
 */
export class NotEnoughGoldError extends ConflictError {
    constructor() {
        super("Not enough gold to purchase this card");
    }
}

/**
 * When the selected card type is invalid
 */
export class InvalidCardTypeError extends ValidationError {
    constructor(message = "Invalid card type selected") {
        super(message, "INVALID_CARD_TYPE");
    }
}

export class InvalidDataError extends ValidationError {
    expected;
    received;

    constructor(message = "Invalid data", expected: string, received: string) {
        super(
            `${message}. Expected ${expected}, received ${received}`,
            "INVALID_DATA"
        );
        this.expected = expected;
        this.received = received;
    }
}

/**
 * When the provided password for a private game is incorrect
 */
export class IncorrectPasswordError extends ValidationError {
    constructor() {
        super("Incorrect password for this private game", "password");
    }
}

/**
 * When trying to join a game that doesn't exist or has been deleted
 */
export class GameNotFoundError extends NotFoundError {
    constructor(gameId: gameId) {
        super("Game", `Game with id ${gameId} not found or has been deleted`);
    }
}

/**
 * When trying to join a game that is already full
 */
export class GameFullError extends ConflictError {
    constructor() {
        super("This game is already full and cannot accept more players");
    }
}

/**
 * When trying to join a game that has already started
 */
export class GameAlreadyStartedError extends ConflictError {
    constructor() {
        super("This game has already started and cannot accept new players");
    }
}
