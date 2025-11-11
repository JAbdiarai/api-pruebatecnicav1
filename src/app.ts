import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { simpleRateLimit } from "./middlewares/rateLimit";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import transactionRoutes from "./routes/transactions.routes";
import paymentRoutes from "./routes/payments.routes";
import { errorHandler } from "./middlewares/error";

const app = express();
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(simpleRateLimit);

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/payments", paymentRoutes);

app.use(errorHandler);
export default app;
