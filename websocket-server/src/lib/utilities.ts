import { DropletDeck, IS_PRODUCTION, LeafDeck, PebbleDeck, TwigDeck } from "../constants";
import { CustomError, NotFoundError, ValidationError, HostOnlyActionError, InvalidSageError, InvalidDataError } from "../services";
import { Socket } from "socket.io";
import { GameStateManager } from "../services/GameStateManager";
import { EventSchemas, SocketEventMap, Card, Sage, AllSagesSelectedEvent, AllTeamsJoinedEvent, StartGameEvent, ClearTeamsEvent, AllPlayersSetupEvent, ExitGameEvent } from "@shared-types";

/* -------- PRE-GAME -------- */

export function getSageDecklist(sage: Sage | null) {
  if (!sage) throw new ValidationError(`No chosen sage`, "sage")

      switch (sage) {
        case "Cedar":
          return TwigDeck;
        case "Gravel": 
          return PebbleDeck;
        case "Porella":
          return LeafDeck;
        case "Torrent":
          return DropletDeck;
        default:
          throw new InvalidSageError(sage);
      }
}

function convertToCustomError(error: unknown): CustomError {
  if (error instanceof CustomError) {
    return error;
  }
  return new CustomError(
    error instanceof Error ? error.message : "An unexpected error occurred",
    "INTERNAL_ERROR"
  );
}

export function socketErrorHandler<T extends keyof SocketEventMap>(
  socket: Socket,
  eventName: T,
  fn: (data: SocketEventMap[T]) => Promise<void>
) {
  return async (rawData: unknown) => {
    try {
      await fn(rawData as SocketEventMap[T])
    } catch (error) {
      handleSocketError(socket, eventName, convertToCustomError(error));
      return;
    }
  }
}

export function handleSocketError(
  socket: Socket,
  eventName: string,
  error: CustomError,
) {
  const { message, code, ...rest } = error;

  socket.emit(`${eventName}--error`, {
    code: code || "INTERNAL_ERROR",
    message: message || "An unexpected error occurred.",
    ...rest
  });
}

export function processEventMiddleware<T extends keyof SocketEventMap>(socket: Socket, eventName: T, rawData: any, next: (err?: Error) => void) {
  // TODO: FOR DEBUGING
  if (!IS_PRODUCTION && eventName === "debug") {
    next();
    return;
  }
  
  try {
    // Ensure the event is recognized
    if (!(eventName in EventSchemas)) {
      throw new ValidationError(`Unrecognized event: ${eventName}`, rawData);
    }

    // Validate data schema
    const result = EventSchemas[eventName].safeParse(rawData);
    if (!result.success) {
      throw new InvalidDataError(
        `Invalid data for event: ${eventName}`, 
        JSON.stringify(EventSchemas[eventName].shape, null, 2),
        JSON.stringify(rawData, null, 2)
      );
    }

    const data = result.data;

    // Check for host-only actions
    const HOST_ONLY_EVENTS = [AllSagesSelectedEvent, AllTeamsJoinedEvent, StartGameEvent, ClearTeamsEvent, AllPlayersSetupEvent, ExitGameEvent];
    for (const event of HOST_ONLY_EVENTS) {
      if (eventName === event) {
        const eventData = data as SocketEventMap[typeof eventName];
        if (!('gameId' in eventData)) {
          throw new ValidationError(`Event ${eventName} requires a gameId property`, "data");
        }
        const player = GameStateManager.getInstance().getGame(eventData.gameId).getPlayer(socket.id);

        if (!player || !player.isGameHost) {
          throw new HostOnlyActionError();
        }
        break;
      }
    }

    // Store validated data in request context
    // socket.data = socket.data || {};
    // socket.data[event] = data;

    next();
  } catch (error) {
    handleSocketError(socket, eventName, convertToCustomError(error));
    return;
  }
}


/* -------- GAME -------- */

export function drawCardFromDeck<T extends Card>(deck: T[]) {
  if (deck.length === 0) throw new NotFoundError("No cards left in deck", "deck");

  const randomIndex = Math.floor(Math.random() * deck.length);
  const card = deck[randomIndex];
  deck.splice(randomIndex, 1);

  return card;
}