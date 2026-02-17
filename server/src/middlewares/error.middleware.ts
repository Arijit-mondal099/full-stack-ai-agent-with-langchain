import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-err";
import { ENV } from "../lib/env";

export const globalErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: unknown = null;

  // Check if it's an ApiError instance
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors || null;
  }

  // Unknown error
  else if (err instanceof Error) {
    message = err.message;
  }

  console.error("Error Occurred:", err);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    stack: ENV.NODE_ENV === "development" ? err instanceof Error ? err.stack : undefined : undefined,
  });
};
