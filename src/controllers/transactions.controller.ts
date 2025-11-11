import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
const prisma = new PrismaClient();

export async function create(req: any, res: any) {
  const { amount, currency, metadata } = req.body;
  const tx = await prisma.transaction.create({
    data: {
      user_id: req.user.sub,
      amount,
      currency,
      status: "PENDING",
      reference: randomUUID(),
      metadata
    }
  });
  res.status(201).json(tx);
}
export async function listTransactions(req: any, res: any) {
  const txs = await prisma.transaction.findMany({ where: { user_id: req.user.sub }, orderBy: { created_at: "desc" } });
  res.json(txs);
}
export async function getOne(req: any, res: any) {
  const tx = await prisma.transaction.findFirst({ where: { id: req.params.id, user_id: req.user.sub } });
  if (!tx) return res.status(404).json({ error: "Not found" });
  res.json(tx);
}
export async function update(req: any, res: any) {
  const tx = await prisma.transaction.update({
    where: { id: req.params.id },
    data: { metadata: req.body.metadata }
  });
  res.json(tx);
}
export async function remove(req: any, res: any) {
  await prisma.transaction.delete({ where: { id: req.params.id } });
  res.status(204).end();
}
