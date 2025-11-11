import { PrismaClient } from "@prisma/client";
import { encryptToBuffer } from "../config/crypto";
const prisma = new PrismaClient();

export async function addPaymentMethod(request: any, response: any) {
  const { brand, pan, expMonth, expYear } = request.body;
  if (!pan || pan.length < 12) return response.status(400).json({ error: "PAN inválido" });
  const last4 = pan.slice(-4);
  const { ciphertext, iv } = encryptToBuffer(JSON.stringify({ pan, expMonth, expYear }));
  const pm = await prisma.payment_Method.create({
    data: { user: { connect: { id: request.user.id } }, brand, last4, token_encrypted: ciphertext, iv }
  });
  response.status(201).json({ id: pm.id, brand: pm.brand, last4: pm.last4, created_at: pm.created_at });
}

export async function listPaymentMethods(request: any, response: any) {
  const pms = await prisma.payment_Method.findMany({ where: { user_id: request.user.sub }, select: { id: true, brand: true, last4: true, created_at: true } });
  response.json(pms);
}

export async function removePaymentMethod(request: any, response: any) {
  await prisma.payment_Method.delete({ where: { id: request.params.id } });
  response.status(204).end();
}

// Simulación de cobro: autoriza y captura
export async function charge(request: any, response: any) {
  const { transactionId, paymentMethodId } = request.body;
  const transaction = await prisma.transaction.findFirst({ where: { id: transactionId, user_id: request.user.sub } });
  if (!transaction) return response.status(404).json({ error: "Transaction not found" });

  const paymentMethod = await prisma.payment_Method.findFirst({ where: { id: paymentMethodId, user_id: request.user.sub } });
  if (!paymentMethod) return response.status(404).json({ error: "Payment method not found" });

  // actualizar estado de transacción y crear pago
  const payment = await prisma.$transaction(async (db) => {
    const updatedTx = await db.transaction.update({ where: { id: transaction.id }, data: { status: "AUTHORIZED" } });
    const pay = await db.payment.create({
      data: {
        transaction: { connect: { id: updatedTx.id } },
        payment_method: { connect: { id: paymentMethod.id } },
        status: "CAPTURED",
        provider_ref    : `SIM-${updatedTx.reference}`
      }
    });
    await db.transaction.update({ where: { id: updatedTx.id }, data: { status: "SETTLED" } });
    return pay;
  });

  response.status(201).json(payment);
}

export async function refund(requestuest: any, response: any) {
    const { paymentId } = requestuest.params;
    const payment = await prisma.payment.findUnique({ where: { id: paymentId }, include: { transaction: true } });
    if (!payment || payment.transaction.user_id !== requestuest.user.sub) return response.status(404).json({ error: "Payment not found" });
    const updated = await prisma.payment.update({ where: { id: paymentId }, data: { status: "REFUNDED" } });
    await prisma.transaction.update({ where: { id: payment.transaction_id }, data: { status: "REFUNDED" } });
    response.json(updated);
}

