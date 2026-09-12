import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { requestIdMiddleware } from "./middleware/requestId.js";
import { standardRateLimiter } from "./middleware/rateLimit.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiRouter } from "./routes/api.js";

export function createApp(): express.Express {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
    })
  );

  // Request parsing
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // Request ID & rate limiting
  app.use(requestIdMiddleware);
  app.use(standardRateLimiter);

  // Mount API routes
  app.use("/api/v1", apiRouter);

  // Global error handler
  app.use(errorHandler);

  return app;
}
