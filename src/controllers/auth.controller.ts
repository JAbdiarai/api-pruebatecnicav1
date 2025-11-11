import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { signAccess, signRefresh, verifyRefresh } from "../utils/jwt";

const prisma = new PrismaClient();

export async function register(req: any, res: any) {
  const { email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { id: randomUUID(), email, passwordHash } });
  res.status(201).json({ id: user.id, email: user.email });
}

export async function login(req: any, res: any) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash)))
    return res.status(401).json({ error: "Invalid credentials" });

  const access = signAccess({ sub: user.id, role: user.role });
  const refresh = signRefresh({ sub: user.id, role: user.role });
  res.json({ accessToken: access, refreshToken: refresh });
}

export async function refresh(req: any, res: any) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: "Missing token" });
  try {
    const payload: any = verifyRefresh(refreshToken);
    const access = signAccess({ sub: payload.sub, role: payload.role });
    res.json({ accessToken: access });
  } catch {
    res.status(401).json({ error: "Invalid refresh token" });
  }
}

export async function logout(_req: any, res: any) {
  // Si usas lista de revocación, añade el token aquí.
  res.json({ ok: true });
}
