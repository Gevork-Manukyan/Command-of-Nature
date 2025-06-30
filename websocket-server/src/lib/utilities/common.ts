import { CustomError } from "../../services";

export function convertToCustomError(error: unknown): CustomError {
  if (error instanceof CustomError) {
    return error;
  }
  return new CustomError(
    error instanceof Error ? error.message : "An unexpected error occurred",
    "INTERNAL_ERROR"
  );
} 