import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function list(_req: any, res: any) {
  const users = await prisma.user.findMany({ select: { id: true, email: true, role: true, created_at: true } });
  res.json(users);
}
export async function getOne(req: any, res: any) {
  const user = await prisma.user.findUnique({ where: { id: req.params.id }, select: { id: true, email: true, role: true }});
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json(user);
}
export async function update(req: any, res: any) {
  const { name, lastname, role } = req.body;
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { name, lastname, role } });
  res.json({ id: user.id, email: user.email, role: user.role , name: user.name, lastname: user.lastname });
}
export async function remove(req: any, res: any) {
  await prisma.user.delete({ where: { id: req.params.id } });
  res.status(204).end();
}
