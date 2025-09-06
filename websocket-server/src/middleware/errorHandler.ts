import { Request, Response, NextFunction } from "express";
import {
    ValidationError,
    NotFoundError,
    InvalidSpaceError,
    HostOnlyActionError,
    GameConflictError,
} from "../custom-errors";

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
            field: err.field,
        });
    }

    if (err instanceof NotFoundError) {
        return res.status(err.status).json({
            error: "Not Found",
            message: err.message,
        });
    }

    if (err instanceof InvalidSpaceError) {
        return res.status(err.status).json({
            error: "Invalid Space Error",
            message: err.message,
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
        });
    }

    // Default error
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({
        error: "Server Error",
        message,
    });
}
