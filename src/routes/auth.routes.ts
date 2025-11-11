import { Router } from "express";
import * as controller from "../controllers/auth.controller";
const route = Router();

route.post("/register", controller.register);
route.post("/login", controller.login);

export default route;