import type { Request, Response, NextFunction } from "express";
export function errorHandler(error: any, _request: Request, response: Response, _next: NextFunction) {
  console.error(error);
  response.status(error.status || 500).json({ error: error.message || "Internal Server Error" });
}
