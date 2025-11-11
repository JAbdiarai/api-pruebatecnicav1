import { PrismaClient } from "@prisma/client";
import { encryptToBuffer } from "../config/crypto";
const prisma = new PrismaClient();

export async function addPaymentMethod(req: any, res: any) {
  const { brand, pan, expMonth, expYear } = req.body;
  if (!pan || pan.length < 12) return res.status(400).json({ error: "PAN inválido" });
  const last4 = pan.slice(-4);
  const { ciphertext, iv } = encryptToBuffer(JSON.stringify({ pan, expMonth, expYear }));
  const pm = await prisma.payment_Method.create({
    data: { user: { connect: { id: req.user.id } }, brand, last4, token_encrypted: ciphertext, iv }
  });
  res.status(201).json({ id: pm.id, brand: pm.brand, last4: pm.last4, created_at: pm.created_at });
}

export async function listPaymentMethods(req: any, res: any) {
  const pms = await prisma.payment_Method.findMany({ where: { user_id: req.user.sub }, select: { id: true, brand: true, last4: true, created_at: true } });
  res.json(pms);
}

export async function removePaymentMethod(req: any, res: any) {
  await prisma.payment_Method.delete({ where: { id: req.params.id } });
  res.status(204).end();
}

// Simulación de cobro: autoriza y captura
export async function charge(req: any, res: any) {
  const { transactionId, paymentMethodId } = req.body;
  const tx = await prisma.transaction.findFirst({ where: { id: transactionId, user_id: req.user.sub } });
  if (!tx) return res.status(404).json({ error: "Transaction not found" });

  const pm = await prisma.payment_Method.findFirst({ where: { id: paymentMethodId, user_id: req.user.sub } });
  if (!pm) return res.status(404).json({ error: "Payment method not found" });

  // actualizar estado de transacción y crear pago
  const payment = await prisma.$transaction(async (db) => {
    const updatedTx = await db.transaction.update({ where: { id: tx.id }, data: { status: "AUTHORIZED" } });
    const pay = await db.payment.create({
      data: {
        transaction: { connect: { id: updatedTx.id } },
        payment_method: { connect: { id: pm.id } },
        status: "CAPTURED",
        provider_ref    : `SIM-${updatedTx.reference}`
      }
    });
    await db.transaction.update({ where: { id: updatedTx.id }, data: { status: "SETTLED" } });
    return pay;
  });

  res.status(201).json(payment);
}

export async function refund(req: any, res: any) {
    const { paymentId } = req.params;
    const pay = await prisma.payment.findUnique({ where: { id: paymentId }, include: { transaction: true } });
    if (!pay || pay.transaction.user_id !== req.user.sub) return res.status(404).json({ error: "Payment not found" });
    const updated = await prisma.payment.update({ where: { id: paymentId }, data: { status: "REFUNDED" } });
    await prisma.transaction.update({ where: { id: pay.transaction_id }, data: { status: "REFUNDED" } });
    res.json(updated);
}

