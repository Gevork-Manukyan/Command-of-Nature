import { Card } from "@shared-types";
import { CustomError, NotFoundError } from "../../custom-errors";
import { UserSocketManager } from "../../services/UserSocketManager";

/**
 * Converts an unknown error to a CustomError
 * @param error - The error to convert
 * @returns The converted error
 */
export function convertToCustomError(error: unknown): CustomError {
    if (error instanceof CustomError) {
        return error;
    }
    return new CustomError(
        error instanceof Error ? error.message : "An unexpected error occurred",
        "INTERNAL_ERROR"
    );
}

/**
 * Gets the socket ID for a given user ID
 * @param userId - The user ID to get the socket ID for
 * @returns The socket ID
 * @throws NotFoundError if the socket ID is not found
 */
export function getSocketId(userId: string): string {
    const userSocketManager = UserSocketManager.getInstance();
    const socketId = userSocketManager.getSocketId(userId);
    if (!socketId) {
        throw new NotFoundError("Socket ID not found");
    }
    return socketId;
}

/**
 * Checks if target card is in the searching cards
 * @param searchingCards - The cards to search in
 * @param targetCard - The card to search for
 * @returns True if the target card is in the searching cards, false otherwise
 */
export function cardsInclude(searchingCards: Card[], targetCard: Card) {
    return searchingCards.some(card => targetCard.name === card.name);
}