import { Request } from "express";
import { ValidationError } from "src/services";
import z from "zod";

/**
 * Validates the request body against a Zod schema
 * @param schema - The Zod schema to validate against
 * @param req - The request object
 * @param res - The response object
 * @returns The parsed data
 */
export const validateRequestBody = <T>(
    schema: z.ZodSchema<T>,
    req: Request,
): T => {
    const parsedData = schema.safeParse(req.body);
    if (!parsedData.success) {
        throw new ValidationError(parsedData.error.message);
    }
    return parsedData.data;
};