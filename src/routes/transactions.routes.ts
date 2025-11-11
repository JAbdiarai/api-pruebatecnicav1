import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import * as ctrl from "../controllers/transactions.controller";
const r = Router();

r.post("/", requireAuth, ctrl.create);
r.get("/", requireAuth, ctrl.listTransactions);
r.get("/:id", requireAuth, ctrl.getOne);
r.patch("/:id", requireAuth, ctrl.update); 
r.delete("/:id", requireAuth, ctrl.remove);

export default r;
