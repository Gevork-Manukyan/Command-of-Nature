import { gameId } from "../../types";
import { Sage } from "shared-types";
import { ConflictError, CustomError, ValidationError } from "./BaseError";

/**
 * When the game with the given ID does not exist
 */
export class GameConflictError extends ConflictError {
    constructor(gameId: gameId, message?: string) {
        super(message || `Game with id ${gameId} not found or in invalid state`);
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

export class PlayersNotReadyError extends ConflictError {
    readyCount; 
    totalCount;

    constructor(readyCount: number, totalCount: number) {
        super("Not all players are ready to start the game");
        this.readyCount = readyCount;
        this.totalCount = totalCount;
    }
}

export class InvalidSpaceError extends ValidationError {
    constructor(spaceOption: number) {
        super(`Invalid space number: ${spaceOption}`, "INVALID_SPACE");
    }
}

export class NullSpaceError extends CustomError {
  spaceNumber; 

  constructor(spaceOption: number, message = `Cannot interact with null space: ${spaceOption}`) {
    super(message, "NULL_SPACE");
    this.spaceNumber = spaceOption;
  }
}
  
export class GameStateError extends CustomError {
    constructor(message = "Invalid game state") {
        super(message, "GAME_STATE_ERROR");
    }
}

export class ShopFullError extends ConflictError {
    constructor(shop: "creature" | "item") {
        super(`Cannot add more cards to the ${shop} shop`);
    }
}

export class NotEnoughGoldError extends ConflictError {
    constructor() {
        super("Not enough gold to purchase this card");
    }
}

export class InvalidCardTypeError extends ValidationError {
    constructor(message = "Invalid card type selected") {
        super(message, "INVALID_CARD_TYPE");
    }
}

export class InvalidDataError extends ValidationError {
    expected;
    received;

    constructor(message = "Invalid data", expected: string, received: string) {
        super(`${message}. Expected ${expected}, received ${received}`, "INVALID_DATA");
        this.expected = expected;
        this.received = received;
    }
}