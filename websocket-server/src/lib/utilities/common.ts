import { CustomError } from "../../services";
import { UserSocketManager } from "../../services/UserSocketManager";
import { NotFoundError } from "../../services/CustomError/BaseError";

const userSocketManager = UserSocketManager.getInstance();

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
  const socketId = userSocketManager.getSocketId(userId);
  if (!socketId) {
    throw new NotFoundError("Socket ID not found");
  }
  return socketId;
}