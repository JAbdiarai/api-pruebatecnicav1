import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
const prisma = new PrismaClient();

export async function create(req: any, res: any) {
  const { amount, currency, metadata } = req.body;
  const transaction = await prisma.transaction.create({
    data: {
      user_id: req.user.sub,
      amount,
      currency,
      status: "PENDING",
      reference: randomUUID(),
      metadata
    }
  });
  res.status(201).json(transaction);
}
export async function listTransactions(req: any, res: any) {
  const transactions = await prisma.transaction.findMany({ where: { user_id: req.user.sub }, orderBy: { created_at: "desc" } });
  res.json(transactions);
}
export async function getOne(req: any, res: any) {
  const transaction = await prisma.transaction.findFirst({ where: { id: req.params.id, user_id: req.user.sub } });
  if (!transaction) return res.status(404).json({ error: "Not found" });
  res.json(transaction);
}
export async function update(req: any, res: any) {
  const transaction = await prisma.transaction.update({
    where: { id: req.params.id },
    data: { metadata: req.body.metadata }
  });
  res.json(transaction);
}
export async function remove(req: any, res: any) {
  await prisma.transaction.delete({ where: { id: req.params.id } });
  res.status(204).end();
}
