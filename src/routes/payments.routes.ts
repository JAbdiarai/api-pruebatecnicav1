import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import * as controller from "../controllers/payments.controller";
const route = Router();

// Metodos de pago
route.post("/methods", requireAuth, controller.addPaymentMethod);
route.get("/methods", requireAuth, controller.listPaymentMethods);
route.delete("/methods/:id", requireAuth, controller.removePaymentMethod);

// Pagos (autorización/captura/reembolso simulados)
route.post("/charge", requireAuth, controller.charge);
route.post("/refund/:paymentId", requireAuth, controller.refund);
export default route;