import { ENV } from "./lib/env";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { globalErrorHandler } from "./middlewares/error.middleware";
import authRouter from "./routes/auth.route";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(
  cors({
    origin: ENV.NODE_ENV === "development" ? ["http://localhost:3000"] : [ENV.CORS_ORIGIN],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

app.use("/api/v1/auth", authRouter);

app.use(globalErrorHandler);

export { app };
