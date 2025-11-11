import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { config } from "../config/env";

export function requireAuth(request: Request, response: Response, next: NextFunction) {
  const header = request.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return response.status(401).json({ error: "Unauthorized" });
  try {
    const payload = jwt.verify(token, config.jwtAccessSecret) as any;
    (request as any).user = payload;
    next();
  } catch {
    return response.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (user?.role !== "ADMIN") return res.status(403).json({ error: "Forbidden" });
  next();
}
