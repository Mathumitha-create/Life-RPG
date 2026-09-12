import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`[LifeRPG API] Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});

process.on("SIGTERM", () => {
  console.log("[LifeRPG API] SIGTERM received. Closing HTTP server...");
  server.close(() => {
    console.log("[LifeRPG API] HTTP server closed.");
    process.exit(0);
  });
});
