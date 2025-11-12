import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { signAccess, signRefresh, verifyRefresh } from "../utils/jwt";

const prisma = new PrismaClient();

export async function register(request: any, response: any) {
  const { email, password , role, name, lastname } = request.body;
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { email, passwordHash, name , lastname, role } });
  response.status(201).json({ id: user.id, email: user.email });
}

export async function login(request: any, response: any) {
  const { email, password } = request.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash)))
    return response.status(401).json({ error: "Invalid credentials" });

  const access = signAccess({ sub: user.id, role: user.role });
  const refresh = signRefresh({ sub: user.id, role: user.role });
  response.json({ accessToken: access, refreshToken: refresh });
}
