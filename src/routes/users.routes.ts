import { Router } from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth";
import * as controller from "../controllers/users.controller";
const route = Router();

route.get("/", requireAuth, requireAdmin, controller.list);
route.get("/:id", requireAuth, requireAdmin, controller.getOne);
route.patch("/:id", requireAuth, requireAdmin, controller.update);
route.delete("/:id", requireAuth, requireAdmin, controller.remove);

export default route;