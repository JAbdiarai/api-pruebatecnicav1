import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import * as controller from "../controllers/payments.controller";
const route = Router();

// payment methods
route.post("/payment-methods", requireAuth, controller.addPaymentMethod);
route.get("/payment-methods", requireAuth, controller.listPaymentMethods);
route.delete("/payment-methods/:id", requireAuth, controller.removePaymentMethod);

// Payments (simulated authorization/capture/refund)

route.post("/charge", requireAuth, controller.charge);
route.post("/refund/:paymentId", requireAuth, controller.refund);
route.get("/", requireAuth, controller.listPayments);
export default route;