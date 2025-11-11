import type { Request, Response, NextFunction } from "express";

const requests = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX = 100;

export function simpleRateLimit(req: Request, res: Response, next: NextFunction) {
  const key = req.ip || 'unknown';
  const now = Date.now();
  const entry = requests.get(key) || { count: 0, ts: now };
  if (now - entry.ts > WINDOW_MS) {
    entry.count = 0;
    entry.ts = now;
  }
  entry.count++;
  requests.set(key, entry);
  if (entry.count > MAX) return res.status(429).json({ error: "Too many requests" });
  next();
}
