import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function list(_req: any, res: any) {
  const users = await prisma.user.findMany({ select: { id: true, email: true, role: true, createdAt: true } });
  res.json(users);
}
export async function getOne(req: any, res: any) {
  const u = await prisma.user.findUnique({ where: { id: req.params.id }, select: { id: true, email: true, role: true }});
  if (!u) return res.status(404).json({ error: "Not found" });
  res.json(u);
}
export async function update(req: any, res: any) {
  const u = await prisma.user.update({ where: { id: req.params.id }, data: { role: req.body.role } });
  res.json({ id: u.id, email: u.email, role: u.role });
}
export async function remove(req: any, res: any) {
  await prisma.user.delete({ where: { id: req.params.id } });
  res.status(204).end();
}
