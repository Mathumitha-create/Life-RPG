import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import type { ApiResponse } from "@liferpg/contracts";
import { env } from "../config/env.js";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errorHandler: ErrorRequestHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  const requestId = req.requestId || "unknown";

  if (err instanceof ZodError) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request payload format.",
        details: err.flatten().fieldErrors,
      },
      requestId,
    };
    res.status(400).json(response);
    return;
  }

  if (err instanceof AppError) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
      requestId,
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // General internal server error
  console.error(`[${requestId}] Internal Server Error:`, err);

  const response: ApiResponse<never> = {
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message:
        env.NODE_ENV === "production"
          ? "An unexpected error occurred. Your game data is safe."
          : err.message || "An unexpected internal error occurred.",
    },
    requestId,
  };

  res.status(500).json(response);
};
