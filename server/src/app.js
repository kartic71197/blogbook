import express from "express";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import { notFound, errorHandler } from "./middleware/error.middleware.js";



const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use((req, res, next) => {
    req.body ??= {};
    next();
});

app.use(cookieParser());

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);       // no route matched → 404
app.use(errorHandler);   // something threw → format the error

export default app;