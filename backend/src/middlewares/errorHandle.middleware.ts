import type { Request, Response, NextFunction } from "express";

interface HttpError extends Error {
  statusCode?: number;
  status?: number;
}

export function errorHandlerMiddleware(
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = err.statusCode ?? err.status ?? 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}
