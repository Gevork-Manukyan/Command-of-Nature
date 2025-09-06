import { Request, Response, NextFunction } from "express";
import { ValidationError, NotFoundError, InvalidSpaceError, HostOnlyActionError, GameConflictError, IncorrectPasswordError, GameNotFoundError, GameFullError, GameAlreadyStartedError } from "src/custom-errors";

export interface ApiError extends Error {
    status?: number;
    code?: string;
    field?: string;
}

export function errorHandler(
    err: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Handle specific error types
    if (err instanceof ValidationError) {
        return res.status(err.status).json({
            error: "Validation Error",
            message: err.message,
            code: err.code,
            field: err.field,
        });
    }

    if (err instanceof NotFoundError) {
        return res.status(err.status).json({
            error: "Not Found",
            message: err.message,
            code: err.code,
        });
    }

    if (err instanceof InvalidSpaceError) {
        return res.status(err.status).json({
            error: "Invalid Space Error",
            message: err.message,
            code: err.code,
        });
    }

    if (err instanceof HostOnlyActionError) {
        return res.status(err.status).json({
            error: "Host Only Action",
            message: err.message,
            code: err.code,
        });
    }

    if (err instanceof GameConflictError) {
        return res.status(err.status).json({
            error: "Game Conflict",
            message: err.message,
            code: err.code,
        });
    }

    if (err instanceof IncorrectPasswordError) {
        console.log("IncorrectPasswordError details:", {
            status: err.status,
            message: err.message,
            code: err.code,
            field: err.field,
        });
        return res.status(err.status).json({
            error: "Incorrect Password",
            message: err.message,
            code: err.code,
            field: err.field,
        });
    }

    if (err instanceof GameNotFoundError) {
        return res.status(err.status || 404).json({
            error: "Game Not Found",
            message: err.message,
            code: err.code,
        });
    }

    if (err instanceof GameFullError) {
        return res.status(err.status).json({
            error: "Game Full",
            message: err.message,
            code: err.code,
        });
    }

    if (err instanceof GameAlreadyStartedError) {
        return res.status(err.status).json({
            error: "Game Already Started",
            message: err.message,
            code: err.code,
        });
    }

    // Default error
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({
        error: "Server Error",
        message,
        code: err.code,
        field: err.field,
    });
}
