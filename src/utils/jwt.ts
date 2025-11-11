import * as jwt from "jsonwebtoken";
import { config } from "../config/env";

export function signAccess(payload: object) {
  return jwt.sign(payload, config.jwtAccessSecret, { expiresIn: "15m" });
}
export function signRefresh(payload: object) {
  return jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: "7d" });
}
export function verifyAccess(token: string) {
  return jwt.verify(token, config.jwtAccessSecret);
}
export function verifyRefresh(token: string) {
  return jwt.verify(token, config.jwtRefreshSecret);
}
