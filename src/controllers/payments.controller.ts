import { PrismaClient } from "@prisma/client";
import { encryptToBuffer } from "../config/crypto";
const prisma = new PrismaClient();

export async function addPaymentMethod(request: any, response: any) {
  const { brand, cardNumber, expMonth, expYear } = request.body;
  if (!cardNumber || cardNumber.length < 12) return response.status(400).json({ error: "PAN inválido" });
  const last4 = cardNumber.slice(-4);
  const { ciphertext, iv } = encryptToBuffer(JSON.stringify({ cardNumber, expMonth, expYear }));
  const paymentMethod = await prisma.payment_Method.create({
    data: { user: { connect: { id: request.user.sub } }, brand, last4, token_encrypted: ciphertext, iv }
  });
  response.status(201).json({ id: paymentMethod.id, brand: paymentMethod.brand, last4: paymentMethod.last4, created_at: paymentMethod.created_at });
}

export async function listPaymentMethods(request: any, response: any) {
  const paymentMethods = await prisma.payment_Method.findMany({ where: { user_id: request.user.sub }, select: { id: true, brand: true, last4: true, created_at: true } });
  response.json(paymentMethods);
}

export async function removePaymentMethod(request: any, response: any) {
  await prisma.payment_Method.delete({ where: { id: request.params.id } });
  response.status(204).end();
}

// simulated authorization/capture/refund
export async function charge(request: any, response: any) {
  const { transactionId, paymentMethodId } = request.body;
  const firstTransaction = await prisma.transaction.findFirst({ where: { id: transactionId, user_id: request.user.sub } });
  if (!firstTransaction) return response.status(404).json({ error: "Transaction not found" });

  const paymentMethod = await prisma.payment_Method.findFirst({ where: { id: paymentMethodId, user_id: request.user.sub } });
  if (!paymentMethod) return response.status(404).json({ error: "Payment method not found" });

  // update transaction to AUTHORIZED, create payment with CAPTURED, update transaction to SETTLED
  const transaction = await prisma.$transaction(async (db) => {
    const updatedTransaction = await db.transaction.update({ where: { id: firstTransaction.id }, data: { status: "AUTHORIZED" } });
    const pay = await db.payment.create({
      data: {
        transaction: { connect: { id: updatedTransaction.id } },
        payment_method: { connect: { id: paymentMethod.id } },
        status: "CAPTURED",
        provider_ref: `SIM-${updatedTransaction.reference}`
      }
    });
    await db.transaction.update({ where: { id: updatedTransaction.id }, data: { status: "SETTLED" } });
    return pay;
  });

  response.status(201).json(transaction);
}

export async function refund(requestuest: any, response: any) {
  const { paymentId } = requestuest.params;
  const payment = await prisma.payment.findUnique({ where: { id: paymentId }, include: { transaction: true } });
  if (!payment || payment.transaction.user_id !== requestuest.user.sub) return response.status(404).json({ error: "Payment not found" });
  const updated = await prisma.payment.update({ where: { id: paymentId }, data: { status: "REFUNDED" } });
  await prisma.transaction.update({ where: { id: payment.transaction_id }, data: { status: "REFUNDED" } });
  response.json(updated);
}

export async function listPayments(request: any, response: any) {
  const payments = await prisma.payment.findMany({
    where: { transaction: { user_id: request.user.sub } },
    orderBy: { created_at: "desc" }
  });
  response.json(payments);
}

